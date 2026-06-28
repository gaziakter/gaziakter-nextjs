import type { FormEvent } from 'react'
import type { ModalState } from '@/lib/types'
import GalleryModal from './GalleryModal'

interface MasterModalProps {
  modal: ModalState
  onClose: () => void
  onContactSubmit: (event: FormEvent<HTMLFormElement>) => void
}

export default function MasterModal({ modal, onClose, onContactSubmit }: MasterModalProps) {
  if (!modal.type) return null

  return (
    <div
      id="master-modal"
      className={`modal-overlay active${modal.type === 'contact' ? ' modal-contact' : ''}`}
      onClick={event => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div className="modal-container">
        <span className="modal-close" onClick={onClose}>&times;</span>
        <div className="modal-content-area">
          {modal.type === 'gallery' && modal.images && (
            <GalleryModal images={modal.images} />
          )}
          {modal.type === 'youtube' && modal.youtubeId && (
            <iframe
              src={`https://www.youtube.com/embed/${modal.youtubeId}?autoplay=1`}
              allowFullScreen
              allow="autoplay"
              style={{ width: '100%', aspectRatio: '16/9', border: 'none', borderRadius: '30px' }}
            />
          )}
          {modal.type === 'video' && modal.videoUrl && (
            <video
              src={modal.videoUrl}
              controls
              autoPlay
              style={{ width: '100%', borderRadius: '30px' }}
            />
          )}
          {modal.type === 'contact' && (
            <div className="contact-form-wrapper">
              <h3>Send Me a Message</h3>
              <form className="ajax-contact-form" onSubmit={onContactSubmit}>
                <input type="text" name="name" placeholder="Your Name" required />
                <input type="email" name="email" placeholder="Your Email" required />
                <input type="text" name="subject" placeholder="Subject" required />
                <textarea name="message" placeholder="Your Message" required></textarea>
                <button type="submit" className="btn btn-primary">
                  <span className="button-content"><span>Send Message</span><span>Send Message</span></span>
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
