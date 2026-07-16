import React from 'react'
import { Link } from 'react-router-dom'
import ProductCard from './ProductCard.jsx'

function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton-media" />
      <div className="skeleton-lines">
        <div className="skeleton-line" style={{ width: '40%' }} />
        <div className="skeleton-line" style={{ width: '80%' }} />
        <div className="skeleton-line" style={{ width: '55%' }} />
      </div>
    </div>
  )
}

export default function FeaturedProducts({ products, status, error, onRetry, onAddToCart }) {
  return (
    <section className="section featured-section">
      <div className="wrap">
        <div className="section-head-row">
          <div>
            <h2>Featured Products</h2>
            <p>Handpicked just for you</p>
          </div>
          <Link to="/shop" className="view-all">View All →</Link>
        </div>

        {status === 'loading' && (
          <div className="skeleton-grid">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {status === 'error' && (
          <div className="state-block">
            <h3>Couldn't load products</h3>
            <p>{error}</p>
            <button className="retry-btn" onClick={onRetry}>Try again</button>
          </div>
        )}

        {status === 'success' && products.length === 0 && (
          <div className="state-block">
            <h3>No products yet</h3>
            <p>Check back soon — new drops are on the way.</p>
          </div>
        )}

        {status === 'success' && products.length > 0 && (
          <div className="products-grid">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} onAddToCart={onAddToCart} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
