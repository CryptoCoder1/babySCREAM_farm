import { DEFAULT_CHAIN_ID } from "./constants";

export default {
  usdc: {
    decimals: 6,
    address: {
      250: "0xb508A36a19251b2AC07b33EB7e5505eE46B0C5eB",
      80001: "",
    }[DEFAULT_CHAIN_ID],
  },
};
