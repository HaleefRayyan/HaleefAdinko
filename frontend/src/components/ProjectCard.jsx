import React, { useState } from 'react';

export const ProjectCard = ({ project }) => {
  const images = Array.isArray(project.images) && project.images.length > 0
    ? project.images
    : [project.image].filter(Boolean);

  const [activeIndex, setActiveIndex] = useState(0);
  const hasMultipleImages = images.length > 1;

  const goToPrevious = () => {
    setActiveIndex((current) => (current === 0 ? images.length - 1 : current - 1));
  };

  const goToNext = () => {
    setActiveIndex((current) => (current === images.length - 1 ? 0 : current + 1));
  };

  const activeImage = images[activeIndex] || images[0];

  return (
    <div className="project-card">
      <div className="project-img-wrapper" style={{ position: 'relative', overflow: 'hidden', borderRadius: '18px 18px 0 0' }}>
        <div style={{ position: 'relative', height: 'clamp(200px, 35vw, 260px)' }}>
          <img src={activeImage} alt={project.title} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />

          {hasMultipleImages && (
            <>
              <button
                type="button"
                onClick={goToPrevious}
                aria-label="Previous image"
                style={{
                  position: 'absolute',
                  left: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'rgba(17,24,39,0.55)',
                  border: 'none',
                  color: '#fff',
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  fontSize: '1.1rem',
                  lineHeight: '1'
                }}
              >
                ‹
              </button>

              <button
                type="button"
                onClick={goToNext}
                aria-label="Next image"
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'rgba(17,24,39,0.55)',
                  border: 'none',
                  color: '#fff',
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  fontSize: '1.1rem',
                  lineHeight: '1'
                }}
              >
                ›
              </button>
            </>
          )}

          <span className="project-tag-badge">{project.category}</span>
        </div>

        {hasMultipleImages && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px', padding: '10px 12px 0', background: '#fff' }}>
            {images.map((_, index) => (
              <button
                key={`${project.id}-dot-${index}`}
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={`Show slide ${index + 1}`}
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  border: 'none',
                  background: activeIndex === index ? '#1d4d2d' : '#d1d5db',
                  cursor: 'pointer',
                  padding: 0
                }}
              />
            ))}
          </div>
        )}
      </div>

      <div className="project-body">
        <h4 className="project-title">{project.title}</h4>
        <div className="project-location-pill">
          {project.location}
        </div>
        <p className="project-desc">{project.description}</p>
      </div>
    </div>
  );
};
