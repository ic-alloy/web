# Provider

The `Provider` is the main entry point for interacting with Alloy. It exposes a number of convenience methods for interacting with Ethereum.

`ic-alloy` makes the following changes to the `Provider`:
- Adds the `on_icp()` function to build a provider using an `IcpTransport` with the given `IcpConfig`.
- Adapts the `watch_x` functions to work with the ICP poller.
- `watch_pending_transactions` is not available on ICP as it relies on heartbeat functionality not yet implemented

## Fillers

One of the great features of Alloy is that it hides the complexity of the underlying transport layer. When creating Ethereum transactions you need to specify the `nonce`, `gas_price` and `gas_limit`. Alloy can fill in these values for you.

### Example: Send Ethereum with fillers

```rust
let provider = ProviderBuilder::new()
    .with_recommended_fillers()
    .wallet(wallet)
    .on_icp(config);

let tx = TransactionRequest::default()
    .with_to(address)
    .with_value(U256::from(100));

let transport_result = provider.send_transaction(tx.clone()).await;
```
[See full example](https://github.com/ic-alloy/ic-alloy-toolkit/blob/main/src/backend/src/service/send_eth_with_fillers.rs)


Using `with_recommended_fillers` with the provider means the following RPC functions will be called before transaction is made:
- `eth_getTransactionCount`: To determine the nonce of the Transction
- `eth_chainId`: To determine the chain id
- `eth_feeHistory`: To determine historic gas price
- `eth_estimateGas`: To determine the gas limit
- `eth_sendRawTransaction`: The transaction
- `eth_getTransactionByHash`: To determine if transaction was successful. Increment nonce only if transaction was successful.

Using `with_recommended_fillers` is only recommended if you use a deduplication proxy between
the EVM RPC canister and the RPC service (Alchemy, etc). When making an EVM RPC call on IC,
that call is executed by all the nodes in the subnet, currently 34 on the subnet where the
EVM RPC canister resides. Using this example without a [deduplication proxy](https://github.com/ic-alloy/ic-alloy-evm-rpc-proxy) would result in 6 x 34 = 204 calls being made during the span of a few seconds. That most likely leads to the
ceiling of number of requests per second being hit and the RPC provider responding with an
error.

An alternative to using `with_recommended_fillers` is to manually set the `nonce`, `gas_price` and `gas_limit` values on the transaction request. This is recommended if you are not using a deduplication proxy.

### Example: Send ETH with manual nonce

```rust
let tx = TransactionRequest::default()
    .with_to(address)
    .with_value(U256::from(100))
    .with_nonce(nonce)
    .with_gas_limit(21_000)
    .with_chain_id(11155111);
```

In that case, it is recommended to keep a local cache of the nonce and increment it manually for each transaction.

[See full example](https://github.com/ic-alloy/ic-alloy-toolkit/blob/main/src/backend/src/service/send_eth.rs)

## Poller

The subscription features of Alloy are not supported on ICP. Instead, the `watch_logs` and `watch_blocks` methods are adapted to work with a poller that uses [IC timers](https://internetcomputer.org/docs/current/references/samples/rust/periodic_tasks/).

### Example: Watch for USDC transfers

```rust
// this callback will be called every time new logs are received
let callback = |incoming_logs: vec<log>| {
    state.with_borrow_mut(|state| {
        for log in incoming_logs.iter() {
            let transfer: log<usdc::transfer> = log.log_decode().unwrap();
            let usdc::transfer { from, to, value } = transfer.data();
            // Do something with the log information
        }

        state.poll_count += 1;
        if state.poll_count >= poll_limit {
            state.timer_id.take();
        }
    })
};

let usdt_token_address = address!("833589fcd6edb6e08f4c7c32d4f71b54bda02913");
let filter = filter::new()
    .address(usdt_token_address)
    // by specifying an `event` or `event_signature` we listen for a specific event of the
    // contract. in this case the `transfer(address,address,uint256)` event.
    .event(transfer::signature)
    .from_block(blocknumberortag::latest);

let poller = provider.watch_logs(&filter).await.unwrap();
let timer_id = poller
    .with_limit(some(poll_limit))
    .with_poll_interval(duration::from_secs(10))
    .start(callback)
    .unwrap();
```

The `callback` function is called every time new logs are received.

The `filter` is used to specify which logs to listen for. In this case, we are listening for the `transfer` event of the USDC contract. We use the `sol!` macro to get the event signature from the contract API file.

```rust
sol!(
    #[allow(missing_docs)]
    #[sol(abi)]
    USDC,
    "abi/USDC.json"
);
```

The `poller` can be configured with the following methods:
- `with_limit`: Limits the number of times to poll, defaults to 3
- `with_poll_interval`: Sets the interval between polls, defaults to 7 seconds


[See full example](https://github.com/ic-alloy/ic-alloy-toolkit/blob/main/src/backend/src/service/watch_usdc_transfer.rs)
