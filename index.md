---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "ic-alloy"
  text: "A fork of Alloy that supports the Internet Computer (ICP)"
  tagline: Radically simplifies interacting with the EVM from inside an ICP canister
  actions:
    - theme: brand
      text: Getting Started
      link: /getting-started
    - theme: alt
      text: Live Wallet Demo
      link: https://7vics-6yaaa-aaaai-ap7lq-cai.icp0.io
    - theme: alt
      text: Live Toolkit Demo
      link: https://u4yi6-xiaaa-aaaap-aib2q-cai.icp0.io

features:
  - title: ICP Transport Layer
    details: Routes requests through the IC EVM RPC canister or an external RPC proxy.
  - title: ICP Signer
    details: Abstracts away the complexity of signing messages and transactions on ICP.
  - title: ICP Provider
    details: Provides a simple interface for interacting with the IC EVM RPC canister.
---
