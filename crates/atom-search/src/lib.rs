pub mod provider;
pub mod aggregator;

pub use aggregator::SearchAggregator;
pub use provider::{SearchProvider, SearchResult};

/// Errors from the search engine.
#[derive(Debug, thiserror::Error)]
pub enum SearchError {
    #[error("provider error: {0}")]
    Provider(String),

    #[error("request failed: {0}")]
    Request(#[from] reqwest::Error),

    #[error("no results from any provider")]
    NoResults,

    #[error("{0}")]
    Other(String),
}
