import Head from 'next/head'
import Link from 'next/link'
import { ReactNode } from 'react'

interface LayoutProps {
  children: ReactNode
  home?: boolean
}

export default function Layout({ children, home }: LayoutProps) {
  return (
    <div className="container">
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="description"
          content="Alex's personal blog - sharing thoughts and experiences"
        />
        <meta name="og:title" content="Alex's Blog" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      
      <header className="header">
        <div className="header-content">
          <Link href="/" className="logo">
            Alex's Blog
          </Link>
          <nav className="nav">
            <Link href="/" className="nav-link">Home</Link>
            <Link href="/archive" className="nav-link">Archive</Link>
            <Link href="/about" className="nav-link">About</Link>
          </nav>
        </div>
      </header>

      <main className="main">{children}</main>

      {!home && (
        <div className="back-to-home">
          <Link href="/">← Back to Home</Link>
        </div>
      )}

      <footer className="footer">
        <p>&copy; 2024 Alex's Blog. All rights reserved.</p>
      </footer>

      <style jsx>{`
        .container {
          max-width: 800px;
          margin: 0 auto;
          padding: 0 20px;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        .header {
          border-bottom: 1px solid #eaeaea;
          margin-bottom: 2rem;
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 0;
        }

        .logo {
          font-size: 1.5rem;
          font-weight: bold;
          color: #0070f3;
          text-decoration: none;
        }

        .nav {
          display: flex;
          gap: 1.5rem;
        }

        .nav-link {
          color: #666;
          text-decoration: none;
          transition: color 0.3s;
        }

        .nav-link:hover {
          color: #0070f3;
        }

        .main {
          flex: 1;
        }

        .back-to-home {
          margin: 3rem 0 0;
        }

        .back-to-home a {
          color: #0070f3;
          text-decoration: none;
        }

        .footer {
          border-top: 1px solid #eaeaea;
          margin-top: 3rem;
          padding: 2rem 0;
          text-align: center;
          color: #666;
        }

        @media (max-width: 600px) {
          .header-content {
            flex-direction: column;
            gap: 1rem;
          }
          
          .container {
            padding: 0 15px;
          }
        }
      `}</style>
    </div>
  )
}
