'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import { matchFlow } from '@/lib/chatEngine'
import { FLOWS, PROJECTS, BLOG_POSTS } from '@/lib/flowData'
import { ButtonData, ModalState, ProjectData, BlogPost } from '@/lib/types'

// ─── Types ────────────────────────────────────────────────────────────────────
interface Msg {
  id: string
  role: 'user' | 'bot' | 'typing'
  node?: React.ReactNode
  text?: string
}

// ─── Helper: unique id ────────────────────────────────────────────────────────
let _uid = 0
const uid = () => `m${++_uid}`

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ChatApp() {
  const [messages, setMessages]         = useState<Msg[]>([])
  const [introVisible, setIntroVisible] = useState(true)
  const [processing, setProcessing]     = useState(false)
  const [darkMode, setDarkMode]         = useState(false)
  const [menuOpen, setMenuOpen]         = useState(false)
  const [inputVal, setInputVal]         = useState('')
  const [modal, setModal]               = useState<ModalState>({ type: null })
  const [preloaded, setPreloaded]       = useState(false)

  // Projects state
  const projRef          = useRef<ProjectData[]>([])
  const projIdxRef       = useRef(0)

  // Blog state
  const postRef          = useRef<BlogPost[]>([])
  const postIdxRef       = useRef(0)

  // Ref to always have the latest triggerInput without stale closures
  const triggerRef = useRef<(text: string) => void>(() => {})

  const chatWindowRef = useRef<HTMLDivElement>(null)

  // Preloader
  useEffect(() => {
    const t1 = setTimeout(() => setPreloaded(true), 1200)
    return () => clearTimeout(t1)
  }, [])

  // Dark mode on body
  useEffect(() => {
    document.body.classList.toggle('dark', darkMode)
    return () => document.body.classList.remove('dark')
  }, [darkMode])

  // Mobile menu state on body
  useEffect(() => {
    document.body.classList.toggle('open-menu', menuOpen)
    return () => document.body.classList.remove('open-menu')
  }, [menuOpen])

  // Scroll to bottom
  const scrollDown = useCallback(() => {
    setTimeout(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }), 50)
  }, [])

  // Add messages
  const addMsg = useCallback((msg: Msg) => {
    setMessages(prev => [...prev, msg])
  }, [])

  const removeTyping = useCallback(() => {
    setMessages(prev => prev.filter(m => m.role !== 'typing'))
  }, [])

  const showTyping = useCallback(() => {
    const id = uid()
    setMessages(prev => [...prev, { id, role: 'typing' }])
    scrollDown()
    return id
  }, [scrollDown])

  // Option buttons renderer — uses triggerRef to avoid circular deps
  const renderOptions = useCallback((options: ButtonData[]) => {
    return (
      <div className="contextual-options">
        {options.map((btn, i) => (
          <button
            key={i}
            className={`btn btn-primary${btn.variant === 'secondary' ? ' btn-secondary' : ''}`}
            onClick={() => {
              if (btn.type === 'contact-form')   { setModal({ type: 'contact' }); return }
              if (btn.type === 'next-project')   { triggerRef.current('__show_next_project__'); return }
              if (btn.type === 'next-post')       { triggerRef.current('__show_next_post__');    return }
              if (btn.action) triggerRef.current(btn.action)
              else if (btn.link) window.open(btn.link, '_blank')
            }}
          >
            <span className="button-content">
              <span>{btn.label}</span>
              <span>{btn.label}</span>
            </span>
          </button>
        ))}
      </div>
    )
  }, [])

  // Filter projects by category
  const filterByCategory = useCallback((category: string) => {
    if (processing) return
    setProcessing(true)
    setIntroVisible(false)

    addMsg({ id: uid(), role: 'user', text: category + ' Projects' })

    const filtered = PROJECTS.filter(p => (p.category || '').toLowerCase() === category.toLowerCase())

    showTyping()
    setTimeout(() => {
      removeTyping()
      if (!filtered.length) {
        addMsg({ id: uid(), role: 'bot', node: <p>No projects found in <strong>{category}</strong>.</p> })
        setProcessing(false)
        scrollDown()
        return
      }
      projRef.current    = filtered
      projIdxRef.current = 0

      addMsg({ id: uid(), role: 'bot', node: <p>Showing <strong>{filtered.length} project{filtered.length !== 1 ? 's' : ''}</strong> tagged as <strong>{category}</strong>.</p> })
      setProcessing(false)
      // showNextProject will be triggered via triggerRef by the "next-project" button
      // but we immediately show first project
      triggerRef.current('__show_next_project__')
      scrollDown()
    }, 600)
  }, [processing, addMsg, showTyping, removeTyping, scrollDown])

  // Show next project (internal helper)
  const showNextProjectInternal = useCallback(() => {
    const projects = projRef.current
    const idx      = projIdxRef.current
    if (idx >= projects.length) return

    const proj   = projects[idx]
    const isLast = idx === projects.length - 1
    projIdxRef.current++

    showTyping()
    setTimeout(() => {
      removeTyping()

      const btns: ButtonData[] = []
      if (!isLast) btns.push({ label: 'Show Next Project', type: 'next-project', variant: 'primary' })
      if (isLast) {
        btns.push({ label: 'Talk Me', action: 'contact', variant: 'primary' })
        btns.push({ label: 'View Projects', action: 'projects', variant: 'secondary' })
      }

      addMsg({
        id: uid(), role: 'bot',
        node: (
          <ProjectCard
            proj={proj}
            onGallery={imgs => setModal({ type: 'gallery', images: imgs.map(s => ({ src: s })) })}
            onYoutube={id => setModal({ type: 'youtube', youtubeId: id })}
            onVideo={url => setModal({ type: 'video', videoUrl: url })}
            onCategory={filterByCategory}
          />
        ),
      })
      addMsg({ id: uid(), role: 'bot', node: renderOptions(btns) })
      scrollDown()
    }, 600)
  }, [showTyping, removeTyping, addMsg, renderOptions, filterByCategory, scrollDown])

  // Show next blog post (internal helper)
  const showNextPostInternal = useCallback(() => {
    const posts = postRef.current
    const idx   = postIdxRef.current
    if (idx >= posts.length) return

    const post   = posts[idx]
    const isLast = idx === posts.length - 1
    postIdxRef.current++

    showTyping()
    setTimeout(() => {
      removeTyping()

      const btns: ButtonData[] = []
      if (!isLast) btns.push({ label: 'Show Next Post', type: 'next-post', variant: 'primary' })
      btns.push({ label: 'Hire Me', action: 'contact', variant: 'secondary' })
      if (isLast) {
        btns.push({ label: 'Talk Me', action: 'contact', variant: 'primary' })
        btns.push({ label: 'View Projects', action: 'projects', variant: 'secondary' })
      }

      addMsg({ id: uid(), role: 'bot', node: <BlogCard post={post} /> })
      addMsg({ id: uid(), role: 'bot', node: renderOptions(btns) })
      scrollDown()
    }, 600)
  }, [showTyping, removeTyping, addMsg, renderOptions, scrollDown])

  // Trigger input — the main dispatch function
  const triggerInput = useCallback((text: string) => {
    // Internal signals for pagination
    if (text === '__show_next_project__') { showNextProjectInternal(); return }
    if (text === '__show_next_post__')    { showNextPostInternal();    return }

    if (processing) return
    setProcessing(true)
    setIntroVisible(false)
    setInputVal('')

    addMsg({ id: uid(), role: 'user', text })

    const flow = matchFlow(text)
    showTyping()

    const delay = 600 + Math.floor(Math.random() * 400)
    setTimeout(() => {
      removeTyping()

      if (flow.type === 'projects') {
        projRef.current    = PROJECTS
        projIdxRef.current = 0

        addMsg({ id: uid(), role: 'bot', node: <p>Ready to view my recent work? I&apos;ll walk you through my projects one at a time. Click <strong>Show Next Project</strong> below to keep going.</p> })
        setProcessing(false)
        showNextProjectInternal()
        scrollDown()
        return
      }

      if (flow.type === 'blog') {
        postRef.current    = BLOG_POSTS
        postIdxRef.current = 0

        addMsg({ id: uid(), role: 'bot', node: <p>Here are my latest <strong>articles and thoughts</strong> on web development, design, and technology.</p> })
        setProcessing(false)
        showNextPostInternal()
        scrollDown()
        return
      }

      if (flow.type === 'contact') {
        addMsg({
          id: uid(), role: 'bot',
          node: (
            <div className="rich-paragraph contact-section-wrapper">
              <p>I&apos;m always open to new projects, creative ideas and <strong>opportunities.</strong></p>
              <a className="contact-direct-row" href="mailto:gaziakter@website.com">
                <i className="fa-regular fa-envelope-open"></i> <strong>Email:</strong> <span>gaziakter@website.com</span>
              </a>
              <a className="contact-direct-row" href="tel:+8801234567890">
                <i className="fa-brands fa-whatsapp"></i> <strong>Phone:</strong> <span>+880 1234 567 890</span>
              </a>
              <div className="contact-social-row">
                {[
                  { icon: 'fa-brands fa-linkedin-in', url: 'https://linkedin.com', cls: 'linkedin' },
                  { icon: 'fa-brands fa-github', url: 'https://github.com', cls: 'github' },
                  { icon: 'fa-brands fa-facebook', url: 'https://facebook.com', cls: 'facebook' },
                ].map((s, i) => (
                  <a key={i} className="contact-social-icon" href={s.url} target="_blank" rel="noreferrer">
                    <i className={`${s.icon} ${s.cls}`}></i>
                  </a>
                ))}
              </div>
            </div>
          ),
        })
        addMsg({
          id: uid(), role: 'bot',
          node: renderOptions([
            { label: 'Send Me a Message', type: 'contact-form', variant: 'primary' },
            { label: 'View Projects', action: 'projects', variant: 'secondary' },
          ]),
        })
        setProcessing(false)
        scrollDown()
        return
      }

      // Generic flow
      if (flow.renderContent) {
        addMsg({
          id: uid(), role: 'bot',
          node: <div className="rich-paragraph">{flow.renderContent()}</div>,
        })
      }
      if (flow.options) {
        addMsg({ id: uid(), role: 'bot', node: renderOptions(flow.options) })
      }
      setProcessing(false)
      scrollDown()
    }, delay)
  }, [processing, addMsg, showTyping, removeTyping, renderOptions, showNextProjectInternal, showNextPostInternal, scrollDown])

  // Keep triggerRef in sync
  useEffect(() => {
    triggerRef.current = triggerInput
  }, [triggerInput])

  // Contact form submit
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setModal({ type: null })
    setTimeout(() => {
      const successFlow = FLOWS.find(f => f.id === 'msg_success')!
      addMsg({ id: uid(), role: 'bot', node: <div className="rich-paragraph">{successFlow.renderContent?.()}</div> })
      if (successFlow.options) addMsg({ id: uid(), role: 'bot', node: renderOptions(successFlow.options) })
      scrollDown()
    }, 400)
  }

  return (
    <>
      {/* Preloader */}
      {!preloaded && (
        <div id="preloader" className="preloader">
          <div className="line"></div>
        </div>
      )}

      {/* Chat Wrapper */}
      <main className="chat-wrapper" id="chat-wrapper">
        <section className="chat-container" id="chat-container">
          <div className="chat-area-content">

            {/* Intro Screen */}
            <div id="intro-screen" className={`intro-screen${!introVisible ? ' fade-out' : ''}`}>
              <div className="intro-content">
                <div className="hello"><span>Hello!</span></div>
                <div className="intro-text">
                  <h1>I&apos;m <span>Gazi Akter,</span></h1>
                  <h2>Sr. Full Stack Web Developer</h2>
                </div>
                <div className="intro-bottom-content">
                  <div className="quote">
                    <p>Gazi delivers exceptional full-stack solutions — clean code, scalable architecture, and pixel-perfect interfaces every single time.</p>
                    <span>Sarah Mitchell - CTO at NexaCloud</span>
                  </div>
                  <div className="image-container">
                    <img id="intro-image" src="/img/avatar-intro.png" alt="Gazi Akter" className="intro-image" />
                    <div className="rounded-animation"></div>
                  </div>
                  <div className="intro-options">
                    <button className="btn btn-primary" onClick={() => triggerRef.current('contact')}>
                      <span className="button-content"><span>Talk Me</span><span>Talk Me</span></span>
                    </button>
                    <button className="btn btn-primary btn-secondary" onClick={() => triggerRef.current('about')}>
                      <span className="button-content"><span>About Me</span><span>About Me</span></span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Chat Window */}
            <div id="chat-window" className="chat-window" ref={chatWindowRef}>
              <img src="/img/chat-avatar.png" id="chat-avatar" className="chat-avatar-image" alt="Gazi Akter" />
              {messages.map(msg => (
                <div key={msg.id}>
                  {msg.role === 'user' && (
                    <div className="message-row user-message">
                      <div className="message-bubble">{msg.text}</div>
                    </div>
                  )}
                  {msg.role === 'typing' && (
                    <div className="message-row ai-message">
                      <img src="/img/chat-avatar.png" className="chat-avatar" alt="Gazi" />
                      <div className="message-bubble"><div className="typing-indicator"></div></div>
                    </div>
                  )}
                  {msg.role === 'bot' && msg.node && (
                    <div className="message-row ai-message">
                      <img src="/img/chat-avatar.png" className="chat-avatar" alt="Gazi" />
                      <div className="message-bubble">{msg.node}</div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Chat Footer */}
            <footer id="chat-footer" className="chat-footer">
              <div className="input-nav-wrapper">
                <div className="input-area-visual">
                  <button className="btn-menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
                    <i className="fa-solid fa-plus"></i>
                  </button>
                  <input
                    type="text"
                    id="chat-input"
                    placeholder="Try about, skills, or projects..."
                    value={inputVal}
                    onChange={e => setInputVal(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' && inputVal.trim() && !processing) {
                        triggerRef.current(inputVal.trim())
                      }
                    }}
                  />
                  <button
                    className="send-btn"
                    id="send-button"
                    disabled={!inputVal.trim() || processing}
                    onClick={() => {
                      if (inputVal.trim() && !processing) triggerRef.current(inputVal.trim())
                    }}
                  >
                    <i className="fa-solid fa-arrow-up"></i>
                  </button>
                </div>
                <div className={`primary-nav${menuOpen ? ' menu-active' : ''}`}>
                  <div className="nav-links-container">
                    {[
                      { flow: 'about',    icon: 'fa-file-lines',  label: 'About Me' },
                      { flow: 'skills',   icon: 'fa-gear',        label: 'Skills' },
                      { flow: 'projects', icon: 'fa-layer-group', label: 'Projects' },
                      { flow: 'blog',     icon: 'fa-newspaper',   label: 'Blog' },
                      { flow: 'contact',  icon: 'fa-envelope',    label: 'Talk Me' },
                    ].map(n => (
                      <button
                        key={n.flow}
                        className="btn btn-primary-nav"
                        onClick={() => { setMenuOpen(false); triggerRef.current(n.flow) }}
                      >
                        <i className={`fa-solid ${n.icon}`}></i>{n.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <p id="chat-footer-text">
                <i className="fa-regular fa-comment-dots"></i>
                You can ask me about : age · cv · education · experience · awards · blog · hobbies
              </p>
            </footer>

          </div>
        </section>
      </main>

      {/* Vertical Texts */}
      <div className="vertical-texts-container">
        <span className="vertical-text vertical-text-left">Gazi Akter</span>
        <span className="vertical-text vertical-text-right">sr. full stack web developer</span>
      </div>

      {/* Dark Mode Toggle */}
      <div className="skin">
        <input
          type="checkbox"
          className="checkbox"
          id="checkbox"
          checked={darkMode}
          onChange={e => setDarkMode(e.target.checked)}
        />
        <label htmlFor="checkbox" className="checkbox-label">
          <svg className="sun" width="20px" height="20px" strokeWidth="1.5" viewBox="0 0 24 24" fill="none">
            <path d="M12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6C8.68629 6 6 8.68629 6 12C6 15.3137 8.68629 18 12 18Z" stroke="#333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M22 12L23 12M12 2V1M12 23V22M20 20L19 19M20 4L19 5M4 20L5 19M4 4L5 5M1 12L2 12" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <svg className="moon" width="20px" height="20px" strokeWidth="1.5" viewBox="0 0 24 24" fill="none">
            <path d="M3 11.5066C3 16.7497 7.25034 21 12.4934 21C16.2209 21 19.4466 18.8518 21 15.7259C12.4934 15.7259 8.27411 11.5066 8.27411 3C5.14821 4.55344 3 7.77915 3 11.5066Z" stroke="#f1f5f9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </label>
      </div>

      {/* Master Modal */}
      {modal.type && (
        <div
          id="master-modal"
          className={`modal-overlay active${modal.type === 'contact' ? ' modal-contact' : ''}`}
          onClick={e => { if (e.target === e.currentTarget) setModal({ type: null }) }}
        >
          <div className="modal-container">
            <span className="modal-close" onClick={() => setModal({ type: null })}>&times;</span>
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
                  <form className="ajax-contact-form" onSubmit={handleContactSubmit}>
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
      )}
    </>
  )
}

// ─── ProjectCard ──────────────────────────────────────────────────────────────
function ProjectCard({
  proj,
  onGallery,
  onYoutube,
  onVideo,
  onCategory,
}: {
  proj: ProjectData
  onGallery: (imgs: string[]) => void
  onYoutube: (id: string) => void
  onVideo: (url: string) => void
  onCategory: (cat: string) => void
}) {
  let media: React.ReactNode

  if (proj.media === 'gallery' && proj.galleryImages?.length) {
    media = (
      <div className="project-media-wrapper" onClick={() => onGallery(proj.galleryImages!)} style={{ cursor: 'pointer' }}>
        <div className="modal-counter">1 of {proj.galleryImages.length}</div>
        <img src={proj.image} alt={proj.title} />
        <div className="media-icon-overlay"><i className="fa-solid fa-expand"></i></div>
      </div>
    )
  } else if (proj.media === 'youtube') {
    media = (
      <div className="project-media-wrapper" onClick={() => onYoutube(proj.youtubeId!)} style={{ cursor: 'pointer' }}>
        <img src={proj.image} alt={proj.title} />
        <div className="media-icon-overlay"><i className="fa-brands fa-youtube"></i></div>
      </div>
    )
  } else if (proj.media === 'video') {
    media = (
      <div className="project-media-wrapper" onClick={() => onVideo(proj.videoUrl!)} style={{ cursor: 'pointer' }}>
        <img src={proj.image} alt={proj.title} />
        <div className="media-icon-overlay"><i className="fa-solid fa-play"></i></div>
      </div>
    )
  } else {
    media = (
      <div className="project-media-wrapper project-image">
        <img src={proj.image} alt={proj.title} />
      </div>
    )
  }

  return (
    <div className="single-project-card project-fade-in">
      <div className="project-card">
        {media}
        <div className="details">
          {proj.category && (
            <span
              className="blog-card-category project-category-link"
              onClick={() => onCategory(proj.category!)}
              title={`View all ${proj.category} projects`}
            >
              {proj.category}
            </span>
          )}
          <h4>{proj.title}</h4>
          <p>{proj.summary}</p>
          {proj.link && (
            <a href={proj.link} target="_blank" rel="noreferrer" className="preview-link">
              <i className="fa-solid fa-arrow-up-right-from-square"></i> Preview
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── BlogCard ─────────────────────────────────────────────────────────────────
function BlogCard({ post }: { post: BlogPost }) {
  return (
    <div className="single-blog-card">
      <div className="blog-card">
        <div className="blog-card-media">
          <img src={post.image} alt={post.title} />
        </div>
        <div className="blog-card-body">
          <div className="blog-card-meta">
            <span className="blog-card-category">{post.category}</span>
            <span className="blog-card-date"><i className="fa-regular fa-calendar"></i> {post.date}</span>
          </div>
          <h4>{post.title}</h4>
          <p>{post.excerpt}</p>
          {post.link && (
            <a href={post.link} target="_blank" rel="noreferrer" className="blog-read-more">
              <i className="fa-solid fa-arrow-up-right-from-square"></i> Read More
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── GalleryModal ─────────────────────────────────────────────────────────────
function GalleryModal({ images }: { images: { src: string }[] }) {
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
        {images.map((img, i) => (
          <div key={i} className="slider-item" style={{ minWidth: '100%' }}>
            <img
              src={img.src}
              className="slider-img"
              alt=""
              style={{ width: '100%', objectFit: 'contain', maxHeight: '80vh' }}
            />
          </div>
        ))}
      </div>
      {images.length > 1 && (
        <>
          <button className="slider-nav prev-slide" onClick={() => setCurrent(c => Math.max(0, c - 1))}>
            <i className="fa-solid fa-chevron-left"></i>
          </button>
          <button className="slider-nav next-slide" onClick={() => setCurrent(c => Math.min(images.length - 1, c + 1))}>
            <i className="fa-solid fa-chevron-right"></i>
          </button>
        </>
      )}
    </div>
  )
}
