‘use client’;
import { create } from ‘zustand’;
import { detectAgent, getStatus, connect, disconnect, Mode } from ‘../lib/api’;
interface VgorodeState {
connectionStatus: ‘connected’ | ‘disconnected’ | ‘unknown’;
mode: Mode;
loading: boolean;
configText: string;
error: string | null;
detectAgent: () => Promise<void>;
connect: () => Promise<void>;
disconnect: () => Promise<void>;
setConfig: (text: string) => void;
refreshStatus: () => Promise<void>;
}
export const useVgorodeStore = create<VgorodeState>((set, get) => ({
connectionStatus: ‘unknown’,
mode: ‘none’,
loading: false,
configText: ‘’,
error: null,
detectAgent: async () => {
set({ loading: true, error: null });
try {
const mode = await detectAgent();
set({ mode });
if (mode !== ‘none’) {
const status = await getStatus(mode);
set({ connectionStatus: status.connected ? ‘connected’ : ‘disconnected’ });
} else {
set({ connectionStatus: ‘disconnected’ });
}
} catch (e) {
set({ error: String(e), connectionStatus: ‘disconnected’ });
} finally {
set({ loading: false });
}
},
connect: async () => {
const { mode } = get();
if (mode === ‘none’) {
set({ error: ‘No agent or remote core available’ });
return;
}
set({ loading: true, error: null });
try {
await connect(mode);
set({ connectionStatus: ‘connected’ });
} catch (e) {
set({ error: String(e) });
} finally {
set({ loading: false });
}
},
disconnect: async () => {
const { mode } = get();
if (mode === ‘none’) return;
set({ loading: true, error: null });
try {
await disconnect(mode);
set({ connectionStatus: ‘disconnected’ });
} catch (e) {
set({ error: String(e) });
} finally {
set({ loading: false });
}
},
setConfig: (text: string) => set({ configText: text }),
refreshStatus: async () => {
const { mode } = get();
if (mode === ‘none’) return;
try {
const status = await getStatus(mode);
set({ connectionStatus: status.connected ? ‘connected’ : ‘disconnected’ });
} catch {
// ignore
}
},
}));
