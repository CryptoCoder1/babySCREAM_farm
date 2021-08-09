export interface NavItem {
  label: string;
  isExternal?: boolean;
  decorate?: boolean;
  subLabel?: string;
  children?: Array<NavItem>;
  href?: string;
}

export const NAV_ITEMS: Array<NavItem> = [
  {
    label: "Home",
    href: "/app",
  },

  {
    label: "Trade",
    children: [
      {
        label: "Swap (SpookySwap)",
        href: "https://spookyswap.finance/swap",
        isExternal: true,
      },
      {
        label: "Liquidity (SpookySwap)",
        href: "https://spookyswap.finance/add",
        isExternal: true,
      },
    ],
  },

  {
    label: "Farms",
    href: "/app/farms",
  },

  {
    label: "Pools",
    href: "#",
  },

  {
    label: "Charts",
    href: "https://kek.tools/t/0xb508a36a19251b2ac07b33eb7e5505ee46b0c5eb",
    isExternal: true,
  },
  {
    label: "More",
    children: [
      // {
      //   label: "Docs",
      //   href: "https://hermes-defi.gitbook.io/hermes-finance/",
      //   isExternal: true,
      // },
      {
        label: "Github",
        href: "https://github.com/CryptoCoder1/babyscream",
        isExternal: true,
      },
      {
        label: "Telegram",
        href: "https://t.me/babyScream_Official",
        isExternal: true,
      },
      {
        label: "Twitter",
        href: "https://twitter.com/BabyScream_FTM",
        isExternal: true,
      },
      // {
      //   label: "Medium",
      //   href: "https://medium.com/@HermesDefi",
      //   isExternal: true,
      // },
    ],
  },
];
