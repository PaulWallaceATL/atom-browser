use serde::{Deserialize, Serialize};
use std::net::SocketAddr;

/// Unique identifier for a relay in the AtomNet network.
#[derive(Debug, Clone, PartialEq, Eq, Hash, Serialize, Deserialize)]
pub struct RelayId(pub String);

/// The role a relay plays in the network.
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub enum RelayRole {
    Guard,
    Middle,
    Exit,
}

/// Descriptor for a single relay node.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Relay {
    pub id: RelayId,
    pub address: SocketAddr,
    pub role: RelayRole,
    pub bandwidth_kbps: u64,
    pub uptime_secs: u64,
}
