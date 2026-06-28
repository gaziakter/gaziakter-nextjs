import ActionButton from './ActionButton'

interface IntroScreenProps {
  visible: boolean
  onTrigger: (text: string) => void
}

export default function IntroScreen({ visible, onTrigger }: IntroScreenProps) {
  return (
    <div id="intro-screen" className={`intro-screen${!visible ? ' fade-out' : ''}`}>
      <div className="intro-content">
        <div className="hello"><span>Hello!</span></div>
        <div className="intro-text">
          <h1>I&apos;m <span>Gazi Akter,</span></h1>
          <h2>Sr. Full Stack Web Developer</h2>
        </div>
        <div className="intro-bottom-content">
          <div className="quote">
            <p>Gazi delivers exceptional full-stack solutions - clean code, scalable architecture, and pixel-perfect interfaces every single time.</p>
            <span>Sarah Mitchell - CTO at NexaCloud</span>
          </div>
          <div className="image-container">
            <img id="intro-image" src="/img/avatar-intro.png" alt="Gazi Akter" className="intro-image" />
            <div className="rounded-animation"></div>
          </div>
          <div className="intro-options">
            <ActionButton button={{ label: 'Talk Me', action: 'contact', variant: 'primary' }} onSelect={() => onTrigger('contact')} />
            <ActionButton button={{ label: 'About Me', action: 'about', variant: 'secondary' }} onSelect={() => onTrigger('about')} />
          </div>
        </div>
      </div>
    </div>
  )
}
