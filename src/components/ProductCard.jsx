import React from 'react'
import StarRating from './StarRating.jsx'
import { formatPrice, getDiscountPercent } from '../api/products.js'
import { useStore } from '../context/StoreContext.jsx'

const TAG_COLORS = ['#6366f1', '#0ea5e9', '#f97316', '#10b981', '#ec4899', '#8b5cf6']

function colorForTag(tag) {
  let hash = 0
  for (let i = 0; i < tag.length; i++) hash = tag.charCodeAt(i) + ((hash << 5) - hash)
  return TAG_COLORS[Math.abs(hash) % TAG_COLORS.length]
}

export default function ProductCard({ product, onAddToCart }) {
  const { toggleWishlist, isInWishlist } = useStore()
  const wishlisted = isInWishlist(product._id)
  const image = product.images?.[0]?.url
  const discount = getDiscountPercent(product)
  const outOfStock = !product.stock || product.stock <= 0
  const tag = product.subcategory || product.category

  return (
    <article className="product-card">
      <div className="product-media">
        {image && <img src={image} alt={product.name} loading="lazy" />}

        {tag && (
          <span className="tag-pill" style={{ background: colorForTag(tag) }}>
            {tag}
          </span>
        )}

        {discount > 0 && <span className="discount-pill">-{discount}%</span>}

        <button
          className={`wishlist-btn${wishlisted ? ' active' : ''}`}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          onClick={() => toggleWishlist(product)}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill={wishlisted ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
            <path d="M12 20.5s-7.5-4.6-9.8-9.1C.6 7.9 2.3 4.6 5.6 4c2-.4 3.8.5 4.9 2.1.9-1.6 2.9-2.5 4.9-2.1 3.3.6 5 3.9 3.4 7.4C19.5 15.9 12 20.5 12 20.5z" />
          </svg>
        </button>

        {outOfStock && (
          <div className="stock-overlay">
            <span>Out of Stock</span>
          </div>
        )}
      </div>

      <div className="product-info">
        {product.brand && <span className="product-brand">{product.brand}</span>}
        <h3 className="product-name">{product.name}</h3>

        <StarRating rating={product.averageRating} count={product.numReviews} />

        <div className="product-price-row">
          <span className="price-now">{formatPrice(product.discountPrice ?? product.price)}</span>
          {discount > 0 && <span className="price-was">{formatPrice(product.price)}</span>}
        </div>

        <button
          className="product-cta"
          disabled={outOfStock}
          onClick={() => onAddToCart?.(product)}
        >
          {outOfStock ? (
            'Out of Stock'
          ) : (
            <>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 6h15l-1.5 9h-12z" />
                <path d="M6 6L4 3H2" />
                <circle cx="9" cy="20" r="1.4" />
                <circle cx="18" cy="20" r="1.4" />
              </svg>
              Add to Cart
            </>
          )}
        </button>
      </div>
    </article>
  )
}
