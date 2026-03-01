use axum::{routing::get, Router};
use axum::response::Json;
use serde_json::json;

#[tokio::main]
async fn main() {
    let app = Router::new()
        .route("/", get(|| async { Json(json!({"status":"remote alive"})) }));

    println!("Remote Core running on http://0.0.0.0:9000");
    axum::Server::bind(&"0.0.0.0:9000".parse().unwrap())
        .serve(app.into_make_service())
        .await
        .unwrap();
}
