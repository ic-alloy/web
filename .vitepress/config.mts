import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "ic-alloy",
  description:
    "A fork of Alloy with added support for the Internet Computer (ICP).",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "Home", link: "/" },
      {
        text: "Toolkit demo",
        link: "https://u4yi6-xiaaa-aaaap-aib2q-cai.icp0.io",
      },
      {
        text: "Wallet demo",
        link: "https://7vics-6yaaa-aaaai-ap7lq-cai.icp0.io",
      },
    ],

    sidebar: [
      {
        text: "Docs",
        items: [
          { text: "Getting Started", link: "/getting-started" },
          { text: "Configuration", link: "/configuration" },
          { text: "Provider", link: "/provider" },
          { text: "Client", link: "/client" },
        ],
      },
    ],

    socialLinks: [{ icon: "github", link: "https://github.com/ic-alloy" }],
  },
});
