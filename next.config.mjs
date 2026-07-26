/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  // sect. H2 (addendum 26.07): marcaj de build discret in Setari — hash
  // scurt + data buildului, ca sa se stie mereu prin ce geam se uita
  // cineva inainte de un verdict Poarta 1. VERCEL_GIT_COMMIT_SHA e oferit
  // automat de Vercel la build, dar nu e NEXT_PUBLIC_ implicit — il
  // expunem aici. Data e evaluata AICI (la build), deci e chiar data
  // buildului, nu data la care ruleaza pagina.
  env: {
    NEXT_PUBLIC_BUILD_SHA: (process.env.VERCEL_GIT_COMMIT_SHA || '').slice(0, 7),
    NEXT_PUBLIC_BUILD_DATE: new Date().toISOString(),
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
        ],
      },
    ]
  },
};

export default nextConfig;
