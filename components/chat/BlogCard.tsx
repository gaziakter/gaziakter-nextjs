import type { BlogPost } from '@/lib/types'

export default function BlogCard({ post }: { post: BlogPost }) {
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
