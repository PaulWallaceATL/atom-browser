use atom_shield::{ThreatAssessment, UrlClassifier};
use serde::Serialize;
use std::sync::atomic::{AtomicBool, AtomicU32, Ordering};
use tauri::webview::WebviewBuilder;
use tauri::{AppHandle, Manager, WebviewUrl};

/// Chrome height in logical pixels. Updated by the frontend on every navigation.
static CHROME_HEIGHT: AtomicU32 = AtomicU32::new(0);
/// Whether the content webview is intentionally hidden (new-tab/homepage state).
static CONTENT_HIDDEN: AtomicBool = AtomicBool::new(true);

fn chrome_h() -> f64 {
    let h = CHROME_HEIGHT.load(Ordering::Relaxed);
    if h == 0 { 90.0 } else { h as f64 }
}

struct AppState {
    url_classifier: UrlClassifier,
}

#[derive(Debug, Clone, Serialize)]
pub struct BlockCheckResult {
    pub blocked: bool,
}

#[tauri::command]
fn check_url(url: String, state: tauri::State<'_, AppState>) -> Result<ThreatAssessment, String> {
    let parsed = url::Url::parse(&url).map_err(|e| e.to_string())?;
    Ok(state.url_classifier.classify(&parsed))
}

#[tauri::command]
fn check_request(_url: String, _source_url: String, _resource_type: String) -> Result<BlockCheckResult, String> {
    Ok(BlockCheckResult { blocked: false })
}

#[tauri::command]
fn set_chrome_height(height: u32, app: AppHandle) {
    let prev = CHROME_HEIGHT.swap(height, Ordering::Relaxed);
    if prev != height && !CONTENT_HIDDEN.load(Ordering::Relaxed) {
        apply_content_bounds(&app);
    }
}

fn window_content_size(app: &AppHandle) -> Option<(f64, f64)> {
    let window = app.get_window("main")?;
    let scale = window.scale_factor().ok()?;
    let phys = window.inner_size().ok()?;
    Some((phys.width as f64 / scale, phys.height as f64 / scale))
}

fn apply_content_bounds(app: &AppHandle) {
    let Some(webview) = app.get_webview("content") else { return };
    let Some((w, h)) = window_content_size(app) else { return };
    let ch = chrome_h();
    let _ = webview.set_position(tauri::LogicalPosition::new(0.0, ch));
    let _ = webview.set_size(tauri::LogicalSize::new(w, h - ch));
}

/// Navigate to a URL. The `chrome_height` parameter is measured by the frontend
/// and sent with every navigation call so there is zero race condition.
#[tauri::command]
async fn navigate_to(url: String, chrome_height: Option<u32>, app: AppHandle) -> Result<(), String> {
    // Update chrome height from the frontend measurement sent with this call.
    if let Some(ch) = chrome_height {
        CHROME_HEIGHT.store(ch, Ordering::Relaxed);
    }

    let parsed = url::Url::parse(&url).map_err(|e| e.to_string())?;
    let ch = chrome_h();

    CONTENT_HIDDEN.store(false, Ordering::Relaxed);

    if let Some(webview) = app.get_webview("content") {
        let (w, h) = window_content_size(&app).unwrap_or((1280.0, 800.0));
        let _ = webview.set_position(tauri::LogicalPosition::new(0.0, ch));
        let _ = webview.set_size(tauri::LogicalSize::new(w, h - ch));
        webview.navigate(parsed).map_err(|e| e.to_string())?;
        return Ok(());
    }

    let window = app.get_window("main").ok_or("main window not found")?;
    let (w, h) = window_content_size(&app).unwrap_or((1280.0, 800.0));

    window
        .add_child(
            WebviewBuilder::new("content", WebviewUrl::External(parsed)),
            tauri::LogicalPosition::new(0.0, ch),
            tauri::LogicalSize::new(w, h - ch),
        )
        .map_err(|e: tauri::Error| e.to_string())?;

    Ok(())
}

#[tauri::command]
async fn hide_content_view(app: AppHandle) -> Result<(), String> {
    CONTENT_HIDDEN.store(true, Ordering::Relaxed);
    if let Some(webview) = app.get_webview("content") {
        let _ = webview.set_position(tauri::LogicalPosition::new(-10000.0, -10000.0));
        let _ = webview.set_size(tauri::LogicalSize::new(0.0, 0.0));
        let _ = webview.navigate(url::Url::parse("about:blank").unwrap());
    }
    Ok(())
}

#[tauri::command]
async fn go_back(app: AppHandle) -> Result<(), String> {
    if let Some(wv) = app.get_webview("content") { wv.eval("history.back()").map_err(|e| e.to_string())?; }
    Ok(())
}

#[tauri::command]
async fn go_forward(app: AppHandle) -> Result<(), String> {
    if let Some(wv) = app.get_webview("content") { wv.eval("history.forward()").map_err(|e| e.to_string())?; }
    Ok(())
}

#[tauri::command]
async fn reload_page(app: AppHandle) -> Result<(), String> {
    if let Some(wv) = app.get_webview("content") { wv.eval("location.reload()").map_err(|e| e.to_string())?; }
    Ok(())
}

#[tauri::command]
async fn get_current_url(app: AppHandle) -> Result<String, String> {
    if let Some(wv) = app.get_webview("content") { return Ok(wv.url().map_err(|e| e.to_string())?.to_string()); }
    Ok(String::new())
}

fn on_resize(app: &AppHandle) {
    if CONTENT_HIDDEN.load(Ordering::Relaxed) { return; }
    apply_content_bounds(app);
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tracing_subscriber::fmt::init();
    let url_classifier = UrlClassifier::new();

    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_store::Builder::default().build())
        .manage(AppState { url_classifier })
        .invoke_handler(tauri::generate_handler![
            check_url, check_request, navigate_to, hide_content_view,
            go_back, go_forward, reload_page, get_current_url, set_chrome_height,
        ])
        .on_window_event(|window, event| {
            if let tauri::WindowEvent::Resized(_) = event {
                on_resize(window.app_handle());
            }
        })
        .run(tauri::generate_context!())
        .expect("error while running Atom Browser");
}
