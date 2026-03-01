use std::sync::Arc;
use tokio::sync::RwLock;
#[derive(Debug, Clone)]
pub struct AgentState {
pub connected: Arc<RwLock<bool>>,
}
impl AgentState {
pub fn new() -> Self {
AgentState {
connected: Arc::new(RwLock::new(false)),
}
}
}
