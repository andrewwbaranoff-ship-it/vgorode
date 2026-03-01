use axum::{extract::State, Json};
use serde_json::{json, Value};
use crate::state::AgentState;
pub async fn health() -> Json<Value> {
Json(json!({ “status”: “ok” }))
}
pub async fn status(State(state): State<AgentState>) -> Json<Value> {
let connected = *state.connected.read().await;
Json(json!({ “connected”: connected }))
}
pub async fn connect(State(state): State<AgentState>) -> Json<Value> {
let mut connected = state.connected.write().await;
*connected = true;
tracing::info!(“VPN connected”);
Json(json!({ “ok”: true, “connected”: true }))
}
pub async fn disconnect(State(state): State<AgentState>) -> Json<Value> {
let mut connected = state.connected.write().await;
*connected = false;
tracing::info!(“VPN disconnected”);
Json(json!({ “ok”: true, “connected”: false }))
}
