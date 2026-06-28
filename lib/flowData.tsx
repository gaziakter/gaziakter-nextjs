import React from 'react'
import { ProjectData, BlogPost, ButtonData } from './types'

function Stars({ rating }: { rating: number }) {
  return (
    <span className="stars">
      {Array.from({ length: 5 }, (_, i) => (
        <i key={i} className={i < rating ? 'fa-solid fa-star' : 'fa-regular fa-star'} />
      ))}
    </span>
  )
}

export interface Flow {
  id: string
  triggers?: string[]
  type: 'generic' | 'projects' | 'contact' | 'blog'
  renderContent?: () => React.ReactNode
  options?: ButtonData[]
}

export const PROJECTS: ProjectData[] = [
  {
    title: 'Gallery Project', category: 'eCommerce',
    link: 'https://link-to-your-website.com',
    image: '/img/projects/project-1.jpg', media: 'gallery',
    summary: 'Interactive e-commerce website with multiple product views and zoom features built with React and Node js.',
    galleryImages: ['/img/projects/project-1-big.jpg', '/img/projects/project-2-big.jpg', '/img/projects/project-3-big.jpg'],
  },
  {
    title: 'YouTube Project', category: 'Video',
    link: 'https://link-to-your-website.com',
    image: '/img/projects/project-2.jpg', media: 'youtube', youtubeId: 'SjJhuZQlkbA',
    summary: 'A short video showcasing the concept, key features, and the overall user experience in action.',
  },
  {
    title: 'Image Project', category: 'Web App',
    image: '/img/projects/project-3.jpg', media: 'image',
    summary: 'Interactive e-commerce website with multiple product views and zoom features built with React and Node js.',
  },
  {
    title: 'MP4 Video Project', category: 'Product',
    link: 'https://link-to-your-website.com',
    image: '/img/projects/project-4.jpg', media: 'video', videoUrl: '/img/video.mp4',
    summary: 'A launch video presenting the product vision, core features, and the experience delivered to users.',
  },
]

export const BLOG_POSTS: BlogPost[] = [
  { title: 'Building Modern UIs with React', date: 'June 5, 2025', category: 'React', image: '/img/projects/project-1.jpg', link: 'https://example.com/blog/post-1', excerpt: 'Exploring the latest patterns and best practices for creating scalable, maintainable React applications in 2025.' },
  { title: 'CSS Grid vs Flexbox: When to Use Which', date: 'May 18, 2025', category: 'CSS', image: '/img/projects/project-2.jpg', link: 'https://example.com/blog/post-2', excerpt: 'A deep dive into the differences between CSS Grid and Flexbox, and when to reach for each tool in your layouts.' },
  { title: 'JavaScript Performance Tips', date: 'April 30, 2025', category: 'JavaScript', image: '/img/projects/project-3.jpg', link: 'https://example.com/blog/post-3', excerpt: 'Practical techniques to make your JavaScript apps faster, from code splitting to lazy loading strategies.' },
]


