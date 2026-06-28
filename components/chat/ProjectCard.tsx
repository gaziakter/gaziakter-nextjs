import type { ReactNode } from 'react'
import type { ProjectData } from '@/lib/types'

interface ProjectCardProps {
  project: ProjectData
  onGallery: (images: string[]) => void
  onYoutube: (id: string) => void
  onVideo: (url: string) => void
  onCategory: (category: string) => void
}

export default function ProjectCard({
  project,
  onGallery,
  onYoutube,
  onVideo,
  onCategory,
}: ProjectCardProps) {
  let media: ReactNode

  if (project.media === 'gallery' && project.galleryImages?.length) {
    media = (
      <div className="project-media-wrapper" onClick={() => onGallery(project.galleryImages!)} style={{ cursor: 'pointer' }}>
        <div className="modal-counter">1 of {project.galleryImages.length}</div>
        <img src={project.image} alt={project.title} />
        <div className="media-icon-overlay"><i className="fa-solid fa-expand"></i></div>
      </div>
    )
  } else if (project.media === 'youtube') {
    media = (
      <div className="project-media-wrapper" onClick={() => onYoutube(project.youtubeId!)} style={{ cursor: 'pointer' }}>
        <img src={project.image} alt={project.title} />
        <div className="media-icon-overlay"><i className="fa-brands fa-youtube"></i></div>
      </div>
    )
  } else if (project.media === 'video') {
    media = (
      <div className="project-media-wrapper" onClick={() => onVideo(project.videoUrl!)} style={{ cursor: 'pointer' }}>
        <img src={project.image} alt={project.title} />
        <div className="media-icon-overlay"><i className="fa-solid fa-play"></i></div>
      </div>
    )
  } else {
    media = (
      <div className="project-media-wrapper project-image">
        <img src={project.image} alt={project.title} />
      </div>
    )
  }

  return (
    <div className="single-project-card project-fade-in">
      <div className="project-card">
        {media}
        <div className="details">
          {project.category && (
            <span
              className="blog-card-category project-category-link"
              onClick={() => onCategory(project.category!)}
              title={`View all ${project.category} projects`}
            >
              {project.category}
            </span>
          )}
          <h4>{project.title}</h4>
          <p>{project.summary}</p>
          {project.link && (
            <a href={project.link} target="_blank" rel="noreferrer" className="preview-link">
              <i className="fa-solid fa-arrow-up-right-from-square"></i> Preview
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
