import React, { useEffect, useState, useCallback } from 'react'
import axiosInstance from '../api/axiosInstance.js'
import { formatPrice, getDiscountPercent } from '../api/products.js'
import './Home.css'

// Fetches the product list from the backend.
// Defined locally because api/products.js doesn't export this yet.
async function fetchProducts() {
  const res = await axiosInstance.get('/products')
  const data = res.data
  // Handle a few common response shapes defensively
  const products = Array.isArray(data)
    ? data
    : data.products || data.data || []
  return { products }
}

// Builds a { name, count }[] list of categories from the products array.
// Defined locally because the project's api/products.js doesn't export this.
function buildCategoryList(products) {
  const counts = {}
  for (const p of products) {
    const name = p.category
    if (!name) continue
    counts[name] = (counts[name] || 0) + 1
  }
  return Object.entries(counts).map(([name, count]) => ({ name, count }))
}

/* ============================
   Star Rating
============================ */
function Star({ filled }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill={filled ? 'var(--star)' : 'var(--line)'}
      stroke={filled ? 'var(--star)' : 'var(--line)'}
      strokeWidth="1"
      style={{ transition: 'fill 0.2s ease, stroke 0.2s ease' }}
    >
      <path d="M12 2l3.09 6.26 6.91.9-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-.9L12 2z" />
    </svg>
  )
}

function StarRating({ rating = 0, count = 0 }) {
  const rounded = Math.round(rating)
  return (
    <div className="stars" aria-label={`${rating} out of 5 stars, ${count} reviews`} style={{ display: 'flex', alignItems: 'center', gap: '3px', margin: '6px 0' }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} filled={i <= rounded} />
      ))}
      <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginLeft: '4px' }}>
        ({count})
      </span>
    </div>
  )
}

/* ============================
   Product Card
============================ */
function resolveImageUrl(product) {
  const fallbackImage = 'https://placehold.co/400x400/e2e8f0/94a3b8?text=No+Image'
  if (!product) return fallbackImage

  const imgObj = product.images?.[0] || product.imageCover || product.image || product.coverImage
  if (!imgObj) return fallbackImage

  if (typeof imgObj === 'string') return imgObj
  if (typeof imgObj === 'object') {
    return imgObj.url || imgObj.secure_url || imgObj.publicUrl || imgObj.src || fallbackImage
  }

  return fallbackImage
}

function ProductCard({ product, onAddToCart, isWishlisted = false, onToggleWishlist }) {
  const image = resolveImageUrl(product)
  const discount = getDiscountPercent(product)
  const outOfStock = !product.stock || product.stock <= 0
  const tag = product.subcategory || product.category

  const handleWishlistClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    onToggleWishlist?.(product._id)
  }

  const handleAddToCartClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!outOfStock) {
      onAddToCart?.(product)
    }
  }

  return (
    <article className="product-card">
      <div className="product-media">
        {image && <img src={image} alt={product.name} loading="lazy" />}

        {tag && <span className="tag-pill">{tag}</span>}

        {discount > 0 && <span className="discount-pill">-{discount}%</span>}

        <button
          className={`wishlist-btn${isWishlisted ? ' active' : ''}`}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          onClick={handleWishlistClick}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill={isWishlisted ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
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
          <span className="price-now">
            {formatPrice(product.discountPrice && product.discountPrice < product.price ? product.discountPrice : product.price)}
          </span>
          {discount > 0 && <span className="price-was">{formatPrice(product.price)}</span>}
        </div>

        <button className="product-cta" disabled={outOfStock} onClick={handleAddToCartClick}>
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

/* ============================
   Skeleton Card (loading state)
============================ */
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

/* ============================
   Category Icons + Grid
============================ */
const categoryIcons = {
  fashion: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.38 3.46 16 2a4 4 0 0 0-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z" />
    </svg>
  ),
  clothing: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.38 3.46 16 2a4 4 0 0 0-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z" />
    </svg>
  ),
  sports: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M6 12A6 6 0 0 1 12 6M12 18a6 6 0 0 1 6-6" />
    </svg>
  ),
  electronics: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="14" x="2" y="3" rx="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  ),
  phones: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
      <path d="M12 18h.01" />
    </svg>
  ),
  books: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  ),
  accessories: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="6" />
      <path d="M12 10v2.2l1.6 1" />
      <path d="m16.13 7.66-.81-4.05a2 2 0 0 0-2-1.61h-2.68a2 2 0 0 0-2 1.61l-.78 4.05" />
      <path d="m7.88 16.36.8 4a2 2 0 0 0 2 1.61h2.72a2 2 0 0 0 2-1.61l.81-4.05" />
    </svg>
  ),
  audio: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
      <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
    </svg>
  ),
  kitchen: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
      <path d="M7 2v4" />
      <path d="M21 15V2a5 5 0 0 0-5 5v8c0 1.1.9 2 2 2h3v4" />
      <path d="M12 2v20" />
    </svg>
  ),
  home: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
  default: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
      <line x1="7" y1="7" x2="7.01" y2="7" />
    </svg>
  ),
}

function categoryIcon(name) {
  return categoryIcons[name?.toLowerCase()] || categoryIcons.default
}

