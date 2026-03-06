use crate::circuit::{Circuit, CircuitId, CircuitState};
use crate::relay::RelayId;
use crate::AtomNetError;

/// Client interface for connecting to the AtomNet anonymity network.
///
/// This is a stub implementation. The real onion-routing logic
/// (based on Arti) will be integrated in Phase 2.
pub struct AtomNetClient {
    connected: bool,
    next_circuit_id: u64,
}

impl AtomNetClient {
    pub fn new() -> Self {
        Self {
            connected: false,
            next_circuit_id: 1,
        }
    }

    /// Connect to the AtomNet network via directory authorities.
    pub async fn connect(&mut self) -> Result<(), AtomNetError> {
        // Stub: will bootstrap from directory authorities in Phase 2
        self.connected = true;
        tracing::info!("AtomNet client connected (stub)");
        Ok(())
    }

    /// Build a new circuit through the network.
    pub async fn build_circuit(&mut self) -> Result<Circuit, AtomNetError> {
        if !self.connected {
            return Err(AtomNetError::NotConnected);
        }

        let id = CircuitId(self.next_circuit_id);
        self.next_circuit_id += 1;

        // Stub: return a placeholder circuit
        Ok(Circuit {
            id,
            hops: vec![
                RelayId("guard-stub".into()),
                RelayId("middle-stub".into()),
                RelayId("exit-stub".into()),
            ],
            state: CircuitState::Open,
        })
    }

    pub fn is_connected(&self) -> bool {
        self.connected
    }
}

impl Default for AtomNetClient {
    fn default() -> Self {
        Self::new()
    }
}
