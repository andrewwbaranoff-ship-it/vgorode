"use client";

import { useState } from "react";
import axios from "axios";

export default function Home() {
  const [config, setConfig] = useState("");
  const [status, setStatus] = useState("");

  const sendConfig = async () => {
    try {
      const res = await axios.post("http://localhost:8765/api/config", { config });
      setStatus(res.data.message);
    } catch (err) {
      console.error(err);
      setStatus("Failed to send config");
    }
  };

  return (
    <main className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-bold mb-6">VGORODE VPN</h1>

      <textarea
        placeholder="Paste VLESS / VMESS / TROJAN config here..."
        value={config}
        onChange={(e) => setConfig(e.target.value)}
        className="w-full max-w-xl h-40 p-4 text-black rounded"
      />

      <button
        className="mt-4 px-6 py-3 bg-green-500 rounded text-black font-bold"
        onClick={sendConfig}
      >
        Save Config
      </button>

      {status && <p className="mt-4">{status}</p>}
    </main>
  );
}
