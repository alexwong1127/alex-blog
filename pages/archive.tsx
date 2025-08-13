import Head from 'next/head'
import Link from 'next/link'
import Layout from '@/components/Layout'
import { getSortedPostsData, PostData } from '@/lib/posts'
import { GetStaticProps } from 'next'
import { format, parseISO } from 'date-fns'

interface ArchiveProps {
  allPostsData: Omit<PostData, 'content'>[]
}

export default function Archive({ allPostsData }: ArchiveProps) {
  // Group posts by year
  const postsByYear = allPostsData.reduce((acc, post) => {
    const year = format(parseISO(post.date), 'yyyy')
    if (!acc[year]) {
      acc[year] = []
    }
    acc[year].push(post)
    return acc
  }, {} as Record<string, Omit<PostData, 'content'>[]>)

  const years = Object.keys(postsByYear).sort((a, b) => parseInt(b) - parseInt(a))

  return (
    <Layout>
      <Head>
        <title>Archive - Alex's Blog</title>
        <meta name="description" content="All posts archive from Alex's Blog" />
      </Head>
      
      <article className="archive">
        <h1 className="page-title">Archive</h1>
        
        {years.length > 0 ? (
          <div className="archive-content">
            {years.map((year) => (
              <section key={year} className="year-section">
                <h2 className="year-title">{year}</h2>
                <ul className="posts-list">
                  {postsByYear[year].map((post) => (
                    <li key={post.id} className="post-item">
                      <time className="post-date">
                        {format(parseISO(post.date), 'MM-dd')}
                      </time>
                      <Link href={`/posts/${post.id}`} className="post-link">
                        {post.title}
                      </Link>
                      {post.category && (
                        <span className="post-category">{post.category}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        ) : (
          <p className="no-posts">No posts yet, stay tuned...</p>
        )}
      </article>

      <style jsx>{`
        .archive {
          max-width: 100%;
        }

        .page-title {
          font-size: 2.2rem;
          font-weight: bold;
          margin: 0 0 2rem 0;
          color: #333;
          border-bottom: 1px solid #eaeaea;
          padding-bottom: 1rem;
        }

        .archive-content {
          /* Year sections styling */
        }

        .year-section {
          margin-bottom: 3rem;
        }

        .year-title {
          font-size: 1.5rem;
          font-weight: 600;
          margin: 0 0 1.5rem 0;
          color: #0070f3;
        }

        .posts-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .post-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.5rem 0;
          border-bottom: 1px solid #f0f0f0;
        }

        .post-item:last-child {
          border-bottom: none;
        }

        .post-date {
          font-size: 0.9rem;
          color: #666;
          min-width: 3rem;
          font-family: monospace;
        }

        .post-link {
          flex: 1;
          color: #333;
          text-decoration: none;
          transition: color 0.3s;
        }

        .post-link:hover {
          color: #0070f3;
        }

        .post-category {
          background: #f0f0f0;
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
          font-size: 0.8rem;
          color: #666;
        }

        .no-posts {
          text-align: center;
          color: #666;
          font-style: italic;
          padding: 2rem 0;
        }

        @media (max-width: 600px) {
          .page-title {
            font-size: 1.8rem;
          }
          
          .year-title {
            font-size: 1.3rem;
          }
          
          .post-item {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }
          
          .post-date {
            min-width: auto;
          }
        }
      `}</style>
    </Layout>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const allPostsData = getSortedPostsData()
  return {
    props: {
      allPostsData,
    },
  }
}
