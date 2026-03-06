use crate::threat::{ThreatAssessment, ThreatCategory};
use url::Url;

/// On-device URL classifier.
///
/// In the future this will load an ONNX model for ML-based classification.
/// For now it uses heuristic rules as a placeholder.
pub struct UrlClassifier {
    _private: (),
}

impl UrlClassifier {
    pub fn new() -> Self {
        Self { _private: () }
    }

    /// Classify a URL using on-device heuristics.
    ///
    /// Returns a `ThreatAssessment` indicating whether the URL appears safe,
    /// suspicious, or known-malicious.
    pub fn classify(&self, url: &Url) -> ThreatAssessment {
        let host = url.host_str().unwrap_or_default();

        // Heuristic: IP-address URLs are suspicious
        if host.parse::<std::net::IpAddr>().is_ok() && url.scheme() == "http" {
            return ThreatAssessment::Suspicious {
                confidence: 0.6,
                category: ThreatCategory::Phishing,
                reason: "Plain HTTP to IP address".into(),
            };
        }

        // Heuristic: excessively long hostnames
        if host.len() > 60 {
            return ThreatAssessment::Suspicious {
                confidence: 0.5,
                category: ThreatCategory::Phishing,
                reason: "Unusually long hostname".into(),
            };
        }

        ThreatAssessment::Safe
    }
}

impl Default for UrlClassifier {
    fn default() -> Self {
        Self::new()
    }
}
