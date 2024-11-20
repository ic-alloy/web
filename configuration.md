# Configuration

The `IcpConfig` struct is used to configure the ICP provider and transport when making requests to the Internet Computer. The `IcpConfig` struct has the following fields:

## `new(rpc_service: RpcService)`

Creates a new `IcpConfig` object with the given `RpcService` and default values for the other fields.

::: tip
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

ICP uses [HTTPS Outcalls](https://internetcomputer.org/docs/current/references/https-outcalls-how-it-works) to make requests to the EVM RPC. The cost of those calls is determined by the size of the response received.

Setting the max response size for the config allows you to optimise the cost of requests made. If the response size exceeds the max response size, the request will fail with an error.

The default value is `5_000`.

If set, this value will be used for all requests made with the provider created with this config.

::: tip
Many Alloy operations involve sending multiple calls to the EVM RPC.

**Recommendation**: Do not set a global `max_response_size` for operations that involve multiple requests.  Instead, the ICP transport uses default values tailored for specific RPC calls with known response sizes.

 ### Response Size Levels
 1. **Small**: `1_000`
 2. **Medium**: `2_000`
 3. **Unknown/Default**: `5_000`

### RPC Call Levels
**Small**:  
- `eth_blockNumber`
- `eth_getBalance`
- `eth_chainId`
- `eth_estimateGas`
- `eth_gasPrice`
- `eth_getBlockTransactionCountByHash`
- `eth_getBlockTransactionCountByNumber`
- `eth_getCode`
- `eth_getProof`
- `eth_getStorageAt`
- `eth_getTransactionCount`
- `eth_getUncleCountByBlockHash`
- `eth_getUncleCountByBlockNumber`
- `eth_maxPriorityFeePerGas`
- `eth_protocolVersion`

**Medium**:  
- `eth_feeHistory`  
- `eth_getTransactionByBlockHashAndIndex`  
- `eth_getTransactionByHash` 

**Default**:
- All other RPC calls
  
:::
