# Configuration

The `IcpConfig` struct is used to configure the ICP provider and transport when making requests to the Internet Computer. The `IcpConfig` struct has the following fields:

## `new(rpc_service: RpcService)`

Creates a new `IcpConfig` object with the given `RpcService` and default values for the other fields.

::: warning
The EVM RPC canister runs on the fiduciary subnet that currently has 34 nodes. When making a EVM call through the RPC canister, it is executed by all those nodes. This means that a single call to the EVM RPC canister results in 34 RPC calls being made. This can lead to the ceiling of number of requests per second being hit and the RPC provider responding with an error.

To avoid this, a deduplication proxy can be used between the EVM RPC canister and the RPC service (Alchemy, etc). In that case, the url of that proxy should be used as the `RpcService` when creating the `IcpConfig`.

```Rust
let rpc_service = RpcService::Custom(RpcApi {
    url: "https://[url]".to_string(),
    headers: None,
})
```

Example: [A deduplicating EVM RPC proxy for Cloudflare](https://github.com/ic-alloy/ic-alloy-evm-rpc-proxy)
:::

## `set_call_cycles(call_cycles: u128)`

Sets the call cycles for this config. The call cycles determine the amount of cycles allocated to the request. The default value is `60_000_000_000`.

## `set_max_response_size(max_response_size: u64)`

Sets the max response size for this config. The max response size determines the maximum size of the response that can be received. The default value is `10_000`.

::: tip
Many Alloy operations involves sending multiple calls to the EVM RPC. In those cases, make sure to set the `call_cycles` and `max_response_size` to appropriate values to avoid running out of cycles or exceeding the response size limit.

Optimisations for this is behaviour is planned for future releases that would set default max response size based on the operation being performed.
:::
