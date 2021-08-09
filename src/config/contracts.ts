import IrisTokenABI from "config/abis/IrisToken.json";
import MasterChefABI from "config/abis/MasterChef.json";
import screamABI from "config/abis/screamToken.json"
import ReferralABI from "config/abis/Referral.json";
import FenixABI from "config/abis/Fenix.json";
import RedeemABI from "config/abis/Redeem.json";
import ERC20ABI from "config/abis/ERC20.json";
import { DEFAULT_CHAIN_ID } from "config/constants";

export type ContractInfo = {
  address: string;
  abi: any;
};

export const erc20: (address: string) => ContractInfo = (address: string) => ({
  abi: ERC20ABI,
  address,
});

export default {
  referral: {
    address: {
      250: "0x24F3282A439EBd13a4F24fE8756a1d6aaC65570F",
      80001: "0x8295CCCA26e2e4396061515B0b72731BDf5796C1",
    }[DEFAULT_CHAIN_ID],
    abi: ReferralABI,
  },
  masterChef: {
    address: {
      250: "0xc5F43e0418754f39494a23220a485C5fB5cBC0b6",
      80001: "0xA3dc6b430A90D61e7f1C7800d43Bd67b8a06D597",
    }[DEFAULT_CHAIN_ID],
    abi: MasterChefABI,
  },
  irisToken: {
    address: {
      250: "0xb508A36a19251b2AC07b33EB7e5505eE46B0C5eB",
      80001: "0x5EB25908Abf8764CB101bE704d6Bb4a8d5254f72",
    }[DEFAULT_CHAIN_ID],
    abi: IrisTokenABI,
  },
  screamToken: {
    address: {
      250: "0xe0654C8e6fd4D733349ac7E09f6f23DA256bF475",
      80001: "0xe0654C8e6fd4D733349ac7E09f6f23DA256bF475",
    }[DEFAULT_CHAIN_ID],
    abi: screamABI,
  },
  fenixToken: {
    address: {
      250: "0x41013D1521B20CA67397e7c65256bfb2975FAAc8",
      80001: "0x807Be9676f72390bCaB19f914f770d9713a2d9e0",
    }[DEFAULT_CHAIN_ID],
    abi: FenixABI,
  },
  redeem: {
    address: {
      250: "0x0C72A971AB0D85689bDd95810BE54dD0C3aB3Ab3",
      80001: "0xC481Cc926522A14Ed21077B8eEd85c7C0947F62e",
    }[DEFAULT_CHAIN_ID],
    abi: RedeemABI,
  },
};
