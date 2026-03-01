VGORODE

Hybrid VPN/Proxy Platform — Browser-first PWA with Local Agent and Remote Core fallback.
Architecture

┌─────────────────────────────────────────────────────────┐
│                    Browser / iOS PWA                    │
│                   Next.js 14 App Router                 │
│              Zustand State · TailwindCSS UI             │
└────────────────────────┬────────────────────────────────┘
                         │ API calls
          ┌──────────────┴──────────────┐
          │     Agent Detection Logic   │
          │  1. Try 127.0.0.1:8765      │
          │  2. Fallback to :9000        │
          └──────┬───────────────┬──────┘
                 │               │
    ┌────────────▼──┐     ┌──────▼──────────────┐
    │  Local Agent  │     │    Remote Core       │
    │  Rust + axum  │     │   Rust + axum        │
    │  :8765        │     │   :9000              │
    │  In-memory    │     │   In-memory state    │
    │  VPN state    │     │   Simulated tunnel   │
    └───────────────┘     └──────────────────────┘

Requirements

	∙	Node.js: 20+
	∙	Rust: 1.79+ (stable)
	∙	Docker: 24+ (optional)

  
Run Web UI

cd web
npm install
npm run dev
# Open http://localhost:3000

Run Local Agent

cd agent
cargo build
cargo run
# Listens on 127.0.0.1:8765

Run Remote Core

cd remote-core
cargo build
cargo run
# Listens on 0.0.0.0:9000

# Run with Docker

docker-compose up --build
# Web:         http://localhost:3000
# Agent:       http://localhost:8765
# Remote Core: http://localhost:9000

Test Agent Detection

# Test local agent health
curl http://127.0.0.1:8765/health
# {"status":"ok"}

# Test connect
curl -X POST http://127.0.0.1:8765/connect
# {"ok":true,"connected":true}

# Test status
curl http://127.0.0.1:8765/status
# {"connected":true}

# Test disconnect
curl -X POST http://127.0.0.1:8765/disconnect
# {"ok":true,"connected":false}

# Test remote core
curl http://localhost:9000/health
# {"status":"ok"}

# Agent Detection Flow
	1.	Web UI starts → calls GET http://127.0.0.1:8765/health (1.5s timeout)
	2.	If success → Local mode (badge shows “Local Agent”)
	3.	If fail → tries GET http://localhost:9000/health (2s timeout)
	4.	If success → Remote mode (badge shows “Remote Core”)
	5.	If both fail → No Backend (badge shows “No Backend”, buttons disabled)
Status auto-refreshes every 5 seconds.

# Install as PWA on iOS
	1.	Open Safari on iPhone/iPad
	2.	Navigate to http://<your-ip>:3000
	3.	Tap the Share button (box with arrow)
	4.	Scroll down → tap “Add to Home Screen”
	5.	Tap Add
	6.	Launch VGORODE from your Home Screen
The app runs in standalone mode (no browser UI).

# Project Structure

vgorode/
├── web/                    # Next.js 14 PWA
│   ├── app/
│   │   ├── layout.tsx      # Root layout + PWA meta tags
│   │   ├── page.tsx        # Dashboard UI
│   │   ├── globals.css     # TailwindCSS base
│   │   ├── lib/api.ts      # API abstraction layer
│   │   └── store/          # Zustand state management
│   └── public/
│       ├── manifest.json   # PWA manifest
│       └── sw.js           # Service Worker
├── agent/                  # Local Rust daemon
│   ├── Cargo.toml
│   └── src/
│       ├── main.rs         # Axum server setup
│       ├── routes.rs       # HTTP handlers
│       └── state.rs        # Shared state
├── remote-core/            # Remote fallback Rust server
│   ├── Cargo.toml
│   └── src/main.rs
├── Dockerfile.web
├── Dockerfile.agent
├── Dockerfile.remote
├── docker-compose.yml
└── README.md

# API Reference

Both agent (:8765) and remote-core (:9000) expose identical APIs.

# Icons

Place your PNG icons at:
	∙	web/public/icon-192.png (192×192)
	∙	web/public/icon-512.png (512×512)
You can generate them from any online PWA icon generator.


