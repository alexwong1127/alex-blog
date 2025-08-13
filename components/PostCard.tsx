import Link from 'next/link'
import { format, parseISO } from 'date-fns'

interface PostCardProps {
  id: string
  title: string
  date: string
  excerpt?: string
  tags?: string[]
  category?: string
}

export default function PostCard({ id, title, date, excerpt, tags, category }: PostCardProps) {
  return (
    <article className="post-card">
      <Link href={`/posts/${id}`} className="post-title-link">
        <h2 className="post-title">{title}</h2>
      </Link>
      
      <div className="post-meta">
        <time className="post-date">
          {format(parseISO(date), 'MMMM dd, yyyy')}
        </time>
        {category && (
          <span className="post-category">{category}</span>
        )}
      </div>

      {excerpt && (
        <p className="post-excerpt">{excerpt}</p>
      )}

      {tags && tags.length > 0 && (
        <div className="post-tags">
          {tags.map((tag) => (
            <span key={tag} className="tag">
              {tag}
            </span>
          ))}
        </div>
      )}

      <style jsx>{`
        .post-card {
          border-bottom: 1px solid #eaeaea;
          padding: 2rem 0;
        }

        .post-card:last-child {
          border-bottom: none;
        }

        .post-title-link {
          text-decoration: none;
          color: inherit;
        }

        .post-title {
          margin: 0 0 0.5rem 0;
          font-size: 1.5rem;
          font-weight: 600;
          line-height: 1.3;
          color: #333;
          transition: color 0.3s;
        }

        .post-title-link:hover .post-title {
          color: #0070f3;
        }

        .post-meta {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1rem;
          font-size: 0.9rem;
          color: #666;
        }

        .post-date {
          color: #666;
        }

        .post-category {
          background: #f0f0f0;
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
          font-size: 0.8rem;
        }

        .post-excerpt {
          margin: 1rem 0;
          color: #666;
          line-height: 1.6;
        }

        .post-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .tag {
          background: #e3f2fd;
          color: #1976d2;
          padding: 0.2rem 0.5rem;
          border-radius: 12px;
          font-size: 0.8rem;
        }

        @media (max-width: 600px) {
          .post-title {
            font-size: 1.25rem;
          }
          
          .post-meta {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }
        }
      `}</style>
    </article>
  )
}
