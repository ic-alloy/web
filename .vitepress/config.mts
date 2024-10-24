import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "ic-alloy",
  description:
    "A fork of Alloy with added support for the Internet Computer (ICP).",
  head: [
    ["link", { rel: "icon", href: "/favicon.svg" }],
    [
      "meta",
      {
        property: "og:url",
        content: "https://o7kje-7yaaa-aaaal-qnaua-cai.icp0.io/",
      },
    ],
    ["meta", { property: "og:type", content: "website" }],
    ["meta", { property: "og:title", content: "ic-alloy | Docs" }],
    [
      "meta",
      {
        property: "og:description",
        content:
          "A fork of Alloy with added support for the Internet Computer (ICP).",
      },
    ],
    ["meta", { property: "og:image", content: "/ogimage.png" }],

    ["meta", { name: "twitter:card", content: "summary_large_image" }],
    [
      "meta",
      {
        property: "twitter:url",
        content: "https://o7kje-7yaaa-aaaal-qnaua-cai.icp0.io/",
      },
    ],
    ["meta", { name: "twitter:title", content: "ic-alloy | Docs" }],
    ["meta", { name: "twitter:creator", content: "@kristoferlund" }],
    [
      "meta",
      {
        name: "twitter:description",
        content:
          "A fork of Alloy with added support for the Internet Computer (ICP).",
      },
    ],
    ["meta", { name: "twitter:image", content: "/ogimage.png" }],
  ],
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
