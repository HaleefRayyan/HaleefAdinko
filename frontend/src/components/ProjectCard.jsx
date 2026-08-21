import React from 'react';
import { MapPin } from 'lucide-react';

export const ProjectCard = ({ project }) => {
  return (
    <div className="project-card">
      <div className="project-img-wrapper">
        <img src={project.image} alt={project.title} loading="lazy" />
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
