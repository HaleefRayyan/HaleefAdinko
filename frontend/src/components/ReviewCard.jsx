import React from 'react';
import { Star } from 'lucide-react';

export const ReviewCard = ({ review, variant = "light" }) => {
  const isDark = variant === "dark";

  return (
    <div className={isDark ? "review-card" : "review-card-light"}>
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

        <div className="star-rating">
          {[...Array(review.rating || 5)].map((_, i) => (
            <Star key={i} size={14} fill="#C5A638" color="#C5A638" />
          ))}
        </div>
      </div>
    </div>
  );
};
