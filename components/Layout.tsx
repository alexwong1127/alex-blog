import Head from 'next/head'
import { ReactNode } from 'react'

interface LayoutProps {
  children: ReactNode
  title?: string
  description?: string
}

export default function Layout({ 
  children, 
  title = 'SUNO AI音乐生成',
  description = '使用先进的AI技术生成高质量音乐，支持多种创作模式'
}: LayoutProps) {
  return (
    <div className="layout">
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      
      <main className="main">
        {children}
      </main>

      <style jsx>{`
        .layout {
          min-height: 100vh;
          background: linear-gradient(135deg, #0f1419 0%, #1a202c 100%);
        }

        .main {
          min-height: 100vh;
          padding: 0;
        }
      `}</style>
    </div>
  )
}
