use async_trait::async_trait;

use crate::threat::ThreatAssessment;
use crate::script_analyzer::ScriptAnalyzer;

/// Configuration for the cloud-based AI analysis backend.
#[derive(Debug, Clone, serde::Deserialize)]
pub struct CloudConfig {
    pub api_url: String,
    pub api_key: String,
}

/// Cloud-based AI analyzer that delegates to the Atom Shield API.
///
/// In production, this calls our Linode-hosted LLM inference service.
/// For development, it can point at a local mock server.
pub struct CloudAnalyzer {
    config: CloudConfig,
    client: reqwest::Client,
}

impl CloudAnalyzer {
    pub fn new(config: CloudConfig) -> Self {
        Self {
            config,
            client: reqwest::Client::new(),
        }
    }

    /// Analyze a URL via the cloud Atom Shield API.
    pub async fn analyze_url(&self, url: &str) -> ThreatAssessment {
        let _endpoint = format!("{}/v1/analyze/url", self.config.api_url);
        let _ = (url, &self.client);
        // Stub: cloud integration will be implemented in Phase 3
        ThreatAssessment::Safe
    }
}

#[async_trait]
impl ScriptAnalyzer for CloudAnalyzer {
    async fn analyze(&self, _script_source: &str) -> ThreatAssessment {
        let _endpoint = format!("{}/v1/analyze/script", self.config.api_url);
        // Stub: cloud integration will be implemented in Phase 3
        ThreatAssessment::Safe
    }
}
