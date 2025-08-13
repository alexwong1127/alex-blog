import Head from 'next/head'
import Layout from '@/components/Layout'
import PostCard from '@/components/PostCard'
import { getSortedPostsData, PostData } from '@/lib/posts'
import { GetStaticProps } from 'next'

interface HomeProps {
  allPostsData: Omit<PostData, 'content'>[]
}

export default function Home({ allPostsData }: HomeProps) {
  return (
    <Layout home>
      <Head>
        <title>Alex's Blog</title>
      </Head>
      
      <section className="hero">
        <h1 className="hero-title">Welcome to Alex's Blog</h1>
        <p className="hero-description">
          A place where I share thoughts on technology, life insights, and personal growth
        </p>
      </section>

      <section className="posts-section">
        <h2 className="section-title">Latest Posts</h2>
        {allPostsData.length > 0 ? (
          <div className="posts-list">
            {allPostsData.map((post) => (
              <PostCard
                key={post.id}
                id={post.id}
                title={post.title}
                date={post.date}
                excerpt={post.excerpt}
                tags={post.tags}
                category={post.category}
              />
            ))}
          </div>
        ) : (
          <p className="no-posts">No posts yet, stay tuned...</p>
        )}
      </section>

      <style jsx>{`
        .hero {
          text-align: center;
          padding: 3rem 0;
          border-bottom: 1px solid #eaeaea;
          margin-bottom: 3rem;
        }

        .hero-title {
          font-size: 2.5rem;
          font-weight: bold;
          margin: 0 0 1rem 0;
          color: #333;
        }

        .hero-description {
          font-size: 1.1rem;
          color: #666;
          margin: 0;
          line-height: 1.6;
        }

        .posts-section {
          margin-bottom: 3rem;
        }

        .section-title {
          font-size: 1.8rem;
          font-weight: 600;
          margin: 0 0 2rem 0;
          color: #333;
        }

        .posts-list {
          /* PostCard components will handle their own styling */
        }

        .no-posts {
          text-align: center;
          color: #666;
          font-style: italic;
          padding: 2rem 0;
        }

        @media (max-width: 600px) {
          .hero {
            padding: 2rem 0;
          }
          
          .hero-title {
            font-size: 2rem;
          }
          
          .hero-description {
            font-size: 1rem;
          }
          
          .section-title {
            font-size: 1.5rem;
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
