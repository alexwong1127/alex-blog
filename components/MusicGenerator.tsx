import { useState } from 'react'
import { MusicMode, MusicStyle, GenerationParams } from '@/types'

interface MusicGeneratorProps {
  onGenerate: (params: GenerationParams) => void
  isGenerating: boolean
}

const musicModes = [
  { id: 'inspiration' as MusicMode, name: '灵感模式', description: '快速生成创意音乐' },
  { id: 'custom' as MusicMode, name: '定制模式', description: '详细定制音乐参数' },
  { id: 'continuation' as MusicMode, name: '续写模式', description: '基于现有音乐续写' }
]

const musicStyles: { id: MusicStyle; name: string }[] = [
  { id: 'pop', name: '流行' },
  { id: 'rock', name: '摇滚' },
  { id: 'jazz', name: '爵士' },
  { id: 'electronic', name: '电子' },
  { id: 'classical', name: '古典' },
  { id: 'hiphop', name: '嘻哈' },
  { id: 'folk', name: '民谣' },
  { id: 'blues', name: '蓝调' },
  { id: 'punk', name: '朋克' },
  { id: 'indie', name: '独立' }
]

const quickPrompts = [
  '欢快的磁性女声歌曲，中文，主题：难忘周末',
  '深情的男声抒情歌曲，英文，主题：思念故乡',
  '节奏感强的电子舞曲，英文，主题：夜晚派对',
  '纯音乐，白噪音，治愈，植物，自然，流水声，自然乐器'
]

