use std::collections::HashMap;

use crate::provider::{SearchProvider, SearchResult};
use crate::SearchError;

/// Aggregates results from multiple search providers, de-duplicates, and re-ranks.
pub struct SearchAggregator {
    providers: Vec<Box<dyn SearchProvider>>,
}

impl SearchAggregator {
    pub fn new() -> Self {
        Self {
            providers: Vec::new(),
        }
    }

    pub fn add_provider(&mut self, provider: Box<dyn SearchProvider>) {
        self.providers.push(provider);
    }

    /// Query all providers concurrently, merge and de-duplicate results.
    pub async fn search(&self, query: &str, page: u32) -> Result<Vec<SearchResult>, SearchError> {
        let futures: Vec<_> = self
            .providers
            .iter()
            .map(|p| p.search(query, page))
            .collect();

        let results = futures::future::join_all(futures).await;

        let mut seen_urls: HashMap<String, usize> = HashMap::new();
        let mut merged: Vec<SearchResult> = Vec::new();

        for provider_results in results.into_iter().flatten() {
            for result in provider_results {
                let normalized = result.url.trim_end_matches('/').to_lowercase();
                if seen_urls.contains_key(&normalized) {
                    continue;
                }
                seen_urls.insert(normalized, merged.len());
                merged.push(result);
            }
        }

        if merged.is_empty() {
            return Err(SearchError::NoResults);
        }

        Ok(merged)
    }
}

impl Default for SearchAggregator {
    fn default() -> Self {
        Self::new()
    }
}
