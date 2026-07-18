'use client'

// ECRAN-PROBA /proba/video — POARTA 1 pentru blocul 1 (WaterVideoLayer).
// Arata ca Azi (seara): apa fullscreen + UN card de sticla cu salutul.
// FARA controale — selectorul de placi traieste doar pe /dev/water-video.
// Accesibil pe link real. TEMPORAR: se sterge la trecerea Portii 2.

import WaterVideoLayer from '../../components/water/WaterVideoLayer'

export default function ProbaVideo() {
  return (
    <>
      <WaterVideoLayer src="/ocean.mp4" poster="/ocean-poster.jpg" />
      <main className="proba">
        <div className="proba-card">
          <h1>Bună seara</h1>
        </div>
      </main>

      <style jsx>{`
        .proba {
          position: fixed;
          inset: 0;
          z-index: 2;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding: 18vh 24px 24px;
          pointer-events: none;
        }
        .proba-card {
          pointer-events: auto;
          padding: 26px 44px;
          border-radius: 20px;
          background: rgba(10, 9, 21, 0.45);
          border: 1px solid rgba(229, 169, 60, 0.15);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
        }
        .proba-card h1 {
          margin: 0;
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-weight: 500;
          font-size: 34px;
          color: #f4f0ea;
          text-align: center;
          text-shadow: 0 1px 18px rgba(0, 0, 0, 0.5);
        }
      `}</style>
    </>
  )
}
