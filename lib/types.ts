export interface ProjectData {
  title: string
  link?: string
  image?: string
  media: 'gallery' | 'youtube' | 'video' | 'image'
  youtubeId?: string
  videoUrl?: string
  category?: string
  summary: string
  galleryImages?: string[]
}

export interface BlogPost {
  title: string
  date: string
  category: string
  image: string
  link?: string
  excerpt: string
}

export interface ButtonData {
  label: string
  action?: string
  link?: string
  type?: 'next-project' | 'next-post' | 'contact-form' | 'filter-category'
  category?: string
  variant?: 'primary' | 'secondary'
}

export type ModalType = 'gallery' | 'youtube' | 'video' | 'contact' | null

export interface GalleryImage { src: string }

export interface ModalState {
  type: ModalType
  images?: GalleryImage[]
  youtubeId?: string
  videoUrl?: string
}

export interface ChatMessage {
  id: string
  role: 'user' | 'bot' | 'typing'
  text?: string
  html?: string
  component?: React.ReactNode
}
