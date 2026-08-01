import { APP_NAME, APP_DESCRIPTOR, appTagline } from '../lib/appConfig'

// Manifestul PWA generat din APP_NAME/APP_DESCRIPTOR/APP_TAGLINE (IDENTITATE
// 30.07) — inainte era public/manifest.json static, care ar fi cerut editare
// separata la orice schimbare de nume. Inlocuieste acel fisier (vezi ruta
// identica /manifest.json). Descrierea era ramasa de la o identitate veche
// ("Coerenta intre gand, cuvant si actiune") — acum e descriptorul + tagline.
export default function manifest() {
  return {
    name: APP_NAME,
    short_name: APP_NAME,
    description: `${APP_DESCRIPTOR}. ${appTagline('en')}`,
    start_url: '/dashboard',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#0b0e2a',
    theme_color: '#0b0e2a',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  }
}
