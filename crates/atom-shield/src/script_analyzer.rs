use async_trait::async_trait;

use crate::threat::ThreatAssessment;

/// Trait for analyzing JavaScript source code for malicious patterns.
///
/// Implementations may run on-device (heuristic) or delegate to a cloud LLM.
#[async_trait]
pub trait ScriptAnalyzer: Send + Sync {
    /// Analyze JavaScript source and return a threat assessment.
    async fn analyze(&self, script_source: &str) -> ThreatAssessment;
}

/// Placeholder on-device script analyzer using pattern matching.
///
/// Will be replaced with an ONNX or LLM-based analyzer in Phase 3.
pub struct HeuristicScriptAnalyzer;

#[async_trait]
impl ScriptAnalyzer for HeuristicScriptAnalyzer {
    async fn analyze(&self, _script_source: &str) -> ThreatAssessment {
        // Stub: all scripts pass for now.
        ThreatAssessment::Safe
    }
}
