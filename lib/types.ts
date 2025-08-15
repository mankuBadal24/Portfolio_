export type Brand = typeof import("./brand").BRAND;

export type Language = {
  name: string;
  color?: string | null;
};

export type Repo = {
  id: string;
  name: string;
  description?: string | null;
  stargazerCount: number;
  forkCount: number;
  primaryLanguage?: Language | null;
  languages?: Language[];
  topics?: string[];
  updatedAt: string; // ISO
  homepageUrl?: string | null;
  htmlUrl: string;
  openGraphImageUrl?: string | null;
  owner: { login: string };
  visibility: "PUBLIC" | "PRIVATE" | string;
};

export type PinnedResponse = {
  ok: boolean;
  reason?: string;
  data: Repo[];
  rate?: RateInfo;
};

export type ReposResponse = {
  ok: boolean;
  reason?: string;
  data: Repo[];
  pageInfo: {
    hasNextPage: boolean;
    nextCursor?: string | null;
  };
  rate?: RateInfo;
};

export type RateInfo = {
  limit?: number;
  remaining?: number;
  reset?: number; // epoch seconds
};

export type ReposQuery = {
  username: string;
  cursor?: string | null;
  perPage?: number;
  sort?: "updated" | "stars";
  language?: string;
  q?: string;
};
