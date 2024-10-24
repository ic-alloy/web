# RPC Client

`ic-alloy` makes some additions to the default `rpc-client` provided by Alloy:
- Adds the `icp()` function to the `ClientBuilder`, a convenience function to create a new `RpcClient` with an `IcpTransport` using the given `IcpConfig` details.
- Adapts the `new_batch()` function to support `IcpTransport` for batch requests.
- Adds the `IcpPollerBuilder` used for watching for logs, transactions and blocks. The ICP poller relies on [IC timers](https://internetcomputer.org/docs/current/developer-docs/smart-contracts/advanced-features/periodic-tasks/#timers) for continuously listening to events.
- Adds the `IcpClient` type that maps to `IcpTransport`
  - `pub type IcpClient = RpcClient<alloy_transport_icp::IcpTransport>;`

## Example: Batch getting balances

```rust
#[ic_cdk::update]
async fn get_batch_balances(addresses: Vec<String>) -> Result<String, String> {
    let rpc_service = get_rpc_service_sepolia();
    let config = IcpConfig::new(rpc_service);
    let client: IcpClient = ClientBuilder::default().icp(config);
    let mut batch = client.new_batch();
    let tag = BlockNumberOrTag::Latest;
    let mut get_balance_calls = Vec::new();

    for address in addresses {
        let address = match address.parse::<Address>() {
            Ok(addr) => addr,
            Err(e) => return Err(e.to_string()),
        };
        let call = batch.add_call("eth_getBalance", &(address, tag)).unwrap();
        get_balance_calls.push(call);
    }

    batch.send().await.unwrap();

    let mut balances = Vec::new();
    for call in get_balance_calls {
        let balance: U256 = call.await.unwrap();
        balances.push(balance.to_string());
    }

    Ok(balances.join(","))
}
```
Request the balances of multiple ETH accounts in one batch. Batch requests can contain different types of requests.

[See full example](https://github.com/ic-alloy/ic-alloy-toolkit/blob/main/src/backend/src/service/get_batch_balances.rs)
