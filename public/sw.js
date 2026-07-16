// Service worker minimal — cât să facă aplicația instalabilă și să nu lase
// ecran alb când rețeaua cade. NU cache-uim date personale sau răspunsuri API:
// reflecțiile și profilul rămân mereu proaspete, cerute de la server.

const SHELL = 'water-shell-v1'
const OFFLINE_ASSETS = ['/manifest.json', '/icon-192.png', '/icon-512.png']

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(SHELL).then((c) => c.addAll(OFFLINE_ASSETS)).then(() => self.skipWaiting())
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== SHELL).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET') return

  const url = new URL(request.url)
  if (url.origin !== self.location.origin) return
  // niciodată API sau auth — datele userului nu se servesc din cache
  if (url.pathname.startsWith('/api/') || url.pathname.startsWith('/auth/')) return

  // network-first: aplicația e mereu actuală; cache-ul e doar plasa de siguranță
  event.respondWith(
    fetch(request)
      .then((res) => {
        if (res.ok && OFFLINE_ASSETS.includes(url.pathname)) {
          const copy = res.clone()
          caches.open(SHELL).then((c) => c.put(request, copy))
        }
        return res
      })
      .catch(() => caches.match(request))
  )
})
