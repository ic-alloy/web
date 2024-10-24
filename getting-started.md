# Getting Started



Smart contracts on [ICP](https://internetcomputer.org) can directly interact with the Ethereum network and other networks that are using the Ethereum Virtual Machine (EVM), such as Polygon and Avalanche. This integration is possible thanks to ICP's [HTTPS outcalls](https://internetcomputer.org/https-outcalls) and [threshold ECDSA](https://internetcomputer.org/capabilities/multi-chain-transactions/) features.

[Alloy](https://alloy.rs/) implements high-performance, well-tested & documented libraries for interacting with Ethereum and other EVM-based chains.

This fork of Alloy adds support for the [Internet Computer](https://internetcomputer.org) (ICP) both as a transport layer and as a signer. Using Alloy with ICP makes interacting with the EVM from inside an ICP canister easier and more secure as `ic-alloy` abstracts away a lot of complexities.

::: tip
`ic-alloy` is in early development and is not yet ready for production use.
:::

Before diving in and adding `ic-alloy` to your project, we recommend you read the [Alloy documentation](https://alloy.rs/) to get familiar with the library.

## See examples

You can see two live examples of how to use `ic-alloy`:

- [ic-alloy-toolkit](https://github.com/ic-alloy/ic-alloy-toolkit): A collection of examples on how to perform common EVM operations. [Live demo](https://u4yi6-xiaaa-aaaap-aib2q-cai.icp0.io)
- [ic-alloy-basic-wallet](https://github.com/ic-alloy/ic-alloy-basic-wallet): A basic Ethereum multi-user wallet. [Live demo](https://7vics-6yaaa-aaaai-ap7lq-cai.icp0.io)


## Setup

To use the ICP enabled fork of Alloy in your project, add this to `Cargo.toml`:

```toml
alloy = { git = "https://github.com/ic-alloy/ic-alloy.git", default-features = false, branch = "icp", features = ["icp"]}
```



To use the `sol!()` macro, add the following crate features:

- `sol-types`
- `json`
- `contract`

## Example - Get ETH balance

As a first example, let's see how to get the balance of an Ethereum address.

```Rust
#[ic_cdk::update]
async fn get_balance(address: String) -> Result<String, String> {
    let address = address.parse::<Address>().map_err(|e| e.to_string())?;
    let rpc_service = RpcService::EthSepolia(EthSepoliaService::Alchemy);
    let config = IcpConfig::new(rpc_service);
    let provider = ProviderBuilder::new().on_icp(config);
    let result = provider.get_balance(address).await;
    match result {
        Ok(balance) => Ok(balance.to_string()),
        Err(e) => Err(e.to_string()),
    }
}
```

### 1. Parse address

```Rust
let address = address.parse::<Address>().map_err(|e| e.to_string())?;
```

First, we parse the address string into an Alloy `Address` type. This ensures that the address is valid and causes the function to return an error if it is not.

### 2. Create a RPC service

```Rust
let rpc_service = RpcService::EthSepolia(EthSepoliaService::Alchemy);
```

Next, we create a `RpcService` that instructs the EVM RPC canister to use Alchemy as the RPC provider. See the [list of RPC providers](https://internetcomputer.org/docs/current/developer-docs/multi-chain/ethereum/evm-rpc/overview) the EVM RPC canister supports.

### 3. Create a config object

```Rust
let config = IcpConfig::new(rpc_service);
```

The config object determines the behaviour of the ICP provider and transport when making the request. The `new` function takes the `RpcService` we created in the previous step and uses default values for the other fields.

See more [configuration options](./configuration)

### 4. Create a provider

```Rust
let provider = ProviderBuilder::new().on_icp(config);
```

The `ProviderBuilder` is a helper that allows you to create a provider with a specific configuration. In this case, we use the `on_icp` method to create a provider that uses the ICP transport layer.

### 5. Get the balance

```Rust
let result = provider.get_balance(address).await;
```

Finally, we call the `get_balance` method on the provider to get the balance of the address. The method returns a `Result` that we can match on to get the balance or an error.

Read more [about the Provider](/provider)
