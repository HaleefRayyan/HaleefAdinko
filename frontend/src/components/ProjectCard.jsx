import React from 'react';

export const ProjectCard = ({ project }) => {
  const images = Array.isArray(project.images) && project.images.length > 0
    ? project.images
    : [project.image].filter(Boolean);

  const previewImages = images.slice(0, 4);

  const getGalleryLayout = () => {
    if (previewImages.length === 1) {
      return {
        gridTemplateColumns: '1fr',
        gridTemplateRows: '1fr',
        largeIndex: 0,
        secondaryIndexes: []
      };
    }

    if (previewImages.length === 2) {
      return {
        gridTemplateColumns: '1.3fr 0.7fr',
        gridTemplateRows: '1fr',
        largeIndex: 0,
        secondaryIndexes: [1]
      };
    }

    if (previewImages.length === 3) {
      return {
        gridTemplateColumns: '1.3fr 0.7fr',
        gridTemplateRows: '1fr 1fr',
        largeIndex: 0,
        secondaryIndexes: [1, 2]
      };
    }

    return {
      gridTemplateColumns: '1fr 1fr',
      gridTemplateRows: '1fr 1fr',
      largeIndex: 0,
      secondaryIndexes: [1, 2, 3]
    };
  };

  const gallery = getGalleryLayout();

  return (
    <div className="project-card">
      <div className="project-img-wrapper" style={{ position: 'relative', overflow: 'hidden' }}>
        {previewImages.length > 1 ? (
          <div style={{ display: 'grid', gridTemplateColumns: gallery.gridTemplateColumns, gridTemplateRows: gallery.gridTemplateRows, gap: '8px', height: '260px' }}>
            <div style={{ position: 'relative', gridRow: previewImages.length === 3 ? '1 / span 2' : '1 / span 1' }}>
              <img src={previewImages[gallery.largeIndex]} alt={project.title} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '16px 0 0 16px' }} />
            </div>

            <div style={{ display: 'grid', gridTemplateRows: previewImages.length === 2 ? '1fr' : 'repeat(2, minmax(0, 1fr))', gap: '8px' }}>
              {previewImages
                .filter((_, index) => index !== gallery.largeIndex)
                .map((image, index, filtered) => (
                  <div key={`${project.id}-thumb-${index}`} style={{ position: 'relative' }}>
                    <img
                      src={image}
                      alt={`${project.title} ${index + 2}`}
                      loading="lazy"
                      style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: filtered.length > 1 && index === filtered.length - 1 ? '0 16px 16px 0' : '0 16px 0 0' }}
                    />
                    {index === filtered.length - 1 && images.length > previewImages.length && (
                      <div style={{ position: 'absolute', inset: 0, background: 'rgba(17,24,39,0.55)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.1rem', borderRadius: '0 16px 16px 0' }}>
                        +{images.length - previewImages.length}
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        ) : (
          <img src={previewImages[0]} alt={project.title} loading="lazy" style={{ width: '100%', height: '260px', objectFit: 'cover', display: 'block' }} />
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
