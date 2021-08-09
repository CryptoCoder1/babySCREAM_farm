import { constants } from "ethers";
import { DEFAULT_CHAIN_ID } from "./constants";

export type PoolInfo = {
  // public data
  pid: number;
  active: boolean;
  multiplier: string;
  depositFees: number;
  farmDx?: string;

  // lp data
  lpToken: string;
  lpAddress: string;
  totalStaked: string;
  decimals: number;
  price?: string;
  apy: string;
  apr: number;

  // user data
  hasStaked: boolean;
  hasApprovedPool: boolean;
  irisEarned: string;
  lpStaked: string;
};

export const poolIds = {
  250: [0, 1, 2, 3, 4, 5, 6, 7],
  80001: [1],
}[DEFAULT_CHAIN_ID];

export const farmIds = {
  250: [8],
  80001: [],
}[DEFAULT_CHAIN_ID];

export const poolDefaultData = {
  250: [],
  80001: [],
}[DEFAULT_CHAIN_ID];

export const farmsDefaultData = {
  250: [
    {
      pid: 8,
      active: true,
      multiplier: "80",
      depositFees: 0,
      farmDx: "Quickswap",
      lpToken: "IRIS/WMATIC",
      lpAddress: constants.AddressZero,
      price: "0",
      totalStaked: 0,
      hasStaked: false,
      hasApprovedPool: false,
      irisEarned: "0",
      lpStaked: "0",
    },
  ],
  80001: [],
}[DEFAULT_CHAIN_ID];
