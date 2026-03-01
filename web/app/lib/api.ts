const LOCAL_AGENT = ‘http://127.0.0.1:8765’;
const REMOTE_CORE = ‘http://localhost:9000’;
export type Mode = ‘local’ | ‘remote’ | ‘none’;
export async function detectAgent(): Promise<Mode> {
try {
const controller = new AbortController();
const timeout = setTimeout(() => controller.abort(), 1500);
const res = await fetch(${LOCAL_AGENT}/health, { signal: controller.signal });
clearTimeout(timeout);
if (res.ok) return ‘local’;
} catch {
// local not available
}
try {
const controller = new AbortController();
const timeout = setTimeout(() => controller.abort(), 2000);
const res = await fetch(${REMOTE_CORE}/health, { signal: controller.signal });
clearTimeout(timeout);
if (res.ok) return ‘remote’;
} catch {
// remote not available
}
return ‘none’;
}
function baseUrl(mode: Mode): string {
return mode === ‘local’ ? LOCAL_AGENT : REMOTE_CORE;
}
export async function getStatus(mode: Mode): Promise<{ connected: boolean }> {
const res = await fetch(${baseUrl(mode)}/status);
if (!res.ok) throw new Error(‘Failed to get status’);
return res.json();
}
export async function connect(mode: Mode): Promise<void> {
const res = await fetch(${baseUrl(mode)}/connect, { method: ‘POST’ });
if (!res.ok) throw new Error(‘Failed to connect’);
}
export async function disconnect(mode: Mode): Promise<void> {
const res = await fetch(${baseUrl(mode)}/disconnect, { method: ‘POST’ });
if (!res.ok) throw new Error(‘Failed to disconnect’);
}
