use url::Url;

/// Errors that can occur during engine operations.
#[derive(Debug, thiserror::Error)]
pub enum EngineError {
    #[error("navigation failed: {0}")]
    Navigation(String),

    #[error("invalid URL: {0}")]
    InvalidUrl(#[from] url::ParseError),

    #[error("engine not ready")]
    NotReady,

    #[error("{0}")]
    Other(String),
}

/// Events emitted by the engine during navigation.
#[derive(Debug, Clone, serde::Serialize)]
#[serde(tag = "type", rename_all = "camelCase")]
pub enum NavigationEvent {
    Started { url: String },
    Committed { url: String },
    Finished { url: String, title: Option<String> },
    Failed { url: String, error: String },
}

/// Trait abstracting a browser engine backend.
///
/// Implementations may use the OS webview (via Tauri/WRY) or a custom engine
/// (e.g. Servo). This trait defines the contract that the Tauri app layer
/// programs against, making the engine decision swappable.
pub trait Engine: Send + Sync {
    fn navigate(&self, url: &Url) -> Result<(), EngineError>;
    fn go_back(&self) -> Result<(), EngineError>;
    fn go_forward(&self) -> Result<(), EngineError>;
    fn reload(&self) -> Result<(), EngineError>;
    fn stop(&self) -> Result<(), EngineError>;
    fn current_url(&self) -> Option<Url>;
    fn title(&self) -> Option<String>;
    fn can_go_back(&self) -> bool;
    fn can_go_forward(&self) -> bool;
}
