import React from 'react'

function Star({ filled }) {
  return (
    <svg viewBox="0 0 24 24" fill={filled ? 'var(--star)' : 'none'} stroke={filled ? 'var(--star)' : 'var(--text-faint)'} strokeWidth="1.5">
      <path d="M12 2l2.9 6.6L22 9.3l-5 4.9 1.2 7.1L12 17.8l-6.2 3.5L7 14.2 2 9.3l7.1-.7z" />
    </svg>
  )
}

export default function StarRating({ rating = 0, count = 0 }) {
  const rounded = Math.round(rating)
  return (
    <div className="stars" aria-label={`${rating} out of 5 stars, ${count} reviews`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} filled={i <= rounded} />
      ))}
      <span>({count})</span>
    </div>
  )
}
