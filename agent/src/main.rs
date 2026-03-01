use axum::{routing::get, routing::post, Json, Router};
use serde::Deserialize;
use std::sync::{Arc, Mutex};

mod routes;
mod state;

#[tokio::main]
async fn main() {
    let state = Arc::new(Mutex::new(state::State::new()));
    let app = Router::new()
        .route("/", get(routes::root))
        .route("/api/config", post(routes::set_config))
        .layer(axum::extract::Extension(state.clone()));

    println!("Agent running on http://0.0.0.0:8765");
    axum::Server::bind(&"0.0.0.0:8765".parse().unwrap())
        .serve(app.into_make_service())
        .await
        .unwrap();
}
