'use client'

import { useState } from 'react'

export default function Onboarding() {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    full_name: '',
    date_of_birth: '',
    time_of_birth: '',
    city: ''
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formData })
      })

      const data = await response.json()

      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error('No checkout URL returned')
      }

    } catch (err) {
      console.error(err)
      alert('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <main style={{ maxWidth: '480px', margin: '60px auto', padding: '0 20px' }}>
      <h1 style={{ fontSize: '24px', marginBottom: '8px' }}>Your Alignment Profile</h1>
      <p style={{ color: '#666', marginBottom: '32px' }}>
        Enter your birth details to generate your personal profile.
      </p>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>
            Full Name
          </label>
          <input
            type="text"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            required
            placeholder="Your full name"
            style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '16px' }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>
            Date of Birth
          </label>
          <input
            type="date"
            name="date_of_birth"
            value={formData.date_of_birth}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '16px' }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>
            Time of Birth
          </label>
          <input
            type="time"
            name="time_of_birth"
            value={formData.time_of_birth}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '16px' }}
          />
        </div>

        <div style={{ marginBottom: '32px' }}>
          <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>
            City of Birth
          </label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
            placeholder="e.g. Bucharest"
            style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '16px' }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{ width: '100%', padding: '14px', backgroundColor: loading ? '#999' : '#000', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '16px', cursor: loading ? 'not-allowed' : 'pointer' }}
        >
          {loading ? 'Redirecting to payment...' : 'Generate My Profile →'}
        </button>
      </form>
    </main>
  )
}