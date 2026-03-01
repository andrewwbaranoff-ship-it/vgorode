pub struct State {
    pub config: String,
}

impl State {
    pub fn new() -> Self {
        Self { config: String::new() }
    }
}
