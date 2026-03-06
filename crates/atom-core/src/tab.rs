use serde::{Deserialize, Serialize};
use url::Url;

/// Unique identifier for a browser tab.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, Serialize, Deserialize)]
pub struct TabId(pub u64);

/// Loading state of a tab.
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub enum TabState {
    Idle,
    Loading,
    Error(String),
}

/// Represents a single browser tab's metadata.
///
/// The actual webview is managed by the engine layer; this struct
/// holds the serializable state that the frontend UI needs.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Tab {
    pub id: TabId,
    pub title: String,
    pub url: Option<Url>,
    pub state: TabState,
    pub pinned: bool,
}

impl Tab {
    pub fn new(id: TabId) -> Self {
        Self {
            id,
            title: String::from("New Tab"),
            url: None,
            state: TabState::Idle,
            pinned: false,
        }
    }
}
