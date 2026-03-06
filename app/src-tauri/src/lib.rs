use atom_shield::{ThreatAssessment, UrlClassifier};
use serde::Serialize;
use tauri::webview::WebviewBuilder;
use tauri::{AppHandle, Manager, WebviewUrl};

const CHROME_HEIGHT: f64 = 88.0;

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

fn get_content_bounds(app: &AppHandle) -> Option<(f64, f64)> {
    let window = app.get_window("main")?;
    let scale = window.scale_factor().ok()?;
    let phys = window.inner_size().ok()?;
    Some((phys.width as f64 / scale, phys.height as f64 / scale))
}

#[tauri::command]
async fn navigate_to(url: String, app: AppHandle) -> Result<(), String> {
    let parsed = url::Url::parse(&url).map_err(|e| e.to_string())?;

    if let Some(webview) = app.get_webview("content") {
        webview.navigate(parsed).map_err(|e| e.to_string())?;
        return Ok(());
    }

    let window = app.get_window("main").ok_or("main window not found")?;
    let (width, height) = get_content_bounds(&app).unwrap_or((1280.0, 800.0));

    window
        .add_child(
            WebviewBuilder::new("content", WebviewUrl::External(parsed)),
            tauri::LogicalPosition::new(0.0, CHROME_HEIGHT),
            tauri::LogicalSize::new(width, height - CHROME_HEIGHT),
        )
        .map_err(|e: tauri::Error| e.to_string())?;

    Ok(())
}

#[tauri::command]
async fn hide_content_view(app: AppHandle) -> Result<(), String> {
    if let Some(webview) = app.get_webview("content") {
        let blank = url::Url::parse("about:blank").unwrap();
        webview.navigate(blank).map_err(|e| e.to_string())?;
    }
    Ok(())
}

#[tauri::command]
async fn go_back(app: AppHandle) -> Result<(), String> {
    if let Some(webview) = app.get_webview("content") {
        webview
            .eval("history.back()")
            .map_err(|e| e.to_string())?;
    }
    Ok(())
}

#[tauri::command]
async fn go_forward(app: AppHandle) -> Result<(), String> {
    if let Some(webview) = app.get_webview("content") {
        webview
            .eval("history.forward()")
            .map_err(|e| e.to_string())?;
    }
    Ok(())
}

#[tauri::command]
async fn reload_page(app: AppHandle) -> Result<(), String> {
    if let Some(webview) = app.get_webview("content") {
        webview
            .eval("location.reload()")
            .map_err(|e| e.to_string())?;
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
    let Some(webview) = app.get_webview("content") else {
        return;
    };
    let Some((width, height)) = get_content_bounds(app) else {
        return;
    };
    let _ = webview.set_position(tauri::LogicalPosition::new(0.0, CHROME_HEIGHT));
    let _ = webview.set_size(tauri::LogicalSize::new(width, height - CHROME_HEIGHT));
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
        ])
        .on_window_event(|window, event| {
            if let tauri::WindowEvent::Resized(_) = event {
                resize_content_webview(window.app_handle());
            }
        })
        .run(tauri::generate_context!())
        .expect("error while running Atom Browser");
}
