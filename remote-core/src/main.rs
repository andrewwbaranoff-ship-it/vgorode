use std::sync::Arc;
use tokio::sync::RwLock;
use axum::{extract::State, routing::{get, post}, Json, Router};
use serde_json::{json, Value};
use tower_http::cors::{CorsLayer, Any};
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};
#[derive(Clone)]
struct CoreState {
connected: Arc<RwLock<bool>>,
}
async fn health() -> Json<Value> {
Json(json!({ “status”: “ok” }))
}
async fn status(State(s): State<CoreState>) -> Json<Value> {
let connected = *s.connected.read().await;
Json(json!({ “connected”: connected }))
}
async fn connect(State(s): State<CoreState>) -> Json<Value> {
let mut c = s.connected.write().await;
*c = true;
tracing::info!(“Remote core: tunnel connected”);
Json(json!({ “ok”: true, “connected”: true }))
}
async fn disconnect(State(s): State<CoreState>) -> Json<Value> {
let mut c = s.connected.write().await;
*c = false;
tracing::info!(“Remote core: tunnel disconnected”);
Json(json!({ “ok”: true, “connected”: false }))
}
#[tokio::main]
async fn main() {
tracing_subscriber::registry()
.with(tracing_subscriber::EnvFilter::new(
std::env::var(“RUST_LOG”).unwrap_or_else(|_| “info”.into()),
))
.with(tracing_subscriber::fmt::layer())
.init();
  let state = CoreState {
    connected: Arc::new(RwLock::new(false)),
};

let cors = CorsLayer::new()
    .allow_origin(Any)
    .allow_methods(Any)
    .allow_headers(Any);

let app = Router::new()
    .route("/health", get(health))
    .route("/status", get(status))
    .route("/connect", post(connect))
    .route("/disconnect", post(disconnect))
    .layer(cors)
    .with_state(state);

let addr = "0.0.0.0:9000";
tracing::info!("VGORODE Remote Core listening on {}", addr);
let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
axum::serve(listener, app).await.unwrap();
}
