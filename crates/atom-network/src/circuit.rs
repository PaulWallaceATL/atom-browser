use serde::{Deserialize, Serialize};

use crate::relay::RelayId;

/// Unique identifier for an onion routing circuit.
#[derive(Debug, Clone, PartialEq, Eq, Hash, Serialize, Deserialize)]
pub struct CircuitId(pub u64);

/// Represents a multi-hop circuit through the AtomNet network.
///
/// A circuit consists of a guard relay, one or more middle relays,
/// and an exit relay. All traffic is encrypted in layers (onion routing).
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Circuit {
    pub id: CircuitId,
    pub hops: Vec<RelayId>,
    pub state: CircuitState,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub enum CircuitState {
    Building,
    Open,
    Closed,
    Failed(String),
}
