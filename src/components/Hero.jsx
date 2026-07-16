import React from 'react'
import { Link } from 'react-router-dom'

export default function Hero() {
  return (
    <section className="hero">
      {/* Grid Pattern Overlay */}
      <div className="hero-grid-overlay" />

      <div className="wrap hero-inner" style={{ position: 'relative', zIndex: 2 }}>
        <div className="hero-badge">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--brand-light)' }}>
            <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" />
          </svg>
          <span style={{ fontSize: '13px', fontWeight: '500', letterSpacing: 'normal' }}>
            Premium Shopping Experience
          </span>
        </div>

        <h1 style={{ fontWeight: '800', marginBottom: '24px', maxWidth: '620px' }}>
          Shop the future, delivered today
        </h1>

        <p className="lede" style={{ fontSize: '18px', color: '#cbd5e1', marginBottom: '32px' }}>
          Discover premium products at unbeatable prices. Fast delivery, easy returns,
          and exceptional quality.
        </p>

        <div className="hero-ctas">
          <Link to="/shop" className="btn btn-primary" style={{ padding: '14px 28px', borderRadius: '8px' }}>
            Shop Now
          </Link>
          <a href="#categories" className="btn btn-outline" style={{ padding: '14px 28px', borderRadius: '8px' }}>
            View Categories
          </a>
        </div>
      </div>
    </section>
  )
}