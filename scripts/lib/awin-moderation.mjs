import { mkdir, readFile, rename, rm, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

export const DEFAULT_CANDIDATES_PATH = "data/awin-candidates.json";
export const DEFAULT_MODERATION_PATH = "data/awin-moderation.json";
export const DEFAULT_PUBLIC_FEED_PATH = "public/data/promotions.json";

export const REVIEW_STATUSES = ["pending", "approved", "rejected"];

function isRecord(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

export function emptyModeration() {
  return {
    version: 1,
    updatedAt: null,
    decisions: {},
  };
}

export function normalizeModeration(value) {
  if (!isRecord(value) || !isRecord(value.decisions)) {
    return emptyModeration();
  }

  const decisions = {};

  for (const [id, decision] of Object.entries(value.decisions)) {
    if (
      typeof id !== "string" ||
      !isRecord(decision) ||
      !["approved", "rejected"].includes(decision.status)
    ) {
      continue;
    }

    decisions[id] = {
      status: decision.status,
      reviewedAt:
        typeof decision.reviewedAt === "string" ? decision.reviewedAt : null,
      ...(typeof decision.note === "string" && decision.note.trim()
        ? { note: decision.note.trim().slice(0, 500) }
        : {}),
    };
  }

  return {
    version: 1,
    updatedAt: typeof value.updatedAt === "string" ? value.updatedAt : null,
    decisions,
  };
}

export async function readJson(path, fallback = null) {
  try {
    return JSON.parse(await readFile(resolve(path), "utf8"));
  } catch (error) {
    if (error?.code === "ENOENT") {
      return fallback;
    }
    throw error;
  }
}

export async function writeJsonAtomic(path, value) {
  const outputPath = resolve(path);
  const temporaryPath = `${outputPath}.${process.pid}.tmp`;

  await mkdir(dirname(outputPath), { recursive: true });

  try {
    await writeFile(
      temporaryPath,
      `${JSON.stringify(value, null, 2)}\n`,
      "utf8",
    );
    await rename(temporaryPath, outputPath);
  } finally {
    await rm(temporaryPath, { force: true });
  }
}

export async function readModeration(path = DEFAULT_MODERATION_PATH) {
  return normalizeModeration(await readJson(path, emptyModeration()));
}

export function getDecisionStatus(moderation, promotionId) {
  return moderation.decisions[promotionId]?.status ?? "pending";
}

export function setDecision(
  moderation,
  promotionId,
  status,
  note = "",
  now = new Date(),
) {
  if (!["pending", "approved", "rejected"].includes(status)) {
    throw new Error(`Statut de modération invalide : ${status}`);
  }

  const next = normalizeModeration(moderation);
  const updatedAt = now.toISOString();

  if (status === "pending") {
    delete next.decisions[promotionId];
  } else {
    next.decisions[promotionId] = {
      status,
      reviewedAt: updatedAt,
      ...(String(note).trim()
        ? { note: String(note).trim().slice(0, 500) }
        : {}),
    };
  }

  next.updatedAt = updatedAt;
  return next;
}

export function summarizeReview(candidateFeed, moderation) {
  const promotions = Array.isArray(candidateFeed?.promotions)
    ? candidateFeed.promotions
    : [];
  const counts = { total: promotions.length, pending: 0, approved: 0, rejected: 0 };

  for (const promotion of promotions) {
    const status = getDecisionStatus(moderation, promotion.id);
    counts[status] += 1;
  }

  return counts;
}

export function buildPublishedFeed(candidateFeed, moderation, now = new Date()) {
  const promotions = Array.isArray(candidateFeed?.promotions)
    ? candidateFeed.promotions
    : [];
  const nowTime = now.getTime();
  const approvedPromotions = promotions.filter((promotion) => {
    const expiry = new Date(promotion.expiresAt).getTime();
    return (
      getDecisionStatus(moderation, promotion.id) === "approved" &&
      Number.isFinite(expiry) &&
      expiry > nowTime
    );
  });

  return {
    version: 2,
    source: "awin",
    moderation: "manual",
    membership: candidateFeed?.membership ?? "joined",
    publisherId: candidateFeed?.publisherId ?? null,
    generatedAt: candidateFeed?.generatedAt ?? now.toISOString(),
    reviewedAt: moderation.updatedAt,
    programmeCount: Number(candidateFeed?.programmeCount) || 0,
    candidateCount: promotions.length,
    offerCount: approvedPromotions.length,
    promotions: approvedPromotions,
  };
}

export async function publishApprovedOffers({
  candidatesPath = DEFAULT_CANDIDATES_PATH,
  moderationPath = DEFAULT_MODERATION_PATH,
  outputPath = DEFAULT_PUBLIC_FEED_PATH,
} = {}) {
  const candidateFeed = await readJson(candidatesPath);

  if (!candidateFeed || !Array.isArray(candidateFeed.promotions)) {
    throw new Error(
      `Aucune file d’attente valide trouvée dans ${resolve(candidatesPath)}.`,
    );
  }

  const moderation = await readModeration(moderationPath);
  const publicFeed = buildPublishedFeed(candidateFeed, moderation);
  await writeJsonAtomic(outputPath, publicFeed);

  return {
    candidateFeed,
    moderation,
    publicFeed,
    counts: summarizeReview(candidateFeed, moderation),
  };
}
