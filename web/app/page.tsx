‘use client’;
import { useEffect } from ‘react’;
import { useVgorodeStore } from ‘./store/useVgorodeStore’;
const SERVERS = [
{ id: 1, name: ‘US East’, location: ‘New York’, ping: ‘12ms’, flag: ‘🇺🇸’ },
{ id: 2, name: ‘EU West’, location: ‘Frankfurt’, ping: ‘28ms’, flag: ‘🇩🇪’ },
{ id: 3, name: ‘Asia Pacific’, location: ‘Singapore’, ping: ‘74ms’, flag: ‘🇸🇬’ },
{ id: 4, name: ‘UK London’, location: ‘London’, ping: ‘35ms’, flag: ‘🇬🇧’ },
];
export default function Home() {
const {
connectionStatus,
mode,
loading,
configText,
error,
detectAgent,
connect,
disconnect,
setConfig,
refreshStatus,
} = useVgorodeStore();
useEffect(() => {
detectAgent();
const interval = setInterval(refreshStatus, 5000);
return () => clearInterval(interval);
}, []);
const isConnected = connectionStatus === ‘connected’;
const isUnknown = connectionStatus === ‘unknown’;
return (
<main className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center px-4 py-8 safe-area-inset">
{/* Header */}
<div className="w-full max-w-md mb-8">
<div className="flex items-center justify-between">
<div>
<h1 className="text-2xl font-bold text-sky-400 tracking-widest">VGORODE</h1>
<p className="text-slate-400 text-xs mt-0.5">Hybrid VPN/Proxy Platform</p>
</div>
<div className="flex flex-col items-end gap-1">
<ModeBadge mode={mode} />
</div>
</div>
</div>
    {/* Connection Card */}
  <div className="w-full max-w-md bg-slate-800 rounded-2xl p-6 shadow-xl mb-6 border border-slate-700">
    <div className="flex flex-col items-center gap-4">
      {/* Status Circle */}
      <div
        className={`w-28 h-28 rounded-full flex items-center justify-center border-4 transition-all duration-500 ${
          isConnected
            ? 'border-emerald-400 bg-emerald-400/10 shadow-[0_0_32px_rgba(52,211,153,0.3)]'
            : isUnknown
            ? 'border-slate-500 bg-slate-700/50'
            : 'border-slate-600 bg-slate-700/30'
        }`}
      >
        <div
          className={`w-10 h-10 rounded-full transition-all duration-500 ${
            isConnected ? 'bg-emerald-400' : isUnknown ? 'bg-slate-500' : 'bg-slate-600'
          }`}
        />
      </div>

      {/* Status Text */}
      <div className="text-center">
        <StatusBadge status={connectionStatus} />
        {error && (
          <p className="text-rose-400 text-xs mt-2 max-w-xs text-center">{error}</p>
        )}
      </div>

      {/* Buttons */}
      <div className="flex gap-3 w-full">
        <button
          onClick={connect}
          disabled={loading || isConnected || mode === 'none'}
          className="flex-1 py-3 rounded-xl font-semibold text-sm bg-sky-500 hover:bg-sky-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95"
        >
          {loading ? '...' : 'Connect'}
        </button>
        <button
          onClick={disconnect}
          disabled={loading || !isConnected || mode === 'none'}
          className="flex-1 py-3 rounded-xl font-semibold text-sm bg-slate-700 hover:bg-slate-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95"
        >
          Disconnect
        </button>
      </div>

      <button
        onClick={detectAgent}
        disabled={loading}
        className="text-sky-400 text-xs underline underline-offset-2 disabled:opacity-40"
      >
        Re-detect Agent
      </button>
    </div>
  </div>

  {/* Server List */}
  <div className="w-full max-w-md bg-slate-800 rounded-2xl p-5 shadow-xl mb-6 border border-slate-700">
    <h2 className="text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wider">
      Servers
    </h2>
    <div className="flex flex-col gap-2">
      {SERVERS.map((server) => (
        <div
          key={server.id}
          className="flex items-center justify-between bg-slate-700/50 rounded-xl px-4 py-3 hover:bg-slate-700 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <span className="text-xl">{server.flag}</span>
            <div>
              <p className="text-sm font-medium text-slate-100">{server.name}</p>
              <p className="text-xs text-slate-400">{server.location}</p>
            </div>
          </div>
          <span className="text-xs text-emerald-400 font-mono">{server.ping}</span>
        </div>
      ))}
    </div>
  </div>

  {/* Config Import */}
  <div className="w-full max-w-md bg-slate-800 rounded-2xl p-5 shadow-xl border border-slate-700">
    <h2 className="text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wider">
      Config Import
    </h2>
    <textarea
      value={configText}
      onChange={(e) => setConfig(e.target.value)}
      placeholder="Paste your VPN/proxy config here..."
      className="w-full h-28 bg-slate-900 text-slate-300 text-xs font-mono rounded-xl p-3 border border-slate-600 focus:outline-none focus:border-sky-500 resize-none placeholder-slate-600"
    />
    <button
      className="mt-2 w-full py-2 rounded-xl text-sm font-semibold bg-slate-700 hover:bg-slate-600 transition-all active:scale-95"
      onClick={() => alert('Config applied (mock)')}
    >
      Apply Config
    </button>
  </div>

  <p className="text-slate-600 text-xs mt-8">VGORODE v1.0.0 · Open Source</p>
</main>
);
}
function StatusBadge({ status }: { status: string }) {
const map: Record<string, { label: string; cls: string }> = {
connected: { label: ‘● Connected’, cls: ‘text-emerald-400 bg-emerald-400/10’ },
disconnected: { label: ‘○ Disconnected’, cls: ‘text-slate-400 bg-slate-700’ },
unknown: { label: ‘◌ Detecting…’, cls: ‘text-yellow-400 bg-yellow-400/10’ },
};
const s = map[status] || map.unknown;
return (
<span className={px-3 py-1 rounded-full text-sm font-semibold ${s.cls}}>
{s.label}
</span>
);
}
function ModeBadge({ mode }: { mode: string }) {
const map: Record<string, { label: string; cls: string }> = {
local: { label: ‘Local Agent’, cls: ‘bg-violet-500/20 text-violet-300 border-violet-500/30’ },
remote: { label: ‘Remote Core’, cls: ‘bg-sky-500/20 text-sky-300 border-sky-500/30’ },
none: { label: ‘No Backend’, cls: ‘bg-rose-500/20 text-rose-300 border-rose-500/30’ },
};
const m = map[mode] || map.none;
return (
<span className={px-2 py-0.5 rounded-lg text-xs font-medium border ${m.cls}}>
{m.label}
</span>
);
}
