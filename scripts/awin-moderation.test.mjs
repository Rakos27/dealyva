import assert from "node:assert/strict";
import {
  buildPublishedFeed,
  emptyModeration,
  getDecisionStatus,
  setDecision,
  summarizeReview,
} from "./lib/awin-moderation.mjs";

const now = new Date("2026-07-29T12:00:00.000Z");
const candidateFeed = {
  version: 2,
  source: "awin",
  membership: "joined",
  publisherId: "3010723",
  generatedAt: now.toISOString(),
  programmeCount: 2,
  promotions: [
    {
      id: "awin-active",
      expiresAt: "2026-08-15T23:59:59.000Z",
      title: "Offre active",
    },
    {
      id: "awin-rejected",
      expiresAt: "2026-08-20T23:59:59.000Z",
      title: "Offre refusée",
    },
    {
      id: "awin-expired",
      expiresAt: "2026-07-01T23:59:59.000Z",
      title: "Offre expirée",
    },
  ],
};

let moderation = emptyModeration();
assert.equal(getDecisionStatus(moderation, "awin-active"), "pending");

moderation = setDecision(
  moderation,
  "awin-active",
  "approved",
  "",
  now,
);
moderation = setDecision(
  moderation,
  "awin-rejected",
  "rejected",
  "Conditions imprécises",
  now,
);
moderation = setDecision(
  moderation,
  "awin-expired",
  "approved",
  "",
  now,
);

assert.deepEqual(summarizeReview(candidateFeed, moderation), {
  total: 3,
  pending: 0,
  approved: 2,
  rejected: 1,
});

const publicFeed = buildPublishedFeed(candidateFeed, moderation, now);
assert.equal(publicFeed.version, 2);
assert.equal(publicFeed.moderation, "manual");
assert.equal(publicFeed.candidateCount, 3);
assert.equal(publicFeed.offerCount, 1);
assert.deepEqual(
  publicFeed.promotions.map((promotion) => promotion.id),
  ["awin-active"],
);

moderation = setDecision(
  moderation,
  "awin-active",
  "pending",
  "",
  now,
);
assert.equal(getDecisionStatus(moderation, "awin-active"), "pending");
assert.equal(
  buildPublishedFeed(candidateFeed, moderation, now).offerCount,
  0,
);

console.log("Modération Awin : tests réussis.");
