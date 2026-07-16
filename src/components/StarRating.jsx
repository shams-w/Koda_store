import React from "react";

function Star({ filled }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill={filled ? "#facc15" : "#e2e8f0"}
      stroke={filled ? "#facc15" : "#e2e8f0"}
      strokeWidth="1.5"
    >
      <path d="M12 2l2.9 6.6L22 9.3l-5 4.9 1.2 7.1L12 17.8l-6.2 3.5L7 14.2 2 9.3l7.1-.7z" />
    </svg>
  );
}

export default function StarRating({ rating = 0, count = 0 }) {
  const rounded = Math.round(rating);

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} filled={i <= rounded} />
      ))}

      <span className="ml-1 text-sm text-slate-500">
        ({count})
      </span>
    </div>
  );
}