function CategoryGrid({ categories }) {
  if (!categories.length) return null

  return (
    <section className="section" id="categories" style={{ padding: '64px 0' }}>
      <div className="wrap">
        <div className="section-title" style={{ marginBottom: '40px' }}>
          <h2 style={{ fontWeight: '700' }}>Shop by Category</h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>
            Browse our wide range of categories
          </p>
        </div>

        <div className="category-grid">
          {categories.map((cat) => (
            <a href={`/shop?category=${encodeURIComponent(cat.name)}`} className="category-card" key={cat.name}>
              <div className="category-icon">{categoryIcon(cat.name)}</div>
              <h3>{cat.name}</h3>
              <span>{cat.count} {cat.count === 1 ? 'product' : 'products'}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ============================
   Featured Products
============================ */
function FeaturedProducts({
  products,
  status,
  error,
  onRetry,
  onAddToCart,
  wishlist = [],
  onToggleWishlist,
}) {
  const displayedProducts = products.slice(0, 8)

  return (
    <section className="section featured-section" style={{ padding: '64px 0' }}>
      <div className="wrap">
        <div className="section-head-row" style={{ marginBottom: '32px' }}>
          <div>
            <h2 style={{ fontWeight: '700' }}>Featured Products</h2>
            <p style={{ color: 'var(--text-muted)', marginTop: '4px' }}>Handpicked just for you</p>
          </div>
          <a href="/shop" className="view-all" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            View All
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </a>
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
            <h3 style={{ fontWeight: '600' }}>Couldn't load products</h3>
            <p>{error}</p>
            <button className="retry-btn" onClick={onRetry}>Try again</button>
          </div>
        )}

        {status === 'success' && displayedProducts.length === 0 && (
          <div className="state-block">
            <h3 style={{ fontWeight: '600' }}>No products yet</h3>
            <p>Check back soon — new drops are on the way.</p>
          </div>
        )}

        {status === 'success' && displayedProducts.length > 0 && (
          <>
            {/* Desktop Grid Layout */}
            <div className="desktop-grid grid">
              {displayedProducts.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onAddToCart={onAddToCart}
                  isWishlisted={wishlist.includes(product._id)}
                  onToggleWishlist={onToggleWishlist}
                />
              ))}
            </div>

            {/* Mobile Swipeable Snap Carousel Layout */}
            <div className="mobile-carousel">
              {displayedProducts.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onAddToCart={onAddToCart}
                  isWishlisted={wishlist.includes(product._id)}
                  onToggleWishlist={onToggleWishlist}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  )
}

/* ============================
   Hero
============================ */
function Hero() {
  return (
    <section className="hero">
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
          <a href="/shop" className="btn btn-primary" style={{ padding: '14px 28px', borderRadius: '8px' }}>
            Shop Now
          </a>
          <a href="#categories" className="btn btn-outline" style={{ padding: '14px 28px', borderRadius: '8px' }}>
            View Categories
          </a>
        </div>
      </div>
    </section>
  )
}

/* ============================
   How It Works
============================ */
const howItWorksSteps = [
  {
    title: 'Browse Products',
    desc: 'Explore our wide range of premium products',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.34-4.34" />
      </svg>
    ),
  },
  {
    title: 'Add to Cart',
    desc: 'Select your favorites and add them to your cart',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="14" x="2" y="5" rx="2" />
        <line x1="2" y1="10" x2="22" y2="10" />
      </svg>
    ),
  },
  {
    title: 'Order & Receive',
    desc: 'Place your order and get it delivered to your doorstep',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
        <path d="M15 18H9" />
        <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" />
        <circle cx="17" cy="18" r="2" />
        <circle cx="7" cy="18" r="2" />
      </svg>
    ),
  },
]

function HowItWorks() {
  return (
    <section className="section how-it-works" style={{ padding: '64px 0' }}>
      <div className="wrap">
        <div className="section-title" style={{ marginBottom: '48px' }}>
          <h2 style={{ fontWeight: '700', textTransform: 'none' }}>How It Works</h2>
        </div>

        <div className="steps-grid">
          {howItWorksSteps.map((step) => (
            <div className="step-card" key={step.title} style={{ padding: '24px' }}>
              <div className="step-icon">{step.icon}</div>
              <h3 style={{ fontWeight: '600', marginBottom: '8px' }}>{step.title}</h3>
              <p style={{ color: 'var(--text-muted)' }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ============================
   Newsletter
============================ */
function Newsletter() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    if (!email) return
    setSubmitted(true)
    setEmail('')
  }

  return (
    <div className="newsletter-wrap">
      <section className="newsletter">
        <div className="newsletter-icon">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="M2 6l10 7 10-7" />
          </svg>
        </div>

        <h2>Stay Updated</h2>
        <p>Subscribe to our newsletter and get exclusive deals and new arrivals first.</p>

        <form className="newsletter-form" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit">Subscribe</button>
        </form>

        {submitted && <p className="newsletter-note">Thanks — you're on the list!</p>}
      </section>
    </div>
  )
}

/* ============================
   HOME PAGE (default export)
   Note: Navbar is not included here — it's rendered
   once at the layout/App level, not per-page.
============================ */
export default function Home() {
  const [products, setProducts] = useState([])
  const [status, setStatus] = useState('loading') // loading | success | error
  const [error, setError] = useState(null)
  const [wishlist, setWishlist] = useState([])

  const load = useCallback(() => {
    setStatus('loading')
    setError(null)
    fetchProducts()
      .then(({ products }) => {
        setProducts(products)
        setStatus('success')
      })
      .catch((err) => {
        setError(err.message || 'Something went wrong')
        setStatus('error')
      })
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const categories = buildCategoryList(products)

  const handleAddToCart = useCallback((product) => {
    // TODO: wire this to your real cart logic/context
    console.log('Add to cart:', product)
  }, [])

  const handleToggleWishlist = useCallback((productId) => {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    )
  }, [])

  return (
    <div className="home-page">
      <Hero />
      <CategoryGrid categories={categories} />
      <FeaturedProducts
        products={products}
        status={status}
        error={error}
        onRetry={load}
        onAddToCart={handleAddToCart}
        wishlist={wishlist}
        onToggleWishlist={handleToggleWishlist}
      />
      <HowItWorks />
      <Newsletter />
    </div>
  )
}