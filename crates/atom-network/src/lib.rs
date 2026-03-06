pub mod relay;
pub mod circuit;
pub mod client;

pub use relay::{Relay, RelayId, RelayRole};
pub use circuit::{Circuit, CircuitId};
pub use client::AtomNetClient;

/// Errors from the AtomNet anonymity layer.
#[derive(Debug, thiserror::Error)]
pub enum AtomNetError {
    #[error("circuit construction failed: {0}")]
    CircuitBuild(String),

    #[error("relay unreachable: {0}")]
    RelayUnreachable(String),

    #[error("not connected to the AtomNet network")]
    NotConnected,

    #[error("{0}")]
    Other(String),
}
