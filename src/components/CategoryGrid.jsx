import React from 'react'
import { Link } from 'react-router-dom'

const icons = {
  fashion: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M8 4l4 3 4-3 4 3-2 3v10H6V10L4 7z" />
    </svg>
  ),
  sports: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.5 2.5 15.5 0 18M12 3c-2.5 2.5-2.5 15.5 0 18" />
    </svg>
  ),
  electronics: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="7" y="7" width="10" height="10" rx="1.5" />
      <path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3" />
    </svg>
  ),
  phones: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="7" y="2" width="10" height="20" rx="2.5" />
      <line x1="11" y1="18" x2="13" y2="18" />
    </svg>
  ),
  default: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M20.6 12.3L12 20.9a2 2 0 01-2.8 0L3 14.7a2 2 0 010-2.8L11.6 3.3A2 2 0 0113 2.7l7 1.3.9 6.9a2 2 0 01-1.3 1.4z" />
      <circle cx="16.5" cy="7.5" r="1.4" />
    </svg>
  ),
}

export function categoryIcon(name) {
  return icons[name?.toLowerCase()] || icons.default
}

export default function CategoryGrid({ categories }) {
  if (!categories.length) return null

  return (
    <section className="section" id="categories">
      <div className="wrap">
        <div className="section-title">
          <h2>Shop by Category</h2>
          <p>Browse our wide range of categories</p>
        </div>

        <div className="category-grid">
          {categories.map((cat) => (
            <Link to={`/shop?category=${cat.name}`} className="category-card" key={cat.name}>
              <div className="category-icon">{categoryIcon(cat.name)}</div>
              <h3>{cat.name}</h3>
              <span>{cat.count} {cat.count === 1 ? 'product' : 'products'}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