export default function MusicGenerator({ onGenerate, isGenerating }: MusicGeneratorProps) {
  const [selectedMode, setSelectedMode] = useState<MusicMode>('inspiration')
  const [prompt, setPrompt] = useState('')
  const [selectedStyle, setSelectedStyle] = useState<MusicStyle>()
  const [duration, setDuration] = useState(120)
  const [makeInstrumental, setMakeInstrumental] = useState(false)

  const handleGenerate = () => {
    if (!prompt.trim()) return

    console.log('🚀 准备生成音乐...')
    console.log('📝 当前输入框内容:', `"${prompt}"`)
    console.log('🎵 选择的模式:', selectedMode)
    console.log('🎼 纯音乐选项:', makeInstrumental)

    const params: GenerationParams = {
      mode: selectedMode,
      prompt: prompt.trim(),
      style: selectedStyle,
      duration,
      make_instrumental: selectedMode === 'inspiration' ? makeInstrumental : undefined
    }

    console.log('📦 生成参数:', params)

    onGenerate(params)
  }

  const handleQuickPrompt = (quickPrompt: string) => {
    console.log('🎯 点击快速提示:', quickPrompt)
    console.log('🔄 设置前的prompt值:', prompt)
    setPrompt(quickPrompt)
    console.log('✅ 快速提示已设置到输入框')
  }

  return (
    <div className="music-generator">
      {/* Header */}
      <div className="header">
        <h1 className="title">SUNO AI音乐生成</h1>
        <p className="subtitle">使用先进的AI技术生成高质量音乐，支持多种创作模式</p>
      </div>

      {/* Features */}
      <div className="features">
        <div className="feature">
          <div className="feature-icon">🎵</div>
          <div className="feature-content">
            <h3>多种创作模式</h3>
            <p>灵感、定制、续写三种模式</p>
          </div>
        </div>
        <div className="feature">
          <div className="feature-icon">👥</div>
          <div className="feature-content">
            <h3>专业品质</h3>
            <p>商用级音质，多种音乐风格</p>
          </div>
        </div>
        <div className="feature">
          <div className="feature-icon">⏱️</div>
          <div className="feature-content">
            <h3>快速生成</h3>
            <p>通常2-5分钟完成音乐创作</p>
          </div>
        </div>
      </div>

      {/* Mode Selection */}
      <div className="mode-section">
        <h2 className="section-title">🎵 音乐生成</h2>
        <p className="section-subtitle">选择创作模式开始生成您的专属音乐</p>
        
        <div className="mode-tabs">
          {musicModes.map((mode) => (
            <button
              key={mode.id}
              className={`mode-tab ${selectedMode === mode.id ? 'active' : ''}`}
              onClick={() => setSelectedMode(mode.id)}
            >
              {mode.name}
            </button>
          ))}
        </div>
      </div>

      {/* Input Section */}
      <div className="input-section">
        <div className="input-group">
          <label className="input-label">描述您想要的音乐风格</label>
          <textarea
            className="input textarea"
            placeholder="例如：欢快的磁性女声歌曲，中文，主题：难忘周末"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={3}
          />
        </div>

        {/* Quick Prompts */}
        <div className="quick-prompts">
          <p className="quick-prompts-title">快速选择示例</p>
          <div className="quick-prompts-list">
            {quickPrompts.map((quickPrompt, index) => (
              <button
                key={index}
                className="quick-prompt-btn"
                onClick={() => handleQuickPrompt(quickPrompt)}
              >
                {quickPrompt}
              </button>
            ))}
          </div>
        </div>

        {/* Instrumental option for inspiration mode */}
        {selectedMode === 'inspiration' && (
          <div className="instrumental-option">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={makeInstrumental}
                onChange={(e) => setMakeInstrumental(e.target.checked)}
                className="checkbox"
              />
              <span className="checkbox-text">
                🎼 生成纯音乐（无歌词）
              </span>
            </label>
            <p className="option-description">
              {makeInstrumental ? 
                '将生成不含歌词的纯音乐作品，适合背景音乐或器乐欣赏' : 
                '将生成包含歌词的完整歌曲，适合完整音乐体验'
              }
            </p>
          </div>
        )}

        {/* Style and Duration (for custom mode) */}
        {selectedMode === 'custom' && (
          <div className="custom-options">
            <div className="input-group">
              <label className="input-label">音乐风格</label>
              <div className="style-grid">
                {musicStyles.map((style) => (
                  <button
                    key={style.id}
                    className={`style-btn ${selectedStyle === style.id ? 'active' : ''}`}
                    onClick={() => setSelectedStyle(style.id)}
                  >
                    {style.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">时长: {duration}秒</label>
              <input
                type="range"
                min="30"
                max="300"
                step="10"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="duration-slider"
              />
            </div>
          </div>
        )}

        {/* Generate Button */}
        <button
          className="generate-btn btn btn-primary"
          onClick={handleGenerate}
          disabled={!prompt.trim() || isGenerating}
        >
          {isGenerating ? (
            <>
              <div className="spinner" />
              生成中...
            </>
          ) : (
            <>
              🎵 生成音乐
            </>
          )}
        </button>
      </div>

      <style jsx>{`
        .music-generator {
          max-width: 800px;
          margin: 0 auto;
          padding: 2rem;
        }

        .header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .title {
          font-size: 2.5rem;
          font-weight: bold;
          margin-bottom: 1rem;
          background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .subtitle {
          font-size: 1.1rem;
          color: rgba(255, 255, 255, 0.7);
          line-height: 1.6;
        }

        .features {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-bottom: 3rem;
        }

        .feature {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.5rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          backdrop-filter: blur(10px);
        }

        .feature-icon {
          font-size: 2rem;
          min-width: 3rem;
          text-align: center;
        }

        .feature-content h3 {
          font-size: 1.1rem;
          font-weight: 600;
          margin-bottom: 0.25rem;
        }

        .feature-content p {
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.7);
        }

        .mode-section {
          margin-bottom: 2rem;
        }

        .section-title {
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }

        .section-subtitle {
          color: rgba(255, 255, 255, 0.7);
          margin-bottom: 1.5rem;
        }

        .mode-tabs {
          display: flex;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .mode-tab {
          flex: 1;
          padding: 0.75rem 1rem;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.05);
          color: white;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .mode-tab:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .mode-tab.active {
          background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%);
          border-color: transparent;
        }

        .input-section {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 2rem;
          backdrop-filter: blur(10px);
        }

        .input-group {
          margin-bottom: 1.5rem;
        }

        .input-label {
          display: block;
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: white;
        }

        .textarea {
          min-height: 80px;
          resize: vertical;
        }

        .quick-prompts {
          margin-bottom: 1.5rem;
        }

        .quick-prompts-title {
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.7);
          margin-bottom: 0.75rem;
        }

        .quick-prompts-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .quick-prompt-btn {
          padding: 0.75rem 1rem;
          text-align: left;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          color: rgba(255, 255, 255, 0.8);
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .quick-prompt-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          color: white;
        }

        .instrumental-option {
          margin-bottom: 1.5rem;
          padding: 1rem;
          background: rgba(139, 92, 246, 0.1);
          border: 1px solid rgba(139, 92, 246, 0.3);
          border-radius: 12px;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          cursor: pointer;
          margin-bottom: 0.5rem;
        }

        .checkbox {
          width: 18px;
          height: 18px;
          accent-color: #8b5cf6;
          cursor: pointer;
        }

        .checkbox-text {
          font-size: 1rem;
          font-weight: 500;
          color: white;
        }

        .option-description {
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.7);
          line-height: 1.4;
          margin-left: 2.25rem;
        }

        .custom-options {
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          padding-top: 1.5rem;
          margin-top: 1.5rem;
        }

        .style-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
          gap: 0.5rem;
        }

        .style-btn {
          padding: 0.5rem 0.75rem;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.05);
          color: white;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .style-btn:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .style-btn.active {
          background: #8b5cf6;
          border-color: #8b5cf6;
        }

        .duration-slider {
          width: 100%;
          height: 6px;
          border-radius: 3px;
          background: rgba(255, 255, 255, 0.2);
          outline: none;
          -webkit-appearance: none;
        }

        .duration-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #8b5cf6;
          cursor: pointer;
        }

        .generate-btn {
          width: 100%;
          font-size: 1rem;
          padding: 1rem;
          margin-top: 1rem;
        }

        .generate-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid transparent;
          border-top: 2px solid currentColor;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 768px) {
          .music-generator {
            padding: 1rem;
          }

          .title {
            font-size: 2rem;
          }

          .features {
            grid-template-columns: 1fr;
          }

          .feature {
            flex-direction: column;
            text-align: center;
          }

          .mode-tabs {
            flex-direction: column;
          }

          .style-grid {
            grid-template-columns: repeat(auto-fill, minmax(70px, 1fr));
          }
        }
      `}</style>
    </div>
  )
}
