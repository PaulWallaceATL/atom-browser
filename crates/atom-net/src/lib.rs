mod client;

pub use client::AtomClient;

/// Errors originating from the networking layer.
#[derive(Debug, thiserror::Error)]
pub enum NetError {
    #[error("request failed: {0}")]
    Request(#[from] reqwest::Error),

    #[error("invalid URL: {0}")]
    InvalidUrl(#[from] url::ParseError),

    #[error("connection timed out")]
    Timeout,

    #[error("{0}")]
    Other(String),
}
