import React from 'react';

export const ProjectCard = ({ project }) => {
  const images = Array.isArray(project.images) && project.images.length > 0
    ? project.images
    : [project.image].filter(Boolean);

  const previewImages = images.slice(0, 3);

  return (
    <div className="project-card">
      <div className="project-img-wrapper" style={{ position: 'relative' }}>
        {previewImages.length > 1 ? (
          <div style={{ display: 'grid', gridTemplateColumns: previewImages.length === 2 ? '1fr 1fr' : '1.2fr 0.8fr', gap: '8px', height: '100%' }}>
            <img src={previewImages[0]} alt={project.title} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '16px 0 0 16px' }} />
            <div style={{ display: 'grid', gridTemplateRows: previewImages.length === 2 ? '1fr' : '1fr 1fr', gap: '8px' }}>
              {previewImages.slice(1).map((image, index) => (
                <div key={`${project.id}-thumb-${index}`} style={{ position: 'relative' }}>
                  <img src={image} alt={`${project.title} ${index + 2}`} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: index === 1 && previewImages.length === 3 ? '0 16px 16px 0' : '0 16px 16px 0' }} />
                  {index === previewImages.slice(1).length - 1 && images.length > 3 && (
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(17,24,39,0.52)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, borderRadius: '0 16px 16px 0' }}>
                      +{images.length - 3}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <img src={previewImages[0]} alt={project.title} loading="lazy" />
        )}
        <span className="project-tag-badge">{project.category}</span>
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
