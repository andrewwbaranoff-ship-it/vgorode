use axum::{extract::Extension, Json};
use serde::Deserialize;
use crate::state::State;
use std::sync::Mutex;

#[derive(Deserialize)]
pub struct ConfigPayload {
    pub config: String,
}

pub async fn root() -> Json<serde_json::Value> {
    Json(serde_json::json!({"status":"agent alive"}))
}

pub async fn set_config(
    Extension(state): Extension<std::sync::Arc<Mutex<State>>>,
    Json(payload): Json<ConfigPayload>,
) -> Json<serde_json::Value> {
    let mut st = state.lock().unwrap();
    st.config = payload.config.clone();
    // Здесь можно запускать Xray-core с новой конфигурацией
    Json(serde_json::json!({"message":"Config applied"}))
}
