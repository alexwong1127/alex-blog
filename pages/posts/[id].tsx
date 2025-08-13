import Head from 'next/head'
import Layout from '@/components/Layout'
import { getAllPostIds, getPostData, PostData } from '@/lib/posts'
import { GetStaticProps, GetStaticPaths } from 'next'
import { format, parseISO } from 'date-fns'

interface PostProps {
  postData: PostData
}

export default function Post({ postData }: PostProps) {
  return (
    <Layout>
      <Head>
        <title>{postData.title} - Alex's Blog</title>
        <meta name="description" content={postData.excerpt} />
      </Head>
      
      <article className="post">
        <header className="post-header">
          <h1 className="post-title">{postData.title}</h1>
          
          <div className="post-meta">
            <time className="post-date">
              {format(parseISO(postData.date), 'MMMM dd, yyyy')}
            </time>
            {postData.category && (
              <span className="post-category">{postData.category}</span>
            )}
          </div>

          {postData.tags && postData.tags.length > 0 && (
            <div className="post-tags">
              {postData.tags.map((tag) => (
                <span key={tag} className="tag">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        <div 
          className="post-content"
          dangerouslySetInnerHTML={{ __html: postData.content }}
        />
      </article>

      <style jsx>{`
        .post {
          max-width: 100%;
        }

        .post-header {
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #eaeaea;
        }

        .post-title {
          font-size: 2.2rem;
          font-weight: bold;
          margin: 0 0 1rem 0;
          line-height: 1.3;
          color: #333;
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

        :global(.post-content) {
          line-height: 1.8;
          color: #333;
        }

        :global(.post-content h1),
        :global(.post-content h2),
        :global(.post-content h3),
        :global(.post-content h4),
        :global(.post-content h5),
        :global(.post-content h6) {
          margin: 2rem 0 1rem 0;
          color: #333;
          font-weight: 600;
        }

        :global(.post-content h1) {
          font-size: 1.8rem;
        }

        :global(.post-content h2) {
          font-size: 1.5rem;
        }

        :global(.post-content h3) {
          font-size: 1.3rem;
        }

        :global(.post-content p) {
          margin: 1rem 0;
        }

        :global(.post-content ul),
        :global(.post-content ol) {
          margin: 1rem 0;
          padding-left: 2rem;
        }

        :global(.post-content li) {
          margin: 0.5rem 0;
        }

        :global(.post-content blockquote) {
          border-left: 4px solid #0070f3;
          margin: 1.5rem 0;
          padding: 0 0 0 1rem;
          color: #666;
          font-style: italic;
        }

        :global(.post-content code) {
          background: #f4f4f4;
          padding: 0.2rem 0.4rem;
          border-radius: 3px;
          font-family: 'Courier New', monospace;
          font-size: 0.9em;
        }

        :global(.post-content pre) {
          background: #f4f4f4;
          padding: 1rem;
          border-radius: 5px;
          overflow-x: auto;
          margin: 1.5rem 0;
        }

        :global(.post-content pre code) {
          background: none;
          padding: 0;
        }

        @media (max-width: 600px) {
          .post-title {
            font-size: 1.8rem;
          }
          
          .post-meta {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }
          
          :global(.post-content h1) {
            font-size: 1.5rem;
          }
          
          :global(.post-content h2) {
            font-size: 1.3rem;
          }
        }
      `}</style>
    </Layout>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = getAllPostIds()
  return {
    paths,
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const postData = await getPostData(params?.id as string)
  return {
    props: {
      postData,
    },
  }
}
