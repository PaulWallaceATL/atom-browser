use actix_web::{get, web, App, HttpResponse, HttpServer};
use atom_search::SearchAggregator;
use serde::Deserialize;
use std::sync::Arc;
use tokio::sync::RwLock;

struct AppState {
    aggregator: Arc<RwLock<SearchAggregator>>,
}

#[derive(Deserialize)]
struct SearchQuery {
    q: String,
    #[serde(default = "default_page")]
    page: u32,
}

fn default_page() -> u32 {
    1
}

#[get("/search")]
async fn search(
    data: web::Data<AppState>,
    query: web::Query<SearchQuery>,
) -> HttpResponse {
    let aggregator = data.aggregator.read().await;
    match aggregator.search(&query.q, query.page).await {
        Ok(results) => HttpResponse::Ok().json(results),
        Err(e) => HttpResponse::InternalServerError().json(serde_json::json!({
            "error": e.to_string()
        })),
    }
}

#[get("/health")]
async fn health() -> HttpResponse {
    HttpResponse::Ok().json(serde_json::json!({ "status": "ok" }))
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    tracing_subscriber::fmt::init();

    let aggregator = Arc::new(RwLock::new(SearchAggregator::new()));

    tracing::info!("Atom Search starting on 127.0.0.1:8080");

    HttpServer::new(move || {
        App::new()
            .app_data(web::Data::new(AppState {
                aggregator: aggregator.clone(),
            }))
            .service(search)
            .service(health)
    })
    .bind("127.0.0.1:8080")?
    .run()
    .await
}
