import { useState, useEffect } from 'react'
import Link from 'next/link'
import PasswordLogin from '@/components/PasswordLogin'

// 临时的UI组件，之后会替换为shadcn/ui组件
const Button = ({ children, onClick, disabled, className, variant, size }: any) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`px-4 py-2 rounded-md font-medium transition-colors ${
      disabled ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-80'
    } ${
      variant === 'outline' ? 'border border-gray-300' : 'bg-blue-600 text-white'
    } ${className || ''}`}
  >
    {children}
  </button>
)

const Input = ({ placeholder, value, onChange, className, type = 'text' }: any) => (
  <input
    type={type}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${className || ''}`}
  />
)

const Textarea = ({ placeholder, value, onChange, rows = 3, className }: any) => (
  <textarea
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    rows={rows}
    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${className || ''}`}
  />
)

const Card = ({ children, className }: any) => (
  <div className={`border border-gray-200 rounded-lg shadow-sm ${className || ''}`}>
    {children}
  </div>
)

const CardHeader = ({ children }: any) => (
  <div className="px-6 py-4 border-b border-gray-200">
    {children}
  </div>
)

const CardContent = ({ children }: any) => (
  <div className="px-6 py-4">
    {children}
  </div>
)

const CardTitle = ({ children, className }: any) => (
  <h3 className={`text-lg font-semibold ${className || ''}`}>
    {children}
  </h3>
)

const CardDescription = ({ children, className }: any) => (
  <p className={`text-sm text-gray-600 ${className || ''}`}>
    {children}
  </p>
)

const Select = ({ value, onValueChange, children }: any) => (
  <select
    value={value}
    onChange={(e) => onValueChange(e.target.value)}
    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
  >
    {children}
  </select>
)

const SelectItem = ({ value, children }: any) => (
  <option value={value}>{children}</option>
)

const Tabs = ({ value, onValueChange, children }: any) => (
  <div>
    {children}
  </div>
)

const TabsList = ({ children, className }: any) => (
  <div className={`flex border-b border-gray-200 ${className || ''}`}>
    {children}
  </div>
)

const TabsTrigger = ({ value, children, onClick }: any) => (
  <button
    onClick={() => onClick && onClick(value)}
    className="px-4 py-2 border-b-2 border-transparent hover:border-blue-500 focus:outline-none"
  >
    {children}
  </button>
)

const TabsContent = ({ value, children, className }: any) => (
  <div className={`pt-4 ${className || ''}`}>
    {children}
  </div>
)

// 音乐类型定义
interface Music {
  id: string
  user_id: string
  project_id: string | null
  task_id: string
  mode: 'inspiration' | 'custom' | 'continue'
  title: string
  prompt: string
  tags: string
  mv_version: string
  gpt_description_prompt?: string | null
  continue_clip_id?: string | null
  continue_at?: number | null
  status: 'processing' | 'completed' | 'failed'
  audio_url?: string | null
  video_url?: string | null
  image_url?: string | null
  duration?: number | null
  error_message?: string | null
  created_at: string
  updated_at: string
}

