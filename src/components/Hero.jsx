import React from 'react'
import { Link } from 'react-router-dom'

export default function Hero() {
  return (
    <section className="hero">
      <div className="wrap hero-inner">
        <span className="hero-badge">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l2.9 6.6L22 9.3l-5 4.9 1.2 7.1L12 17.8l-6.2 3.5L7 14.2 2 9.3l7.1-.7z" />
          </svg>
          Premium Shopping Experience
        </span>

        <h1>Shop the future, delivered today</h1>

        <p className="lede">
          Discover premium products at unbeatable prices. Fast delivery, easy returns,
          and exceptional quality.
        </p>

        <div className="hero-ctas">
          <Link to="/shop" className="btn btn-primary">
            Shop Now
          </Link>
          <a href="#categories" className="btn btn-outline">
            View Categories
          </a>
        </div>
      </div>
    </section>
  )
}
