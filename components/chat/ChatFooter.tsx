import type { KeyboardEvent } from 'react'

const NAV_ITEMS = [
  { flow: 'about', icon: 'fa-file-lines', label: 'About Me' },
  { flow: 'skills', icon: 'fa-gear', label: 'Skills' },
  { flow: 'projects', icon: 'fa-layer-group', label: 'Projects' },
  { flow: 'blog', icon: 'fa-newspaper', label: 'Blog' },
  { flow: 'contact', icon: 'fa-envelope', label: 'Talk Me' },
]

interface ChatFooterProps {
  inputValue: string
  processing: boolean
  menuOpen: boolean
  onInputChange: (value: string) => void
  onMenuToggle: () => void
  onMenuClose: () => void
  onSubmit: (value: string) => void
}

export default function ChatFooter({
  inputValue,
  processing,
  menuOpen,
  onInputChange,
  onMenuToggle,
  onMenuClose,
  onSubmit,
}: ChatFooterProps) {
  const submitInput = () => {
    const trimmedValue = inputValue.trim()
    if (trimmedValue && !processing) onSubmit(trimmedValue)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') submitInput()
  }

  return (
    <footer id="chat-footer" className="chat-footer">
      <div className="input-nav-wrapper">
        <div className="input-area-visual">
          <button className="btn-menu-toggle" onClick={onMenuToggle}>
            <i className="fa-solid fa-plus"></i>
          </button>
          <input
            type="text"
            id="chat-input"
            placeholder="Try about, skills, or projects..."
            value={inputValue}
            onChange={event => onInputChange(event.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            className="send-btn"
            id="send-button"
            disabled={!inputValue.trim() || processing}
            onClick={submitInput}
          >
            <i className="fa-solid fa-arrow-up"></i>
          </button>
        </div>
        <div className={`primary-nav${menuOpen ? ' menu-active' : ''}`}>
          <div className="nav-links-container">
            {NAV_ITEMS.map(item => (
              <button
                key={item.flow}
                className="btn btn-primary-nav"
                onClick={() => {
                  onMenuClose()
                  onSubmit(item.flow)
                }}
              >
                <i className={`fa-solid ${item.icon}`}></i>{item.label}
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
  )
}
