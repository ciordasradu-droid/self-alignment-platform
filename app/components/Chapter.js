'use client'

// Capitol pliabil — profilul e o carte in care te intorci, nu un sul (sect. 6).
// Starea (deschis/inchis) se tine minte per capitol, per persoana.

import { useState, useEffect } from 'react'

export default function Chapter({ id, title, storageKey, defaultOpen = false, children }) {
  const key = `chapter_open:${storageKey}:${id}`
  const [open, setOpen] = useState(defaultOpen)

  useEffect(() => {
    try {
      const saved = localStorage.getItem(key)
      if (saved !== null) setOpen(saved === '1')
    } catch (e) {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  const toggle = () => {
    setOpen((v) => {
      const next = !v
      try { localStorage.setItem(key, next ? '1' : '0') } catch (e) {}
      return next
    })
  }

  return (
    <section id={id} className="chapter">
      <button className="chapter-head" onClick={toggle} aria-expanded={open}>
        <span className="chapter-title">{title}</span>
        <span className={`chapter-chevron${open ? ' open' : ''}`} aria-hidden="true">▾</span>
      </button>
      {open && <div className="chapter-body">{children}</div>}
    </section>
  )
}
