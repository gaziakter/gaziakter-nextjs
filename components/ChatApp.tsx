'use client'

import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react'
import BlogCard from '@/components/chat/BlogCard'
import ChatFooter from '@/components/chat/ChatFooter'
import ChatWindow from '@/components/chat/ChatWindow'
import ContactContent from '@/components/chat/ContactContent'
import IntroScreen from '@/components/chat/IntroScreen'
import MasterModal from '@/components/chat/MasterModal'
import OptionsList from '@/components/chat/OptionsList'
import Preloader from '@/components/chat/Preloader'
import ProjectCard from '@/components/chat/ProjectCard'
import ThemeToggle from '@/components/chat/ThemeToggle'
import VerticalTexts from '@/components/chat/VerticalTexts'
import { matchFlow } from '@/lib/chatEngine'
import { BLOG_POSTS, FLOWS, PROJECTS } from '@/lib/flowData'
import type { BlogPost, ButtonData, ChatMessage, ModalState, ProjectData } from '@/lib/types'

let messageId = 0
const uid = () => `m${++messageId}`

export default function ChatApp() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [introVisible, setIntroVisible] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [modal, setModal] = useState<ModalState>({ type: null })
  const [preloaded, setPreloaded] = useState(false)

  const projectsRef = useRef<ProjectData[]>([])
  const projectIndexRef = useRef(0)
  const postsRef = useRef<BlogPost[]>([])
  const postIndexRef = useRef(0)
  const triggerRef = useRef<(text: string) => void>(() => {})
  const chatWindowRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const timer = setTimeout(() => setPreloaded(true), 1200)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    document.body.classList.toggle('dark', darkMode)
    return () => document.body.classList.remove('dark')
  }, [darkMode])

  useEffect(() => {
    document.body.classList.toggle('open-menu', menuOpen)
    return () => document.body.classList.remove('open-menu')
  }, [menuOpen])

  const scrollDown = useCallback(() => {
    setTimeout(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }), 50)
  }, [])

  const addMessage = useCallback((message: ChatMessage) => {
    setMessages(previous => [...previous, message])
  }, [])

  const removeTyping = useCallback(() => {
    setMessages(previous => previous.filter(message => message.role !== 'typing'))
  }, [])

  const showTyping = useCallback(() => {
    const id = uid()
    setMessages(previous => [...previous, { id, role: 'typing' }])
    scrollDown()
    return id
  }, [scrollDown])

  const handleOptionSelect = useCallback((button: ButtonData) => {
    if (button.type === 'contact-form') {
      setModal({ type: 'contact' })
      return
    }

    if (button.type === 'next-project') {
      triggerRef.current('__show_next_project__')
      return
    }

    if (button.type === 'next-post') {
      triggerRef.current('__show_next_post__')
      return
    }

    if (button.action) {
      triggerRef.current(button.action)
      return
    }

    if (button.link) window.open(button.link, '_blank')
  }, [])

  const renderOptions = useCallback((options: ButtonData[]) => {
    return <OptionsList options={options} onSelect={handleOptionSelect} />
  }, [handleOptionSelect])

  const filterByCategory = useCallback((category: string) => {
    if (processing) return

    setProcessing(true)
    setIntroVisible(false)
    addMessage({ id: uid(), role: 'user', text: `${category} Projects` })

    const filteredProjects = PROJECTS.filter(project => (
      (project.category || '').toLowerCase() === category.toLowerCase()
    ))

    showTyping()
    setTimeout(() => {
      removeTyping()

      if (!filteredProjects.length) {
        addMessage({
          id: uid(),
          role: 'bot',
          node: <p>No projects found in <strong>{category}</strong>.</p>,
        })
        setProcessing(false)
        scrollDown()
        return
      }

      projectsRef.current = filteredProjects
      projectIndexRef.current = 0

      addMessage({
        id: uid(),
        role: 'bot',
        node: <p>Showing <strong>{filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''}</strong> tagged as <strong>{category}</strong>.</p>,
      })
      setProcessing(false)
      triggerRef.current('__show_next_project__')
      scrollDown()
    }, 600)
  }, [addMessage, processing, removeTyping, scrollDown, showTyping])

  const showNextProject = useCallback(() => {
    const projects = projectsRef.current
    const index = projectIndexRef.current
    if (index >= projects.length) return

    const project = projects[index]
    const isLast = index === projects.length - 1
    projectIndexRef.current += 1

    showTyping()
    setTimeout(() => {
      removeTyping()

      const options: ButtonData[] = []
      if (!isLast) options.push({ label: 'Show Next Project', type: 'next-project', variant: 'primary' })
      if (isLast) {
        options.push({ label: 'Talk Me', action: 'contact', variant: 'primary' })
        options.push({ label: 'View Projects', action: 'projects', variant: 'secondary' })
      }

      addMessage({
        id: uid(),
        role: 'bot',
        node: (
          <ProjectCard
            project={project}
            onGallery={images => setModal({ type: 'gallery', images: images.map(src => ({ src })) })}
            onYoutube={youtubeId => setModal({ type: 'youtube', youtubeId })}
            onVideo={videoUrl => setModal({ type: 'video', videoUrl })}
            onCategory={filterByCategory}
          />
        ),
      })
      addMessage({ id: uid(), role: 'bot', node: renderOptions(options) })
      scrollDown()
    }, 600)
  }, [addMessage, filterByCategory, removeTyping, renderOptions, scrollDown, showTyping])

  const showNextPost = useCallback(() => {
    const posts = postsRef.current
    const index = postIndexRef.current
    if (index >= posts.length) return

    const post = posts[index]
    const isLast = index === posts.length - 1
    postIndexRef.current += 1

    showTyping()
    setTimeout(() => {
      removeTyping()

      const options: ButtonData[] = []
      if (!isLast) options.push({ label: 'Show Next Post', type: 'next-post', variant: 'primary' })
      options.push({ label: 'Hire Me', action: 'contact', variant: 'secondary' })
      if (isLast) {
        options.push({ label: 'Talk Me', action: 'contact', variant: 'primary' })
        options.push({ label: 'View Projects', action: 'projects', variant: 'secondary' })
      }

      addMessage({ id: uid(), role: 'bot', node: <BlogCard post={post} /> })
      addMessage({ id: uid(), role: 'bot', node: renderOptions(options) })
      scrollDown()
    }, 600)
  }, [addMessage, removeTyping, renderOptions, scrollDown, showTyping])

  const triggerInput = useCallback((text: string) => {
    if (text === '__show_next_project__') {
      showNextProject()
      return
    }

    if (text === '__show_next_post__') {
      showNextPost()
      return
    }

    if (processing) return

    setProcessing(true)
    setIntroVisible(false)
    setInputValue('')
    addMessage({ id: uid(), role: 'user', text })

    const flow = matchFlow(text)
    showTyping()

    const delay = 600 + Math.floor(Math.random() * 400)
    setTimeout(() => {
      removeTyping()

      if (flow.type === 'projects') {
        projectsRef.current = PROJECTS
        projectIndexRef.current = 0

        addMessage({
          id: uid(),
          role: 'bot',
          node: <p>Ready to view my recent work? I&apos;ll walk you through my projects one at a time. Click <strong>Show Next Project</strong> below to keep going.</p>,
        })
        setProcessing(false)
        showNextProject()
        scrollDown()
        return
      }

      if (flow.type === 'blog') {
        postsRef.current = BLOG_POSTS
        postIndexRef.current = 0

        addMessage({
          id: uid(),
          role: 'bot',
          node: <p>Here are my latest <strong>articles and thoughts</strong> on web development, design, and technology.</p>,
        })
        setProcessing(false)
        showNextPost()
        scrollDown()
        return
      }

      if (flow.type === 'contact') {
        addMessage({ id: uid(), role: 'bot', node: <ContactContent /> })
        addMessage({
          id: uid(),
          role: 'bot',
          node: renderOptions([
            { label: 'Send Me a Message', type: 'contact-form', variant: 'primary' },
            { label: 'View Projects', action: 'projects', variant: 'secondary' },
          ]),
        })
        setProcessing(false)
        scrollDown()
        return
      }

      if (flow.renderContent) {
        addMessage({
          id: uid(),
          role: 'bot',
          node: <div className="rich-paragraph">{flow.renderContent()}</div>,
        })
      }

      if (flow.options) {
        addMessage({ id: uid(), role: 'bot', node: renderOptions(flow.options) })
      }

      setProcessing(false)
      scrollDown()
    }, delay)
  }, [
    addMessage,
    processing,
    removeTyping,
    renderOptions,
    scrollDown,
    showNextPost,
    showNextProject,
    showTyping,
  ])

  useEffect(() => {
    triggerRef.current = triggerInput
  }, [triggerInput])

  const handleContactSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setModal({ type: null })

    setTimeout(() => {
      const successFlow = FLOWS.find(flow => flow.id === 'msg_success')
      if (!successFlow) return

      addMessage({
        id: uid(),
        role: 'bot',
        node: <div className="rich-paragraph">{successFlow.renderContent?.()}</div>,
      })

      if (successFlow.options) {
        addMessage({ id: uid(), role: 'bot', node: renderOptions(successFlow.options) })
      }

      scrollDown()
    }, 400)
  }

  return (
    <>
      {!preloaded && <Preloader />}

      <main className="chat-wrapper" id="chat-wrapper">
        <section className="chat-container" id="chat-container">
          <div className="chat-area-content">
            <IntroScreen visible={introVisible} onTrigger={triggerInput} />
            <ChatWindow ref={chatWindowRef} messages={messages} />
            <ChatFooter
              inputValue={inputValue}
              processing={processing}
              menuOpen={menuOpen}
              onInputChange={setInputValue}
              onMenuToggle={() => setMenuOpen(open => !open)}
              onMenuClose={() => setMenuOpen(false)}
              onSubmit={triggerInput}
            />
          </div>
        </section>
      </main>

      <VerticalTexts />
      <ThemeToggle darkMode={darkMode} onChange={setDarkMode} />
      <MasterModal
        modal={modal}
        onClose={() => setModal({ type: null })}
        onContactSubmit={handleContactSubmit}
      />
    </>
  )
}
