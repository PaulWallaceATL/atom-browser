use async_trait::async_trait;
use serde::{Deserialize, Serialize};

use crate::SearchError;

/// A single search result.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SearchResult {
    pub title: String,
    pub url: String,
    pub snippet: String,
    pub source: String,
}

/// Trait for pluggable upstream search providers.
///
/// Each implementation knows how to query a specific search engine
/// (Google, Bing, Brave Search, DuckDuckGo, etc.) and parse the results.
#[async_trait]
pub trait SearchProvider: Send + Sync {
    /// Human-readable name of the upstream provider.
    fn name(&self) -> &str;

    /// Query the upstream provider and return parsed results.
    async fn search(&self, query: &str, page: u32) -> Result<Vec<SearchResult>, SearchError>;
}
