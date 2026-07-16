// LEGEA 4 — orice așteptare e apă: o picătură care pulsează, inele care se
// lărgesc. Niciodată spinner generic.

export default function WaterLoader({ label }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div className="water-loader" aria-hidden="true">
        <i /><i /><i />
        <b />
      </div>
      {label && (
        <p style={{
          marginTop: '20px',
          fontSize: '15px',
          color: 'var(--text-muted)',
          lineHeight: 1.6,
        }}>
          {label}
        </p>
      )}
    </div>
  )
}
