use crate::NetError;
use reqwest::{Client, Response};
use std::time::Duration;
use url::Url;

/// Privacy-respecting HTTP client built on reqwest with Rustls.
///
/// Configured with no referrer policy, strict redirect limits,
/// and a custom user-agent to minimize fingerprinting surface.
pub struct AtomClient {
    inner: Client,
}

impl AtomClient {
    pub fn new() -> Result<Self, NetError> {
        let inner = Client::builder()
            .use_rustls_tls()
            .user_agent("AtomBrowser/0.1")
            .referer(false)
            .redirect(reqwest::redirect::Policy::limited(5))
            .timeout(Duration::from_secs(30))
            .connect_timeout(Duration::from_secs(10))
            .https_only(false) // allow http for local dev; enforce in production via policy
            .build()
            .map_err(NetError::Request)?;

        Ok(Self { inner })
    }

    pub async fn get(&self, url: &Url) -> Result<Response, NetError> {
        let resp = self.inner.get(url.as_str()).send().await?;
        Ok(resp)
    }

    pub async fn get_text(&self, url: &Url) -> Result<String, NetError> {
        let resp = self.get(url).await?;
        let text = resp.text().await?;
        Ok(text)
    }

    /// Access the underlying reqwest client for advanced use cases.
    pub fn raw(&self) -> &Client {
        &self.inner
    }
}

impl Default for AtomClient {
    fn default() -> Self {
        Self::new().expect("failed to build default AtomClient")
    }
}
