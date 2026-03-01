export type UserTier = "starter" | "pro" | "enterprise";

export type GateContext = {
  skillRank: number;
  integrity: number;
  contribution: number;
  completedTeachingSessions: number;
  tier: UserTier;
};

export function canUnlockAdvancedChallenge(ctx: GateContext) {
  const tierAllowed = ctx.tier === "pro" || ctx.tier === "enterprise";
  return tierAllowed && ctx.skillRank >= 750 && ctx.integrity >= 80 && ctx.contribution >= 60;
}

export function canAccessRecruiterTrustDashboard(ctx: GateContext) {
  return ctx.tier === "enterprise" && ctx.integrity >= 85;
}

export function canRequestMentorRole(ctx: GateContext) {
  return ctx.completedTeachingSessions >= 3 && ctx.integrity >= 82;
}
