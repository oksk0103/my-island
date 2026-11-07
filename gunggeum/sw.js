// 궁금칸 — network first, cache as fallback (so updates arrive right away)
const CACHE = 'gk-v59';
self.addEventListener('install', e => { self.skipWaiting(); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return;
  e.respondWith(fetch(e.request, { cache: 'no-cache' }).then(res => { if (res && res.ok) { const copy = res.clone(); e.waitUntil(caches.open(CACHE).then(c => c.put(e.request, copy))); } return res; }).catch(() => caches.match(e.request).then(r => r || new Response('오프라인이에요. 인터넷을 확인해 주세요.', { status: 503, headers: { 'content-type': 'text/plain; charset=utf-8' } }))));
});
