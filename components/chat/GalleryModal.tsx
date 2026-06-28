'use client'

import { useState } from 'react'
import type { GalleryImage } from '@/lib/types'

export default function GalleryModal({ images }: { images: GalleryImage[] }) {
  const [current, setCurrent] = useState(0)

  return (
    <div className="modal-slider" style={{ position: 'relative' }}>
      <div className="modal-counter">{current + 1} of {images.length}</div>
      <div
        className="slider-track"
        style={{
          transform: `translateX(-${current * 100}%)`,
          display: 'flex',
          transition: 'transform 0.3s ease',
        }}
      >
        {images.map((image, index) => (
          <div key={`${image.src}-${index}`} className="slider-item" style={{ minWidth: '100%' }}>
            <img
              src={image.src}
              className="slider-img"
              alt=""
              style={{ width: '100%', objectFit: 'contain', maxHeight: '80vh' }}
            />
          </div>
        ))}
      </div>
      {images.length > 1 && (
        <>
          <button className="slider-nav prev-slide" onClick={() => setCurrent(value => Math.max(0, value - 1))}>
            <i className="fa-solid fa-chevron-left"></i>
          </button>
          <button className="slider-nav next-slide" onClick={() => setCurrent(value => Math.min(images.length - 1, value + 1))}>
            <i className="fa-solid fa-chevron-right"></i>
          </button>
        </>
      )}
    </div>
  )
}
