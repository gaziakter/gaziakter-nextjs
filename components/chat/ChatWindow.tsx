import { forwardRef } from 'react'
import type { ChatMessage } from '@/lib/types'

interface ChatWindowProps {
  messages: ChatMessage[]
}

const ChatWindow = forwardRef<HTMLDivElement, ChatWindowProps>(function ChatWindow({ messages }, ref) {
  return (
    <div id="chat-window" className="chat-window" ref={ref}>
      <img src="/img/chat-avatar.png" id="chat-avatar" className="chat-avatar-image" alt="Gazi Akter" />
      {messages.map(message => (
        <div key={message.id}>
          {message.role === 'user' && (
            <div className="message-row user-message">
              <div className="message-bubble">{message.text}</div>
            </div>
          )}
          {message.role === 'typing' && (
            <div className="message-row ai-message">
              <img src="/img/chat-avatar.png" className="chat-avatar" alt="Gazi" />
              <div className="message-bubble"><div className="typing-indicator"></div></div>
            </div>
          )}
          {message.role === 'bot' && message.node && (
            <div className="message-row ai-message">
              <img src="/img/chat-avatar.png" className="chat-avatar" alt="Gazi" />
              <div className="message-bubble">{message.node}</div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
})

export default ChatWindow
