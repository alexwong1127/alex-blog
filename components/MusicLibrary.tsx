import { useState } from 'react'
import { MusicTrack } from '@/types'
import { formatDuration, deleteTrack } from '@/lib/storage'

interface MusicLibraryProps {
  tracks: MusicTrack[]
  onRefresh: () => void
}

export default function MusicLibrary({ tracks, onRefresh }: MusicLibraryProps) {
  const [expandedTrack, setExpandedTrack] = useState<string | null>(null)

  const handleRefreshStatus = (trackId: string) => {
    // 这里可以添加刷新单个音乐状态的逻辑
    onRefresh()
  }

  const handlePlay = (track: MusicTrack) => {
    if (track.fileUrl) {
      // 创建音频元素并播放
      const audio = new Audio(track.fileUrl)
      audio.play().catch(err => {
        console.error('播放失败:', err)
        alert('播放失败，请稍后重试')
      })
    } else {
      alert('音频文件还未生成完毕，请稍后再试')
    }
  }

  const handleDownload = (track: MusicTrack) => {
    if (track.fileUrl) {
      // 创建下载链接
      const link = document.createElement('a')
      link.href = track.fileUrl
      link.download = `${track.title || 'AI音乐'}.mp3`
      link.target = '_blank'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } else {
      alert('音频文件还未生成完毕，请稍后再试')
    }
  }

  const handleDelete = (track: MusicTrack) => {
    if (confirm(`确定要删除音乐 "${track.title || '未命名音乐'}" 吗？`)) {
      deleteTrack(track.id)
      onRefresh() // 刷新列表
    }
  }

  const toggleExpanded = (trackId: string) => {
    setExpandedTrack(expandedTrack === trackId ? null : trackId)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusColor = (track: MusicTrack) => {
    if (track.error) return '#ef4444' // 红色 - 失败
    if (track.isGenerating) return '#fbbf24' // 黄色 - 生成中
    if (track.fileUrl) return '#10b981' // 绿色 - 完成
    return '#6b7280' // 灰色 - 未知状态
  }

  const getStatusText = (track: MusicTrack) => {
    if (track.error) return '生成失败'
    if (track.isGenerating) {
      if (track.progress && track.progress > 0) {
        return `生成中 ${track.progress}%`
      }
      return '生成中...'
    }
    if (track.fileUrl) return '已完成'
    return '等待中'
  }

  return (
    <div className="music-library">
      <div className="library-header">
        <div className="header-content">
          <h2 className="library-title">📚 我的音乐库</h2>
          <p className="library-subtitle">您创作的音乐作品 ({tracks.length}首)</p>
        </div>
        <button className="refresh-btn btn btn-outline" onClick={onRefresh}>
          🔄 刷新状态
        </button>
      </div>

      {tracks.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🎵</div>
          <h3>还没有音乐作品</h3>
          <p>开始创作您的第一首AI音乐吧！</p>
        </div>
      ) : (
        <div className="tracks-list">
          {tracks.map((track) => (
            <div key={track.id} className="track-card card card-hover">
              <div className="track-header" onClick={() => toggleExpanded(track.id)}>
                <div className="track-info">
                  <div className="track-title-row">
                    <h3 className="track-title">
                      {track.title || `AI生成音乐 - ${track.prompt.substring(0, 30)}...`}
                    </h3>
                    <div 
                      className="track-status"
                      style={{ backgroundColor: getStatusColor(track) }}
                    >
                      {getStatusText(track)}
                    </div>
                  </div>
                  
                  <div className="track-meta">
                    <span className="track-mode">模式: {track.mode === 'inspiration' ? '灵感模式' : track.mode === 'custom' ? '定制模式' : '续写模式'}</span>
                    <span className="track-style">
                      风格: {track.style === 'instrumental' ? '纯音乐' : track.style || '未指定'}
                    </span>
                    <span className="track-duration">时长: {formatDuration(track.duration)}</span>
                  </div>

                  <div className="track-details">
                    <span className="track-id">任务ID: {track.taskId || track.id}</span>
                    <span className="track-date">创建时间: {formatDate(track.createdAt)}</span>
                  </div>

                  {/* 进度条 */}
                  {track.isGenerating && track.progress !== undefined && (
                    <div className="progress-container">
                      <div className="progress-bar">
                        <div 
                          className="progress-fill" 
                          style={{ width: `${Math.min(track.progress, 100)}%` }}
                        />
                      </div>
                      <span className="progress-text">{track.progress}%</span>
                    </div>
                  )}

                  {/* 错误信息 */}
                  {track.error && (
                    <div className="error-message">
                      <span className="error-icon">⚠️</span>
                      <span className="error-text">{track.error}</span>
                    </div>
                  )}
                </div>

                <div className="expand-icon">
                  {expandedTrack === track.id ? '▲' : '▼'}
                </div>
              </div>

              {expandedTrack === track.id && (
                <div className="track-expanded">
                  <div className="track-prompt">
                    <strong>创作描述：</strong>
                    <p>{track.prompt}</p>
                  </div>

                  <div className="track-actions">
                    {track.isGenerating ? (
                      <button 
                        className="action-btn btn btn-secondary"
                        onClick={() => handleRefreshStatus(track.id)}
                      >
                        🔄 刷新状态
                      </button>
                    ) : track.fileUrl ? (
                      <>
                        <button 
                          className="action-btn btn btn-primary"
                          onClick={() => handlePlay(track)}
                        >
                          ▶️ 播放音乐
                        </button>
                        <button 
                          className="action-btn btn btn-secondary"
                          onClick={() => handleDownload(track)}
                        >
                          ⬇️ 下载音频
                        </button>
                        <button 
                          className="action-btn btn btn-danger"
                          onClick={() => handleDelete(track)}
                        >
                          🗑️ 删除
                        </button>
                      </>
                    ) : (
                      <div className="error-state">
                        <p>生成失败，请重新尝试</p>
                        <button 
                          className="action-btn btn btn-danger"
                          onClick={() => handleDelete(track)}
                        >
                          🗑️ 删除
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        .music-library {
          max-width: 800px;
          margin: 0 auto;
          padding: 2rem;
        }

        .library-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 2rem;
          gap: 1rem;
        }

        .header-content {
          flex: 1;
        }

        .library-title {
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }

        .library-subtitle {
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.9rem;
        }

        .refresh-btn {
          white-space: nowrap;
        }

        .empty-state {
          text-align: center;
          padding: 4rem 2rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
        }

        .empty-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
        }

        .empty-state h3 {
          font-size: 1.5rem;
          margin-bottom: 0.5rem;
        }

        .empty-state p {
          color: rgba(255, 255, 255, 0.7);
        }

        .tracks-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .track-card {
          padding: 1.5rem;
          cursor: pointer;
        }

        .track-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 1rem;
        }

        .track-info {
          flex: 1;
        }

        .track-title-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 0.75rem;
          gap: 1rem;
        }

        .track-title {
          font-size: 1.1rem;
          font-weight: 600;
          line-height: 1.4;
        }

        .track-status {
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.8rem;
          font-weight: 500;
          color: white;
          white-space: nowrap;
        }

        .track-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          margin-bottom: 0.5rem;
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.8);
        }

        .track-details {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.6);
          font-family: monospace;
        }

        .expand-icon {
          color: rgba(255, 255, 255, 0.5);
          font-size: 0.8rem;
        }

        .track-expanded {
          margin-top: 1.5rem;
          padding-top: 1.5rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .track-prompt {
          margin-bottom: 1.5rem;
        }

        .track-prompt strong {
          color: rgba(255, 255, 255, 0.9);
          font-size: 0.9rem;
        }

        .track-prompt p {
          margin-top: 0.5rem;
          color: rgba(255, 255, 255, 0.8);
          line-height: 1.6;
          padding: 1rem;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 8px;
        }

        .track-actions {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .action-btn {
          flex: 1;
          min-width: 140px;
        }

        .progress-container {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-top: 0.75rem;
        }

        .progress-bar {
          flex: 1;
          height: 6px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #fbbf24 0%, #f59e0b 100%);
          border-radius: 3px;
          transition: width 0.3s ease;
        }

        .progress-text {
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.8);
          font-weight: 500;
          min-width: 3rem;
          text-align: right;
        }

        .error-message {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-top: 0.75rem;
          padding: 0.5rem 0.75rem;
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
          border-radius: 8px;
        }

        .error-icon {
          font-size: 0.9rem;
        }

        .error-text {
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.9);
          line-height: 1.4;
        }

        .error-state {
          width: 100%;
          text-align: center;
          padding: 1rem;
          color: rgba(255, 255, 255, 0.7);
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
          border-radius: 8px;
        }

        @media (max-width: 768px) {
          .music-library {
            padding: 1rem;
          }

          .library-header {
            flex-direction: column;
            align-items: stretch;
          }

          .track-title-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }

          .track-meta {
            flex-direction: column;
            gap: 0.5rem;
          }

          .track-details {
            font-size: 0.75rem;
          }

          .track-actions {
            flex-direction: column;
          }

          .action-btn {
            min-width: auto;
          }
        }
      `}</style>
    </div>
  )
}
