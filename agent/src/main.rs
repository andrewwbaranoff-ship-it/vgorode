mod routes;
mod state;
use axum::{routing::{get, post}, Router};
use state::AgentState;
use tower_http::cors::{CorsLayer, Any};
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};
#[tokio::main]
async fn main() {
tracing_subscriber::registry()
.with(tracing_subscriber::EnvFilter::new(
std::env::var(“RUST_LOG”).unwrap_or_else(|_| “info”.into()),
))
.with(tracing_subscriber::fmt::layer())
.init();
  let state = AgentState::new();

let cors = CorsLayer::new()
    .allow_origin(Any)
    .allow_methods(Any)
    .allow_headers(Any);

let app = Router::new()
    .route("/health", get(routes::health))
    .route("/status", get(routes::status))
    .route("/connect", post(routes::connect))
    .route("/disconnect", post(routes::disconnect))
    .layer(cors)
    .with_state(state);

let addr = "127.0.0.1:8765";
tracing::info!("VGORODE Local Agent listening on {}", addr);
let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
axum::serve(listener, app).await.unwrap();
  }
