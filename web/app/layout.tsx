import type { Metadata, Viewport } from ‘next’;
import ‘./globals.css’;
export const metadata: Metadata = {
title: ‘VGORODE’,
description: ‘Hybrid VPN/Proxy Platform’,
manifest: ‘/manifest.json’,
appleWebApp: {
capable: true,
title: ‘VGORODE’,
statusBarStyle: ‘black-translucent’,
},
other: {
‘mobile-web-app-capable’: ‘yes’,
},
};
export const viewport: Viewport = {
themeColor: ‘#0ea5e9’,
width: ‘device-width’,
initialScale: 1,
maximumScale: 1,
userScalable: false,
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
return (
<html lang="en">
<head>
<link rel="apple-touch-icon" href="/icon-192.png" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-title" content="VGORODE" />
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
<script
dangerouslySetInnerHTML={{
__html: if ('serviceWorker' in navigator) { window.addEventListener('load', function() { navigator.serviceWorker.register('/sw.js').catch(function(err) { console.warn('SW registration failed:', err); }); }); },
}}
/>
</head>
<body>{children}</body>
</html>
);
}