export default function SUNOPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const [activeMode, setActiveMode] = useState<'inspiration' | 'custom' | 'continue'>('custom')

  // 检查认证状态
  useEffect(() => {
    const authStatus = localStorage.getItem('suno_auth')
    setIsAuthenticated(authStatus === 'true')
    setIsCheckingAuth(false)
  }, [])

  // 处理登录成功
  const handleAuthSuccess = () => {
    setIsAuthenticated(true)
  }

  // 处理退出登录
  const handleLogout = () => {
    localStorage.removeItem('suno_auth')
    setIsAuthenticated(false)
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
  
  // 灵感模式状态
  const [inspirationPrompt, setInspirationPrompt] = useState('')
  
  // 定制模式状态
  const [customPrompt, setCustomPrompt] = useState('')
  const [customTags, setCustomTags] = useState('')
  const [customTitle, setCustomTitle] = useState('')
  const [mvVersion, setMvVersion] = useState('chirp-v3-0')
  
  // 续写模式状态
  const [continuePrompt, setContinuePrompt] = useState('')
  const [continueTags, setContinueTags] = useState('')
  const [continueTitle, setContinueTitle] = useState('')
  const [continueTaskId, setContinueTaskId] = useState('')
  const [continueClipId, setContinueClipId] = useState('')
  const [continueAt, setContinueAt] = useState(80)
  
  // 生成状态
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationResult, setGenerationResult] = useState<{
    task_id: string
    title: string
    status: string
  } | null>(null)
  
  // 音乐库状态
  const [musicList, setMusicList] = useState<Music[]>([])
  const [isLoadingMusic, setIsLoadingMusic] = useState(false)

  const userId = 'demo-user' // 临时用户ID

  // 加载音乐列表
  const loadMusicList = async () => {
    setIsLoadingMusic(true)
    try {
      console.log('🔄 开始加载音乐列表...')
      // 从localStorage加载音乐列表
      const storedMusic = localStorage.getItem('demo-music')
      if (storedMusic) {
        const music = JSON.parse(storedMusic).filter((m: Music) => m.user_id === userId)
        setMusicList(music || [])
        console.log('🎵 加载音乐列表:', music.length, '首')
      } else {
        setMusicList([])
      }
    } catch (error) {
      console.error('❌ 加载音乐列表失败:', error)
      setMusicList([])
    } finally {
      setIsLoadingMusic(false)
    }
  }

  useEffect(() => {
    loadMusicList()
  }, [])

  // 刷新音乐状态
  const refreshMusicStatus = async (music: Music) => {
    try {
      const response = await fetch('/api/suno/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task_id: music.task_id,
          music_id: music.id
        })
      })
      
      const data = await response.json()
      
      if (data.success) {
        // 更新本地状态
        setMusicList(prev => prev.map(m => 
          m.id === music.id 
            ? { 
                ...m, 
                status: data.status === 'completed' ? 'completed' : data.status === 'failed' ? 'failed' : 'processing',
                audio_url: data.audio_url || m.audio_url,
                video_url: data.video_url || m.video_url,
                image_url: data.image_url || m.image_url,
                duration: data.duration || m.duration
              }
            : m
        ))
        
        // 同步更新localStorage
        const updatedMusic = musicList.map(m => 
          m.id === music.id 
            ? { 
                ...m, 
                status: data.status === 'completed' ? 'completed' : data.status === 'failed' ? 'failed' : 'processing',
                audio_url: data.audio_url || m.audio_url,
                video_url: data.video_url || m.video_url,
                image_url: data.image_url || m.image_url,
                duration: data.duration || m.duration
              }
            : m
        )
        localStorage.setItem('demo-music', JSON.stringify(updatedMusic))
        
        alert(data.status === 'completed' ? '音乐已完成！' : '音乐仍在处理中...')
      }
    } catch (error) {
      console.error('刷新状态失败:', error)
      alert('无法获取最新状态')
    }
  }

  // 处理音乐生成
  const handleGenerate = async () => {
    // 验证输入
    if (activeMode === 'inspiration' && !inspirationPrompt.trim()) {
      alert('请输入灵感描述')
      return
    }

    if ((activeMode === 'custom' || activeMode === 'continue') && !customPrompt.trim() && !continuePrompt.trim()) {
      alert('请输入歌词内容')
      return
    }

    if (activeMode === 'continue' && (!continueTaskId.trim() || !continueClipId.trim())) {
      alert('续写模式需要原任务ID和音频片段ID')
      return
    }

    setIsGenerating(true)

    try {
      let requestData: any = {
        mode: activeMode,
        user_id: userId,
        project_id: 'temp-suno-project'
      }

      switch (activeMode) {
        case 'inspiration':
          requestData.gpt_description_prompt = inspirationPrompt
          break
        
        case 'custom':
          requestData.prompt = customPrompt
          requestData.tags = customTags || 'pop'
          requestData.title = customTitle || 'Untitled'
          requestData.mv = mvVersion
          break
        
        case 'continue':
          requestData.prompt = continuePrompt
          requestData.tags = continueTags || 'pop'
          requestData.title = continueTitle || 'Untitled'
          requestData.mv = mvVersion
          requestData.task_id = continueTaskId
          requestData.continue_clip_id = continueClipId
          requestData.continue_at = continueAt
          break
      }

      const response = await fetch('/api/suno', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData)
      })

      const data = await response.json()

      if (data.success) {
        setGenerationResult({
          task_id: data.task_id,
          title: data.data.title,
          status: data.data.status
        })

        // 在前端手动创建音乐记录
        const newMusicRecord = {
          id: `demo-music-${Date.now()}`,
          user_id: userId,
          project_id: null,
          task_id: data.task_id,
          mode: activeMode,
          title: data.data.title,
          prompt: activeMode === 'inspiration' ? inspirationPrompt : (activeMode === 'custom' ? customPrompt : continuePrompt),
          tags: activeMode === 'inspiration' ? '' : (activeMode === 'custom' ? customTags : continueTags),
          mv_version: mvVersion,
          gpt_description_prompt: activeMode === 'inspiration' ? inspirationPrompt : null,
          continue_clip_id: activeMode === 'continue' ? continueClipId : null,
          continue_at: activeMode === 'continue' ? continueAt : null,
          status: 'processing' as const,
          audio_url: null,
          video_url: null,
          image_url: null,
          duration: null,
          error_message: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }

        // 直接添加到前端状态和localStorage
        try {
          const existingMusic = JSON.parse(localStorage.getItem('demo-music') || '[]')
          const updatedMusic = [...existingMusic, newMusicRecord]
          localStorage.setItem('demo-music', JSON.stringify(updatedMusic))
          setMusicList(updatedMusic.filter(m => m.user_id === userId))
        } catch (e) {
          console.error('前端保存音乐记录失败:', e)
        }

        alert('音乐生成请求成功，音乐正在生成中，已保存到您的音乐库')

        // 清空表单
        if (activeMode === 'inspiration') {
          setInspirationPrompt('')
        } else if (activeMode === 'custom') {
          setCustomPrompt('')
          setCustomTags('')
          setCustomTitle('')
        } else {
          setContinuePrompt('')
          setContinueTags('')
          setContinueTitle('')
        }
      } else {
        throw new Error(data.error || '音乐生成失败')
      }
    } catch (error: any) {
      alert(error.message || '音乐生成失败，请重试')
    } finally {
      setIsGenerating(false)
    }
  }

  const musicGenres = [
    'pop', 'rock', 'jazz', 'classical', 'electronic', 'hip-hop', 
    'country', 'folk', 'blues', 'reggae', 'funk', 'soul',
    'metal', 'punk', 'indie', 'alternative', 'ambient', 'house'
  ]

  const examplePrompts = {
    inspiration: [
      '欢快的磁性女声歌曲，中文，主题：难忘周末',
      '深情的男声抒情歌曲，英文，主题：思念故乡',
      '节奏感强的电子舞曲，英文，主题：夜晚派对'
    ],
    custom: [
      {
        title: 'City Lights',
        tags: 'emotional punk',
        prompt: '[Verse]\nWalking down the streets\nBeneath the city lights\nNeon signs flickering\nLighting up the night\nHeart beating faster\nLike a drum in my chest\nI\'m alive in this moment\nFeeling so blessed'
      },
      {
        title: 'Morning Coffee',
        tags: 'jazz smooth',
        prompt: '[Verse]\nSteam rising from my cup\nThe world is waking up\nSoft light through the window\nAnother day to grow'
      }
    ]
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-4 flex gap-2">
            <Link href="/">
              <Button variant="outline">
                ← 返回首页
              </Button>
            </Link>
            <Button 
              variant="outline" 
              onClick={handleLogout}
              className="text-red-600 border-red-300 hover:bg-red-50"
            >
              🚪 退出登录
            </Button>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">SUNO AI音乐生成</h1>
          <p className="text-gray-600">使用先进的AI技术生成高质量音乐，支持多种创作模式</p>
        </div>

        {/* Features Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>SUNO特性介绍</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  🎤
                </div>
                <h3 className="font-semibold mb-2">多种创作模式</h3>
                <p className="text-gray-600 text-sm">灵感、定制、续写三种模式</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  👥
                </div>
                <h3 className="font-semibold mb-2">专业品质</h3>
                <p className="text-gray-600 text-sm">商用级音质，多种音乐风格</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  ⏱️
                </div>
                <h3 className="font-semibold mb-2">快速生成</h3>
                <p className="text-gray-600 text-sm">通常2-5分钟完成音乐创作</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 音乐生成工具 */}
          <Card>
            <CardHeader>
              <CardTitle>🎵 音乐生成</CardTitle>
              <CardDescription>选择创作模式开始生成您的专属音乐</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeMode} onValueChange={setActiveMode}>
                <TabsList className="grid w-full grid-cols-3 mb-6">
                  <TabsTrigger value="inspiration" onClick={() => setActiveMode('inspiration')}>灵感模式</TabsTrigger>
                  <TabsTrigger value="custom" onClick={() => setActiveMode('custom')}>定制模式</TabsTrigger>
                  <TabsTrigger value="continue" onClick={() => setActiveMode('continue')}>续写模式</TabsTrigger>
                </TabsList>

                {/* 灵感模式 */}
                {activeMode === 'inspiration' && (
                  <TabsContent value="inspiration" className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        描述您想要的音乐风格
                      </label>
                      <Textarea
                        placeholder="例如：欢快的磁性女声歌曲，中文，主题：难忘周末"
                        value={inspirationPrompt}
                        onChange={(e: any) => setInspirationPrompt(e.target.value)}
                        rows={3}
                      />
                    </div>
                    
                    {/* 示例 */}
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        快速选择示例
                      </label>
                      <div className="space-y-2">
                        {examplePrompts.inspiration.map((example, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            onClick={() => setInspirationPrompt(example)}
                            className="w-full text-left justify-start"
                          >
                            {example}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                )}

                {/* 定制模式 */}
                {activeMode === 'custom' && (
                  <TabsContent value="custom" className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        歌曲标题
                      </label>
                      <Input
                        placeholder="为您的音乐起个名字"
                        value={customTitle}
                        onChange={(e: any) => setCustomTitle(e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        音乐风格标签
                      </label>
                      <div className="flex gap-2 mb-2">
                        <Input
                          placeholder="例如：pop, rock, jazz"
                          value={customTags}
                          onChange={(e: any) => setCustomTags(e.target.value)}
                        />
                        <Select value={mvVersion} onValueChange={setMvVersion}>
                          <SelectItem value="chirp-v3-0">Chirp v3.0</SelectItem>
                          <SelectItem value="chirp-v3-5">Chirp v3.5</SelectItem>
                        </Select>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {musicGenres.map(genre => (
                          <button
                            key={genre}
                            onClick={() => setCustomTags(genre)}
                            className="px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                          >
                            {genre}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        歌词内容
                      </label>
                      <Textarea
                        placeholder="输入您的歌词内容，可以包含[Verse]、[Chorus]等结构标记"
                        value={customPrompt}
                        onChange={(e: any) => setCustomPrompt(e.target.value)}
                        rows={8}
                      />
                    </div>

                    {/* 示例 */}
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        歌词示例
                      </label>
                      <div className="space-y-2">
                        {examplePrompts.custom.map((example, index) => (
                          <div
                            key={index}
                            className="p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
                            onClick={() => {
                              setCustomTitle(example.title)
                              setCustomTags(example.tags)
                              setCustomPrompt(example.prompt)
                            }}
                          >
                            <div className="font-medium mb-1">{example.title}</div>
                            <div className="text-gray-600 text-sm mb-2">标签: {example.tags}</div>
                            <div className="text-gray-800 text-sm">{example.prompt.substring(0, 100)}...</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                )}

                {/* 续写模式 */}
                {activeMode === 'continue' && (
                  <TabsContent value="continue" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">
                          原任务ID
                        </label>
                        <Input
                          placeholder="原音乐任务的ID"
                          value={continueTaskId}
                          onChange={(e: any) => setContinueTaskId(e.target.value)}
                        />
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">
                          音频片段ID
                        </label>
                        <Input
                          placeholder="要续写的音频片段ID"
                          value={continueClipId}
                          onChange={(e: any) => setContinueClipId(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">
                          续写起始时间（秒）
                        </label>
                        <Input
                          type="number"
                          value={continueAt}
                          onChange={(e: any) => setContinueAt(Number(e.target.value))}
                        />
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">
                          新标题
                        </label>
                        <Input
                          placeholder="续写部分的标题"
                          value={continueTitle}
                          onChange={(e: any) => setContinueTitle(e.target.value)}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        风格标签
                      </label>
                      <Input
                        placeholder="例如：pop, rock, jazz"
                        value={continueTags}
                        onChange={(e: any) => setContinueTags(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        续写歌词
                      </label>
                      <Textarea
                        placeholder="输入要续写的歌词内容"
                        value={continuePrompt}
                        onChange={(e: any) => setContinuePrompt(e.target.value)}
                        rows={6}
                      />
                    </div>
                  </TabsContent>
                )}
              </Tabs>

              {/* 生成按钮 */}
              <div className="pt-4">
                <Button 
                  onClick={handleGenerate} 
                  disabled={isGenerating} 
                  className="w-full bg-purple-600 text-white hover:bg-purple-700"
                >
                  {isGenerating ? '生成中...' : '🎵 生成音乐'}
                </Button>
              </div>

              {/* 生成结果 */}
              {generationResult && (
                <div className="mt-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                  <div className="text-purple-700 font-medium mb-2">✅ 音乐生成请求已提交</div>
                  <div className="text-sm text-gray-700 space-y-1">
                    <div><strong>任务ID:</strong> {generationResult.task_id}</div>
                    <div><strong>标题:</strong> {generationResult.title}</div>
                    <div><strong>状态:</strong> {generationResult.status === 'processing' ? '处理中' : '已完成'}</div>
                  </div>
                  <div className="text-xs text-gray-600 mt-2">
                    💡 音乐生成通常需要2-5分钟，完成后会出现在右侧的音乐库中
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 音乐库 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                🗃️ 我的音乐库
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={loadMusicList}
                  disabled={isLoadingMusic}
                >
                  {isLoadingMusic ? '⟳ 刷新中...' : '🔄 刷新'}
                </Button>
              </CardTitle>
              <CardDescription>
                您创作的音乐作品 {musicList.length > 0 && `(${musicList.length}首)`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingMusic ? (
                <div className="text-center py-8 text-gray-500">
                  加载中...
                </div>
              ) : musicList.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-4xl mb-4">🎵</div>
                  <p>还没有创作的音乐</p>
                  <p className="text-sm">使用左侧的工具生成您的第一首音乐</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {musicList.map((music) => {
                    const statusColor = {
                      'completed': 'text-green-600',
                      'processing': 'text-yellow-600',
                      'failed': 'text-red-600'
                    }[music.status] || 'text-gray-600'
                    
                    const statusText = {
                      'completed': '已完成',
                      'processing': '处理中',
                      'failed': '失败'
                    }[music.status] || music.status
                    
                    return (
                      <div key={music.id} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="text-purple-600">🎵</span>
                              <div className="font-medium">{music.title}</div>
                              <span className={`text-sm px-2 py-1 rounded-full bg-white ${statusColor}`}>
                                {statusText}
                              </span>
                            </div>
                            
                            <div className="text-sm text-gray-600 mb-3">
                              <div className="mb-1"><strong>模式:</strong> {
                                music.mode === 'inspiration' ? '灵感模式' :
                                music.mode === 'custom' ? '定制模式' : '续写模式'
                              }</div>
                              {music.tags && (
                                <div className="mb-1"><strong>风格:</strong> {music.tags}</div>
                              )}
                              <div className="mb-1"><strong>任务ID:</strong> 
                                <code className="text-xs bg-gray-200 px-1 rounded ml-1">{music.task_id}</code>
                              </div>
                              {music.duration && (
                                <div className="mb-1"><strong>时长:</strong> {Math.floor(music.duration / 60)}:{(music.duration % 60).toString().padStart(2, '0')}</div>
                              )}
                              <div className="text-xs text-gray-500">
                                创建时间: {new Date(music.created_at).toLocaleString('zh-CN')}
                              </div>
                            </div>
                            
                            <div className="flex gap-2 flex-wrap">
                              {music.audio_url && (
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => window.open(music.audio_url!, '_blank')}
                                  className="border-green-500 text-green-600"
                                >
                                  ▶️ 播放音乐
                                </Button>
                              )}

                              {music.status === 'completed' && music.task_id && (
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={async () => {
                                    try {
                                      // 首先刷新状态获取最新的clip_id
                                      const statusResponse = await fetch('/api/suno/status', {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ task_id: music.task_id })
                                      })
                                      const statusData = await statusResponse.json()
                                      
                                      if (statusData.success && statusData.clip_id) {
                                        // 使用clip_id获取音频下载链接
                                        const audioResponse = await fetch(`/api/suno/audio/${statusData.clip_id}`)
                                        const audioData = await audioResponse.json()
                                        
                                        if (audioData.success && audioData.wav_file_url) {
                                          window.open(audioData.wav_file_url, '_blank')
                                        } else {
                                          throw new Error('获取音频链接失败')
                                        }
                                      } else {
                                        throw new Error('获取clip_id失败')
                                      }
                                    } catch (error) {
                                      console.error('下载音频失败:', error)
                                      alert('无法获取音频文件')
                                    }
                                  }}
                                  className="border-purple-500 text-purple-600"
                                >
                                  ⬇️ 下载音频
                                </Button>
                              )}
                              
                              {music.video_url && (
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => window.open(music.video_url!, '_blank')}
                                  className="border-blue-500 text-blue-600"
                                >
                                  🎬 观看MV
                                </Button>
                              )}
                              
                              {music.status !== 'completed' && (
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => refreshMusicStatus(music)}
                                  className="border-yellow-500 text-yellow-600"
                                >
                                  🔄 刷新状态
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* 使用提示 */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>💡 使用指南</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-medium mb-2">灵感模式</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 适合有大致想法但没有具体歌词的创作</li>
                  <li>• 描述音乐风格、语言、主题即可</li>
                  <li>• AI会自动创作歌词和旋律</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">定制模式</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 适合有完整歌词创意的创作</li>
                  <li>• 可以控制音乐风格和结构</li>
                  <li>• 支持[Verse]、[Chorus]等标记</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">续写模式</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 在现有音乐基础上继续创作</li>
                  <li>• 需要原音乐的任务ID和片段ID</li>
                  <li>• 可以扩展音乐长度或添加新段落</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}