use atom_shield::{ThreatAssessment, UrlClassifier};
use serde::Serialize;
use std::sync::atomic::{AtomicU32, Ordering};
use tauri::webview::WebviewBuilder;
use tauri::{AppHandle, Manager, WebviewUrl};

static CHROME_HEIGHT: AtomicU32 = AtomicU32::new(92);

fn chrome_height() -> f64 {
    CHROME_HEIGHT.load(Ordering::Relaxed) as f64
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
fn check_request(
    _url: String,
    _source_url: String,
    _resource_type: String,
) -> Result<BlockCheckResult, String> {
    Ok(BlockCheckResult { blocked: false })
}

#[tauri::command]
fn set_chrome_height(height: u32) {
    CHROME_HEIGHT.store(height, Ordering::Relaxed);
}

fn get_content_bounds(app: &AppHandle) -> Option<(f64, f64)> {
    let window = app.get_window("main")?;
    let scale = window.scale_factor().ok()?;
    let phys = window.inner_size().ok()?;
    Some((phys.width as f64 / scale, phys.height as f64 / scale))
}

#[tauri::command]
async fn navigate_to(url: String, app: AppHandle) -> Result<(), String> {
    let parsed = url::Url::parse(&url).map_err(|e| e.to_string())?;
    let ch = chrome_height();

    if let Some(webview) = app.get_webview("content") {
        // Restore position in case it was hidden off-screen
        let _ = webview.set_position(tauri::LogicalPosition::new(0.0, ch));
        if let Some((width, height)) = get_content_bounds(&app) {
            let _ = webview.set_size(tauri::LogicalSize::new(width, height - ch));
        }
        webview.navigate(parsed).map_err(|e| e.to_string())?;
        return Ok(());
    }

    let window = app.get_window("main").ok_or("main window not found")?;
    let (width, height) = get_content_bounds(&app).unwrap_or((1280.0, 800.0));

    window
        .add_child(
            WebviewBuilder::new("content", WebviewUrl::External(parsed)),
            tauri::LogicalPosition::new(0.0, ch),
            tauri::LogicalSize::new(width, height - ch),
        )
        .map_err(|e: tauri::Error| e.to_string())?;

    Ok(())
}

#[tauri::command]
async fn hide_content_view(app: AppHandle) -> Result<(), String> {
    if let Some(webview) = app.get_webview("content") {
        // Move the webview off-screen so the React homepage is visible
        let _ = webview.set_position(tauri::LogicalPosition::new(0.0, -10000.0));
        let blank = url::Url::parse("about:blank").unwrap();
        let _ = webview.navigate(blank);
    }
    Ok(())
}

#[tauri::command]
async fn go_back(app: AppHandle) -> Result<(), String> {
    if let Some(webview) = app.get_webview("content") {
        webview.eval("history.back()").map_err(|e| e.to_string())?;
    }
    Ok(())
}

#[tauri::command]
async fn go_forward(app: AppHandle) -> Result<(), String> {
    if let Some(webview) = app.get_webview("content") {
        webview.eval("history.forward()").map_err(|e| e.to_string())?;
    }
    Ok(())
}

#[tauri::command]
async fn reload_page(app: AppHandle) -> Result<(), String> {
    if let Some(webview) = app.get_webview("content") {
        webview.eval("location.reload()").map_err(|e| e.to_string())?;
    }
    Ok(())
}

#[tauri::command]
async fn get_current_url(app: AppHandle) -> Result<String, String> {
    if let Some(webview) = app.get_webview("content") {
        let url = webview.url().map_err(|e| e.to_string())?;
        return Ok(url.to_string());
    }
    Ok(String::new())
}

fn resize_content_webview(app: &AppHandle) {
    let Some(webview) = app.get_webview("content") else { return };

    // Don't resize if webview is hidden off-screen (homepage state)
    if let Ok(pos) = webview.position() {
        if pos.y < -1000 { return; }
    }

    let Some((width, height)) = get_content_bounds(app) else { return };
    let ch = chrome_height();
    let _ = webview.set_position(tauri::LogicalPosition::new(0.0, ch));
    let _ = webview.set_size(tauri::LogicalSize::new(width, height - ch));
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
            check_url,
            check_request,
            navigate_to,
            hide_content_view,
            go_back,
            go_forward,
            reload_page,
            get_current_url,
            set_chrome_height,
        ])
        .on_window_event(|window, event| {
            if let tauri::WindowEvent::Resized(_) = event {
                resize_content_webview(window.app_handle());
            }
        })
        .run(tauri::generate_context!())
        .expect("error while running Atom Browser");
}
