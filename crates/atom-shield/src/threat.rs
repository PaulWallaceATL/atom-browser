use serde::{Deserialize, Serialize};

/// Classification of the type of threat detected.
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub enum ThreatCategory {
    Phishing,
    Malware,
    MaliciousScript,
    SuspiciousDownload,
    TrackingAbuse,
    Unknown,
}

/// The result of analyzing a URL, script, or download for threats.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "level", rename_all = "camelCase")]
pub enum ThreatAssessment {
    Safe,
    Suspicious {
        confidence: f32,
        category: ThreatCategory,
        reason: String,
    },
    Malicious {
        category: ThreatCategory,
        reason: String,
    },
}

impl ThreatAssessment {
    pub fn is_safe(&self) -> bool {
        matches!(self, Self::Safe)
    }

    pub fn is_blocking(&self) -> bool {
        matches!(self, Self::Malicious { .. })
    }
}
