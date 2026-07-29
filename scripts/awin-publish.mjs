import {
  DEFAULT_CANDIDATES_PATH,
  DEFAULT_MODERATION_PATH,
  DEFAULT_PUBLIC_FEED_PATH,
  publishApprovedOffers,
} from "./lib/awin-moderation.mjs";

const candidatesPath =
  process.env.AWIN_CANDIDATES_PATH?.trim() || DEFAULT_CANDIDATES_PATH;
const moderationPath =
  process.env.AWIN_MODERATION_PATH?.trim() || DEFAULT_MODERATION_PATH;
const outputPath =
  process.env.AWIN_OUTPUT_PATH?.trim() || DEFAULT_PUBLIC_FEED_PATH;

const { counts, publicFeed } = await publishApprovedOffers({
  candidatesPath,
  moderationPath,
  outputPath,
});

console.log(
  [
    `Publication préparée : ${publicFeed.offerCount} offre(s) approuvée(s).`,
    `${counts.pending} en attente, ${counts.rejected} refusée(s).`,
    `Flux écrit dans ${outputPath}.`,
  ].join("\n"),
);
