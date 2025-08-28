import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { prompt, style, duration, mode, title } = req.body

    // 验证必需的字段
    if (!prompt) {
      return res.status(400).json({
        error: 'Prompt is required'
      })
    }

    console.log('🎵 开始SUNO音乐生成:', {
      prompt,
      style,
      duration,
      mode,
      title
    })

    // 获取SUNO API配置 - 这些需要在.env.local中配置
    const sunoApiKey = process.env.SUNO_API_KEY
    const sunoApiUrl = process.env.SUNO_API_URL || 'https://api.sunoaiapi.com/api/v1/gateway/generate/music'

    if (!sunoApiKey) {
      console.error('❌ SUNO API密钥未配置')
      // 开发模式下使用模拟响应
      if (process.env.NODE_ENV === 'development') {
        console.log('🔧 开发模式：使用模拟SUNO API响应')
        
        // 模拟API延迟
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // 生成模拟的任务ID
        const taskId = `suno_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        
        return res.status(200).json({
          success: true,
          task_id: taskId,
          status: 'submitted',
          message: '音乐生成任务已提交（开发模式）',
          api: 'suno',
          estimated_time: duration || 120
        })
      }
      
      return res.status(500).json({
        error: 'SUNO API key not configured'
      })
    }

    // 构建SUNO API请求体
    const requestBody = {
      prompt: prompt,
      style: style || 'pop',
      duration: duration || 120,
      mode: mode || 'inspiration',
      title: title || '',
      // SUNO API 特有参数
      make_instrumental: false,
      wait_audio: false,
      model_version: 'v3.5',
      output_format: 'mp3'
    }

    console.log('📤 发送SUNO API请求:', {
      url: sunoApiUrl,
      prompt: requestBody.prompt.substring(0, 50) + '...',
      style: requestBody.style,
      duration: requestBody.duration
    })

    // 调用SUNO API
    const response = await fetch(sunoApiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${sunoApiKey}`,
        'Content-Type': 'application/json',
        'User-Agent': 'SunoMusicGenerator/1.0'
      },
      body: JSON.stringify(requestBody)
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ SUNO API请求失败:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      })

      return res.status(response.status).json({
        error: `SUNO API request failed: ${response.status} ${response.statusText}`,
        details: errorText
      })
    }

    const data = await response.json()
    console.log('✅ SUNO API响应:', data)

    // 处理SUNO API响应格式
    const taskId = data.data?.task_id || data.id || data.task_id
    const status = data.data?.status || data.status || 'submitted'
    const audioUrl = data.data?.audio_url || data.audio_url

    if (!taskId) {
      console.error('❌ SUNO API响应中缺少任务ID')
      return res.status(500).json({
        error: 'No task ID in SUNO API response'
      })
    }

    return res.status(200).json({
      success: true,
      task_id: taskId,
      status: status,
      audio_url: audioUrl,
      message: 'SUNO音乐生成任务已提交',
      api: 'suno',
      estimated_time: duration || 120
    })

  } catch (error: any) {
    console.error('❌ SUNO音乐生成失败:', error)
    
    // 网络错误处理
    if (error.name === 'AbortError' || error.code === 'ECONNRESET') {
      return res.status(408).json({
        error: 'Request timeout',
        details: 'SUNO API request timed out'
      })
    }
    
    return res.status(500).json({
      error: 'Failed to generate music with SUNO',
      details: error.message
    })
  }
}
