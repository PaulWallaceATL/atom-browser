use adblock::engine::Engine as AdblockEngine;
use adblock::lists::{FilterSet, ParseOptions};
use serde::{Deserialize, Serialize};

/// Well-known filter list URLs.
pub mod lists {
    pub const EASYLIST: &str =
        "https://easylist.to/easylist/easylist.txt";
    pub const EASYPRIVACY: &str =
        "https://easylist.to/easylist/easyprivacy.txt";
    pub const PETER_LOWE_ADSERVERS: &str =
        "https://pgl.yoyo.org/adservers/serverlist.php?hostformat=adblockplus&showintro=1&mimetype=plaintext";
}

/// Result of checking a URL against filter lists.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct BlockResult {
    pub blocked: bool,
    pub filter: Option<String>,
    pub redirect: Option<String>,
}

/// Atom's ad/tracker blocking engine, wrapping Brave's adblock-rust.
pub struct AdBlocker {
    engine: AdblockEngine,
}

impl AdBlocker {
    /// Create a blocker with no rules loaded. Call `load_filter_list` to add rules.
    pub fn new() -> Self {
        let filter_set = FilterSet::new(false);
        Self {
            engine: AdblockEngine::from_filter_set(filter_set, true),
        }
    }

    /// Parse and load a filter list (in Adblock Plus / uBlock Origin format).
    pub fn load_filter_list(&mut self, raw_list: &str) {
        let mut filter_set = FilterSet::new(false);
        filter_set.add_filters(
            raw_list.lines().map(String::from).collect::<Vec<_>>(),
            ParseOptions::default(),
        );
        self.engine = AdblockEngine::from_filter_set(filter_set, true);
    }

    /// Check whether a request URL should be blocked.
    ///
    /// `source_url` is the page that initiated the request.
    /// `request_type` is the resource type (e.g. "script", "image", "stylesheet").
    pub fn check(
        &self,
        url: &str,
        source_url: &str,
        request_type: &str,
    ) -> BlockResult {
        let result = self.engine.check_network_request(
            &adblock::request::Request::new(url, source_url, request_type)
                .unwrap_or_else(|_| {
                    adblock::request::Request::new(url, "", "other").expect("fallback request")
                }),
        );
        BlockResult {
            blocked: result.matched,
            filter: result.filter.map(|f| f.to_string()),
            redirect: result.redirect.map(|r| r.to_string()),
        }
    }
}

impl Default for AdBlocker {
    fn default() -> Self {
        Self::new()
    }
}
