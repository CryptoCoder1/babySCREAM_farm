const isProd = process.env.NODE_ENV === "production";

export const DEFAULT_CHAIN_ID = isProd ? 250 : 250; // 80001;
