export const MEMBER_ROLES = {
  ADMIN: "ADMIN",
  MODERATOR: "MODERATOR",
  MEMBER: "MEMBER",
} as const;

export const CARD_STATUS = {
  ACTIVE: "ACTIVE",
  ARCHIVED: "ARCHIVED",
} as const;

export type MemberRole = (typeof MEMBER_ROLES)[keyof typeof MEMBER_ROLES];
export type CardStatus = (typeof CARD_STATUS)[keyof typeof CARD_STATUS];