export const FLOWS: Flow[] = [
  {
    id: 'about', triggers: ['about', 'about me', 'about you', 'who are you', 'profile', 'bio', 'biography', 'introduction', 'who', 'you', 'me'],
    type: 'generic',
    renderContent: () => (
      <>
        <p>I&apos;m a <strong>Senior Full Stack Web Developer</strong> with 8+ years of experience in designing, developing, and maintaining modern web applications. I specialize in <strong>Next.js, React.js, Laravel,</strong> and <strong>WordPress</strong> development.</p>
        <p>My expertise includes building custom web solutions, REST APIs, eCommerce platforms, CMS development, performance optimization, and scalable applications. I am passionate about writing clean, efficient code and delivering high-quality <strong>digital experiences</strong> that help businesses grow and succeed online.</p>
        <div className="list-with-icons">
          <span><span><i className="fa-regular fa-star"></i> 8+ Years in Web Development</span></span>
          <span><span><i className="fa-solid fa-code"></i> 62+ Completed Projects</span></span>
          <span><span><i className="fa-regular fa-face-grin-wide"></i> 55+ Happy Customers</span></span>
          <span><span><i className="fa-regular fa-calendar-check"></i> Available for Freelance</span></span>
        </div>
      </>
    ),
    options: [
      { label: 'Talk Me', action: 'contact', variant: 'primary' },
      { label: 'View Skills', action: 'skills', variant: 'secondary' },
    ],
  },
  {
    id: 'skills', triggers: ['skills', 'technologies', 'stack', 'tech', 'tools', 'what can you do', 'capabilities', 'services'],
    type: 'generic',
    renderContent: () => (
      <>
        <p>Here are the tools and technologies I use daily to build reliable, modern interfaces with a strong focus on <strong>quality and performance.</strong></p>
        <h2 className="category-skills"><i className="fa-solid fa-laptop"></i>Frontend</h2>
        <ul className="list-skills">
          <li>Next.js<Stars rating={5} /></li>
          <li>React<Stars rating={5} /></li>
          <li>TypeScript<Stars rating={5} /></li>
          <li>JavaScript<Stars rating={5} /></li>
        </ul>
        <h2 className="category-skills"><i className="fa-solid fa-server"></i>Backend</h2>
        <ul className="list-skills">
          <li>Laravel<Stars rating={5} /></li>
          <li>Express.js<Stars rating={5} /></li>
          <li>PHP<Stars rating={5} /></li>
          <li>Node.js<Stars rating={5} /></li>
        </ul>
        <h2 className="category-skills"><i className="fa-solid fa-database"></i>Database</h2>
        <ul className="list-skills">
          <li>PostgreSQL<Stars rating={5} /></li>
          <li>MySQL<Stars rating={5} /></li>
          <li>MongoDB<Stars rating={5} /></li>
        </ul>
      </>
    ),
    options: [
      { label: 'Talk Me', action: 'contact', variant: 'primary' },
      { label: 'View Projects', action: 'projects', variant: 'secondary' },
    ],
  },
  {
    id: 'projects', triggers: ['projects', 'portfolio', 'work', 'examples', 'case studies', 'show me', 'builds', 'apps', 'websites'],
    type: 'projects',
  },
  {
    id: 'blog', triggers: ['blog', 'articles', 'posts', 'read', 'writing', 'thoughts', 'publications', 'write', 'article'],
    type: 'blog',
  },
  {
    id: 'contact', triggers: ['contact', 'touch', 'reach', 'message', 'hire', 'email', 'call', 'talk me'],
    type: 'contact',
  },
  {
    id: 'hello', triggers: ['hi', 'hello', 'hey', 'greeting', 'yo'],
    type: 'generic',
    renderContent: () => (
      <>
        <p>Hi there I&apos;m <strong>Gazi Akter!</strong></p>
        <p>Please use the following commands to learn more about my journey:</p>
        <p><strong>about</strong>, <strong>skills</strong>, <strong>projects</strong>, <strong>clients</strong>, <strong>blog</strong>, <strong>contact</strong>.</p>
      </>
    ),
  },
  {
    id: 'hobbies', triggers: ['hobbies', 'interests', 'fun', 'life', 'leisure'],
    type: 'generic',
    renderContent: () => (
      <>
        <p>Beyond coding, I like to keep my mind and body active with these activities:</p>
        <div className="list-with-icons">
          <span><span><i className="fas fa-camera"></i> <strong>Photography</strong> — Capturing urban landscapes and nature.</span></span>
          <span><span><i className="fas fa-plane"></i> <strong>Traveling</strong> — Exploring new cultures and cuisines.</span></span>
          <span><span><i className="fas fa-dumbbell"></i> <strong>Fitness</strong> — Hitting the gym to stay energized.</span></span>
          <span><span><i className="fas fa-gamepad"></i> <strong>Gaming</strong> — Love immersive RPGs and strategy games.</span></span>
        </div>
      </>
    ),
    options: [
      { label: 'Talk Me', action: 'contact', variant: 'primary' },
      { label: 'More About Me', action: 'about', variant: 'secondary' },
    ],
  },
  {
    id: 'age', triggers: ['age', 'old', 'how old are you', 'your age', 'born'],
    type: 'generic',
    renderContent: () => <p>I was born on March 15, 1999 in Bangladesh. I am currently <strong>27 years old.</strong></p>,
    options: [
      { label: 'More About Me', action: 'about', variant: 'primary' },
    ],
  },
  {
    id: 'cv', triggers: ['cv', 'curriculum vitae', 'resume', 'your cv'],
    type: 'generic',
    renderContent: () => (
      <>
        <p>Absolutely! Here is my complete <strong>curriculum vitae.</strong></p>
        <p>Click the button below to download the PDF file.</p>
      </>
    ),
    options: [{ label: 'Download CV', link: '/assets/cv.pdf', variant: 'primary' }],
  },
  {
    id: 'education', triggers: ['education', 'university', 'degrees', 'studies', 'academic', 'graduation'],
    type: 'generic',
    renderContent: () => (
      <>
        <p>I graduated with a <strong>BS in Computer Science</strong> from Dhaka University.</p>
        <p>You can find more detailed information about my academic journey in my <strong>CV.</strong></p>
      </>
    ),
    options: [
      { label: 'Download CV', link: '/assets/cv.pdf', variant: 'primary' },
      { label: 'More About Me', action: 'about', variant: 'secondary' },
    ],
  },
  {
    id: 'experience', triggers: ['experience', 'career'],
    type: 'generic',
    renderContent: () => (
      <>
        <p>I am currently working as a <strong>Senior Full Stack Developer,</strong> with 8+ years of experience building scalable web applications.</p>
        <p>Download my full CV for a comprehensive timeline of my professional journey.</p>
      </>
    ),
    options: [
      { label: 'Download CV', link: '/assets/cv.pdf', variant: 'primary' },
      { label: 'View My Projects', action: 'projects', variant: 'secondary' },
    ],
  },
  {
    id: 'awards', triggers: ['awards', 'certificates', 'courses', 'training', 'certifications'],
    type: 'generic',
    renderContent: () => (
      <>
        <p>Here is a list of <strong>certifications</strong> I earned in recent years:</p>
        <ul>
          <li>AWS Solutions Architect</li>
          <li>Google Cloud Developer</li>
          <li>Meta Front-End Specialization</li>
        </ul>
      </>
    ),
    options: [
      { label: 'Download CV', link: '/assets/cv.pdf', variant: 'primary' },
      { label: 'View My Projects', action: 'projects', variant: 'secondary' },
    ],
  },
  {
    id: 'msg_success', type: 'generic',
    renderContent: () => (
      <>
        <p><strong>Your message was sent successfully!</strong></p>
        <p>Rest assured, I&apos;ll be in touch within 24 hours.</p>
      </>
    ),
    options: [
      { label: 'View My Projects', action: 'projects', variant: 'primary' },
      { label: 'See my Hobbies', action: 'hobbies', variant: 'secondary' },
    ],
  },
  {
    id: 'error', type: 'generic',
    renderContent: () => (
      <>
        <p>I&apos;m sorry, I didn&apos;t quite catch that. Try one of these commands:</p>
        <p><strong>about</strong>, <strong>skills</strong>, <strong>projects</strong>, <strong>clients</strong>, <strong>blog</strong>, <strong>contact</strong>.</p>
      </>
    ),
  },
]
