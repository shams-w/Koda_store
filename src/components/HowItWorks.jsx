import React from 'react'

const steps = [
  {
    title: 'Browse Products',
    desc: 'Explore our wide range of premium products',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="11" cy="11" r="7" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
  },
  {
    title: 'Add to Cart',
    desc: 'Select your favorites and add them to your cart',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M6 6h15l-1.5 9h-12z" />
        <path d="M6 6L4 3H2" />
        <circle cx="9" cy="20" r="1.4" />
        <circle cx="18" cy="20" r="1.4" />
      </svg>
    ),
  },
  {
    title: 'Order & Receive',
    desc: 'Place your order and get it delivered to your doorstep',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="1" y="7" width="15" height="10" rx="1.5" />
        <path d="M16 10h4l3 3v4h-7z" />
        <circle cx="6" cy="19.5" r="1.6" />
        <circle cx="18" cy="19.5" r="1.6" />
      </svg>
    ),
  },
]

export default function HowItWorks() {
  return (
    <section className="section how-it-works">
      <div className="wrap">
        <div className="section-title">
          <h2>How It Works</h2>
        </div>

        <div className="steps-grid">
          {steps.map((step) => (
            <div className="step-card" key={step.title}>
              <div className="step-icon">{step.icon}</div>
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
