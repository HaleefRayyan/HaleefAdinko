import React from 'react';
import { Star } from 'lucide-react';

export const ReviewCard = ({ review, variant = "light" }) => {
  const isDark = variant === "dark";

  return (
    <div className={isDark ? "review-card" : "review-card-light"}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          padding: '6px 10px',
          borderRadius: '999px',
          background: isDark ? 'rgba(255,255,255,0.08)' : '#ecfdf5',
          color: isDark ? '#d1fae5' : '#166534',
          fontSize: '0.7rem',
          fontWeight: 700,
          letterSpacing: '0.04em',
          textTransform: 'uppercase'
        }}>
          {review.source || 'Google Review'}
        </span>
        <div className="star-rating">
          {[...Array(review.rating || 5)].map((_, i) => (
            <Star key={i} size={14} fill="#C5A638" color="#C5A638" />
          ))}
        </div>
      </div>

      <p className="review-text">
        "{review.text}"
      </p>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div className="review-author">
          <img 
            src={review.avatar} 
            alt={review.name} 
            className="review-avatar" 
            loading="lazy" 
          />
          <div>
            <div className="author-name" style={{ color: isDark ? '#FFFFFF' : '#121212' }}>
              {review.name}
            </div>
            <div className="author-time" style={{ color: isDark ? 'rgba(255,255,255,0.7)' : '#888888' }}>
              {review.time}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
