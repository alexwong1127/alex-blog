import { useState } from 'react'

interface PasswordLoginProps {
  onSuccess: () => void
}

export default function PasswordLogin({ onSuccess }: PasswordLoginProps) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    // 验证密码
    if (password === '2114') {
      // 保存登录状态到localStorage
      localStorage.setItem('suno_auth', 'true')
      onSuccess()
    } else {
      setError('密码错误，请重新输入')
    }
    
    setIsLoading(false)
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1 className="login-title">🔐 访问验证</h1>
          <p className="login-subtitle">请输入访问密码</p>
        </div>
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="请输入密码"
              className="password-input"
              autoFocus
              disabled={isLoading}
            />
          </div>
          
          {error && (
            <div className="error-message">
              ❌ {error}
            </div>
          )}
          
          <button
            type="submit"
            disabled={isLoading || !password}
            className="login-btn btn btn-primary"
          >
            {isLoading ? '验证中...' : '🔓 访问网站'}
          </button>
        </form>
        
        <div className="login-footer">
          <p>Alex的个人博客 - 私密访问</p>
        </div>
      </div>

      <style jsx>{`
        .login-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #0f1419 0%, #1a202c 100%);
          padding: 2rem;
        }

        .login-card {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          padding: 3rem;
          max-width: 400px;
          width: 100%;
          backdrop-filter: blur(10px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        }

        .login-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .login-title {
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .login-subtitle {
          color: rgba(255, 255, 255, 0.7);
          font-size: 1rem;
        }

        .login-form {
          margin-bottom: 2rem;
        }

        .input-group {
          margin-bottom: 1rem;
        }

        .password-input {
          width: 100%;
          padding: 1rem;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.05);
          color: white;
          font-size: 1rem;
          transition: all 0.3s ease;
        }

        .password-input:focus {
          outline: none;
          border-color: #8b5cf6;
          background: rgba(255, 255, 255, 0.1);
        }

        .password-input::placeholder {
          color: rgba(255, 255, 255, 0.5);
        }

        .error-message {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
          border-radius: 8px;
          padding: 0.75rem;
          color: #ef4444;
          font-size: 0.9rem;
          margin-bottom: 1rem;
        }

        .login-btn {
          width: 100%;
          padding: 1rem;
          font-size: 1rem;
          font-weight: 600;
        }

        .login-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .login-footer {
          text-align: center;
          color: rgba(255, 255, 255, 0.5);
          font-size: 0.85rem;
        }

        @media (max-width: 480px) {
          .login-container {
            padding: 1rem;
          }
          
          .login-card {
            padding: 2rem;
          }
          
          .login-title {
            font-size: 1.75rem;
          }
        }
      `}</style>
    </div>
  )
}