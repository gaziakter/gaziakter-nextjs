const SOCIAL_LINKS = [
  { icon: 'fa-brands fa-linkedin-in', url: 'https://linkedin.com', cls: 'linkedin' },
  { icon: 'fa-brands fa-github', url: 'https://github.com', cls: 'github' },
  { icon: 'fa-brands fa-facebook', url: 'https://facebook.com', cls: 'facebook' },
]

export default function ContactContent() {
  return (
    <div className="rich-paragraph contact-section-wrapper">
      <p>I&apos;m always open to new projects, creative ideas and <strong>opportunities.</strong></p>
      <a className="contact-direct-row" href="mailto:gaziakter@website.com">
        <i className="fa-regular fa-envelope-open"></i> <strong>Email:</strong> <span>gaziakter@website.com</span>
      </a>
      <a className="contact-direct-row" href="tel:+8801234567890">
        <i className="fa-brands fa-whatsapp"></i> <strong>Phone:</strong> <span>+880 1234 567 890</span>
      </a>
      <div className="contact-social-row">
        {SOCIAL_LINKS.map((social, index) => (
          <a key={`${social.cls}-${index}`} className="contact-social-icon" href={social.url} target="_blank" rel="noreferrer">
            <i className={`${social.icon} ${social.cls}`}></i>
          </a>
        ))}
      </div>
    </div>
  )
}
