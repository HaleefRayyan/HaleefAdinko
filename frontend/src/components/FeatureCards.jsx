import React, { useState } from 'react';
import { Layers, LayoutGrid, Gem, ShieldCheck, Sparkles } from 'lucide-react';
import { interactiveFeatures } from '../data/siteData';

const getFeatureIcon = (iconName) => {
  switch (iconName) {
    case 'layers': return <Layers size={20} />;
    case 'layout': return <LayoutGrid size={20} />;
    case 'gem': return <Gem size={20} />;
    case 'shield-check': return <ShieldCheck size={20} />;
    default: return <Sparkles size={20} />;
  }
};

export const FeatureCards = ({ activeIndexDefault = 0 }) => {
  const [hoveredIndex, setHoveredIndex] = useState(activeIndexDefault);

  return (
    <div className="feature-cards-grid">
      {interactiveFeatures.map((item, index) => {
        const isActive = hoveredIndex === index;

        return (
          <div
            key={item.id}
            className={`feature-card ${isActive ? 'active' : ''}`}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(index)}
          >
            {/* Background Image Container for Hover/Active State */}
            <div 
              className="feature-card-bg" 
              style={{ backgroundImage: `url(${item.bgImage})` }}
            >
              <div className="feature-card-bg-overlay" />
            </div>

            {/* Foreground Content */}
            <div className="feature-card-content">
              <div className="feature-card-header">
                <div className="feature-icon-box">
                  {getFeatureIcon(item.icon)}
                </div>
                <span className="feature-number">{item.number}</span>
              </div>

              <div>
                <h4 className="feature-card-title">{item.title}</h4>
                <p className="feature-card-desc">{item.description}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
