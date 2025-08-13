import Head from 'next/head'
import Layout from '@/components/Layout'

export default function About() {
  return (
    <Layout>
      <Head>
        <title>About Me - Alex's Blog</title>
        <meta name="description" content="Learn more about Alex" />
      </Head>
      
      <article className="about">
        <h1 className="page-title">About Me</h1>
        
        <div className="about-content">
          <p>
            Hello! I'm Alex, welcome to my personal blog.
          </p>
          
          <p>
            Here, I share thoughts about technology, life insights, and personal growth.
            I hope these contents can be helpful or inspiring to you.
          </p>
          
          <h2>My Interests</h2>
          <ul>
            <li>Programming & Technology</li>
            <li>Reading & Learning</li>
            <li>Thinking & Sharing</li>
          </ul>
          
          <h2>Contact Me</h2>
          <p>
            If you'd like to get in touch with me, feel free to reach out:
          </p>
          <ul>
            <li>Email: alexwong1127@gmail.com</li>
            <li>GitHub: github.com/alex</li>
          </ul>
          
          <p>
            Thank you for visiting, I hope you find valuable content here!
          </p>
        </div>
      </article>

      <style jsx>{`
        .about {
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

        .about-content {
          line-height: 1.8;
          color: #333;
        }

        .about-content h2 {
          font-size: 1.5rem;
          font-weight: 600;
          margin: 2rem 0 1rem 0;
          color: #333;
        }

        .about-content p {
          margin: 1rem 0;
        }

        .about-content ul {
          margin: 1rem 0;
          padding-left: 2rem;
        }

        .about-content li {
          margin: 0.5rem 0;
        }

        @media (max-width: 600px) {
          .page-title {
            font-size: 1.8rem;
          }
          
          .about-content h2 {
            font-size: 1.3rem;
          }
        }
      `}</style>
    </Layout>
  )
}
