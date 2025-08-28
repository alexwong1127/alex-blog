import { useState, useEffect } from 'react'
import Layout from '@/components/Layout'
import MusicGenerator from '@/components/MusicGenerator'
import MusicLibrary from '@/components/MusicLibrary'
import PasswordLogin from '@/components/PasswordLogin'
import { MusicTrack, GenerationParams } from '@/types'
import { getAllTracks, addTrack, updateTrack, generateId, generateMusic, checkMusicStatus } from '@/lib/storage'
import Link from 'next/link'

export default function Home() {
  const [tracks, setTracks] = useState<MusicTrack[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [currentView, setCurrentView] = useState<'generator' | 'library'>('generator')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)

  // 检查认证状态
  useEffect(() => {
    const checkAuth = () => {
      const authStatus = localStorage.getItem('suno_auth')
      setIsAuthenticated(authStatus === 'true')
      setIsCheckingAuth(false)
    }
    
    checkAuth()
  }, [])

  // 处理登录成功
  const handleAuthSuccess = () => {
    setIsAuthenticated(true)
    setTracks(getAllTracks()) // 登录成功后加载数据
  }

  // 处理退出登录
  const handleLogout = () => {
    localStorage.removeItem('suno_auth')
    setIsAuthenticated(false)
    setTracks([])
  }

  // 如果还在检查认证状态，显示加载画面
  if (isCheckingAuth) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0f1419 0%, #1a202c 100%)',
        color: 'white'
      }}>
        <div>Loading...</div>
      </div>
    )
  }

  // 如果未认证，显示登录界面
  if (!isAuthenticated) {
    return <PasswordLogin onSuccess={handleAuthSuccess} />
  }

  // 生成音乐
  const handleGenerate = async (params: GenerationParams) => {
    setIsGenerating(true)
    
    // 创建新的音乐作品记录
    const newTrack: MusicTrack = {
      id: generateId(),
      title: '',
      description: params.prompt,
      style: params.style || 'pop',
      mode: params.mode,
      duration: params.duration || 120,
      prompt: params.prompt,
      createdAt: new Date().toISOString(),
      isGenerating: true,
      progress: 0
    }

    // 添加到列表并保存
    addTrack(newTrack)
    setTracks(getAllTracks())
    setCurrentView('library')

    try {
      // 调用SUNO音乐生成API
      const result = await generateMusic({
        prompt: params.prompt,
        style: params.style,
        duration: params.duration,
        mode: params.mode,
        title: params.title
      })

      if (result.success && result.taskId) {
        // 更新任务ID
        updateTrack(newTrack.id, {
          taskId: result.taskId,
          progress: 10
        })
        setTracks(getAllTracks())

        // 开始轮询状态
        startStatusPolling(newTrack.id, result.taskId)
      } else {
        // 生成失败
        updateTrack(newTrack.id, {
          isGenerating: false,
          error: result.error || '音乐生成失败'
        })
        setTracks(getAllTracks())
      }
    } catch (error: any) {
      console.error('Music generation failed:', error)
      updateTrack(newTrack.id, {
        isGenerating: false,
        error: '网络错误：' + error.message
      })
      setTracks(getAllTracks())
    } finally {
      setIsGenerating(false)
    }
  }

  // 轮询音乐生成状态
  const startStatusPolling = async (trackId: string, taskId: string) => {
    const maxAttempts = 60 // 最多查询60次（约10分钟）
    let attempts = 0

    const poll = async () => {
      attempts++
      
      try {
        const status = await checkMusicStatus(taskId)
        
        if (status.success) {
          const updates: Partial<MusicTrack> = {
            progress: status.progress || 50
          }

          switch (status.status) {
            case 'completed':
              updates.isGenerating = false
              updates.fileUrl = status.audioUrl
              updates.coverUrl = status.coverUrl
              updates.title = status.title || `AI生成音乐 - ${new Date().toLocaleString()}`
              updates.duration = status.duration || 120
              updates.progress = 100
              break
            
            case 'failed':
              updates.isGenerating = false
              updates.error = status.error || '生成失败'
              break
            
            case 'processing':
            case 'submitted':
              // 继续轮询
              if (attempts < maxAttempts) {
                setTimeout(poll, 10000) // 10秒后再次查询
              } else {
                updates.isGenerating = false
                updates.error = '生成超时，请重试'
              }
              break
          }

          updateTrack(trackId, updates)
          setTracks(getAllTracks())
        } else {
          // 状态查询失败
          if (attempts < maxAttempts) {
            setTimeout(poll, 15000) // 15秒后重试
          } else {
            updateTrack(trackId, {
              isGenerating: false,
              error: '状态查询失败：' + (status.error || '未知错误')
            })
            setTracks(getAllTracks())
          }
        }
      } catch (error: any) {
        console.error('Status polling error:', error)
        if (attempts < maxAttempts) {
          setTimeout(poll, 15000) // 网络错误，15秒后重试
        } else {
          updateTrack(trackId, {
            isGenerating: false,
            error: '状态查询网络错误'
          })
          setTracks(getAllTracks())
        }
      }
    }

    // 5秒后开始第一次状态查询
    setTimeout(poll, 5000)
  }

  // 刷新音乐库
  const handleRefresh = () => {
    setTracks(getAllTracks())
  }

  return (
    <Layout>
      <div className="app">
        {/* Hero Section */}
        <section className="hero">
          <div className="container">
            <h1 className="hero-title">Alex的个人博客</h1>
            <p className="hero-subtitle">
              欢迎来到我的数字花园 🌱 分享技术、生活与思考
            </p>
            <div className="hero-actions">
              <Link href="/suno" className="btn btn-primary">
                🎵 SUNO音乐生成
              </Link>
              <button
                className="btn btn-secondary"
                onClick={() => setCurrentView(currentView === 'generator' ? 'library' : 'generator')}
              >
                {currentView === 'generator' ? '📚 查看音乐库' : '🎵 音乐生成'}
              </button>
            </div>
          </div>
        </section>

        {/* Navigation */}
        <nav className="nav-tabs">
          <button
            className={`nav-tab ${currentView === 'generator' ? 'active' : ''}`}
            onClick={() => setCurrentView('generator')}
          >
            🎵 音乐生成
          </button>
          <button
            className={`nav-tab ${currentView === 'library' ? 'active' : ''}`}
            onClick={() => setCurrentView('library')}
          >
            📚 我的音乐库
            {tracks.length > 0 && (
              <span className="badge">{tracks.length}</span>
            )}
          </button>
          <Link href="/suno" className="nav-tab">
            ✨ SUNO专业版
          </Link>
          <button
            className="nav-tab logout-btn"
            onClick={handleLogout}
            title="退出登录"
          >
            🚪 退出
          </button>
        </nav>

        {/* Content */}
        <main className="content">
          {currentView === 'generator' ? (
            <MusicGenerator onGenerate={handleGenerate} isGenerating={isGenerating} />
          ) : (
            <MusicLibrary tracks={tracks} onRefresh={handleRefresh} />
          )}
        </main>
      </div>

      <style jsx>{`
        .app {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        .hero {
          padding: 4rem 0;
          text-align: center;
          background: rgba(255, 255, 255, 0.02);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .hero-title {
          font-size: 3rem;
          font-weight: 700;
          margin-bottom: 1rem;
          background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-subtitle {
          font-size: 1.2rem;
          color: rgba(255, 255, 255, 0.7);
          margin-bottom: 2rem;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }

        .hero-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .nav-tabs {
          position: sticky;
          top: 0;
          z-index: 100;
          display: flex;
          background: rgba(15, 20, 25, 0.95);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          padding: 0;
          margin: 0;
        }

        .nav-tab {
          flex: 1;
          padding: 1rem 2rem;
          border: none;
          background: transparent;
          color: rgba(255, 255, 255, 0.7);
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          text-decoration: none;
        }

        .nav-tab.logout-btn {
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
          border-left: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .nav-tab.logout-btn:hover {
          background: rgba(239, 68, 68, 0.2);
          color: white;
        }
        
        .nav-tab:hover {
          color: white;
          background: rgba(255, 255, 255, 0.05);
        }

        .nav-tab.active {
          color: white;
          background: rgba(139, 92, 246, 0.2);
          border-bottom: 2px solid #8b5cf6;
        }

        .badge {
          background: #8b5cf6;
          color: white;
          font-size: 0.7rem;
          padding: 0.2rem 0.5rem;
          border-radius: 10px;
          min-width: 20px;
          text-align: center;
        }

        .content {
          flex: 1;
          padding: 0;
        }

        @media (max-width: 768px) {
          .hero-title {
            font-size: 2.5rem;
          }
          
          .hero-subtitle {
            font-size: 1rem;
          }
          
          .hero-actions {
            flex-direction: column;
            align-items: center;
          }
          
          .nav-tab {
            padding: 0.75rem 1rem;
            font-size: 0.9rem;
          }
          
          .nav-tabs {
            flex-wrap: wrap;
          }
        }
      `}</style>
    </Layout>
  )
}
