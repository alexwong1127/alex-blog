import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }

  try {
    const { clipId } = req.query

    if (!clipId || typeof clipId !== 'string') {
      return res.status(400).json({
        success: false,
        error: "需要clip_id参数"
      })
    }

    console.log('🎵 请求音频文件下载:', clipId)

    // 调用SUNO音频下载API - 根据文档返回JSON格式的下载链接
    const audioResponse = await fetch(`https://api.apicore.ai/suno/act/wav/${clipId}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${process.env.SUNO_API_KEY}`,
        "Content-Type": "application/json"
      }
    })

    console.log('📡 SUNO音频API响应状态:', audioResponse.status, audioResponse.statusText)

    if (!audioResponse.ok) {
      const errorText = await audioResponse.text()
      console.error('❌ SUNO音频API错误:', errorText)
      throw new Error(`音频获取失败: ${audioResponse.status} ${audioResponse.statusText}`)
    }

    // 根据API文档，应该返回JSON格式: {"wav_file_url": "https://cdn1.suno.ai/..."}
    const audioData = await audioResponse.json()
    console.log('📥 音频API响应:', audioData)
    
    // 检查响应格式
    if (audioData.wav_file_url) {
      return res.status(200).json({
        success: true,
        clip_id: clipId,
        wav_file_url: audioData.wav_file_url,
        download_url: audioData.wav_file_url
      })
    } else {
      console.error('❌ 音频API响应格式错误:', audioData)
      throw new Error('音频API响应格式错误，未找到wav_file_url字段')
    }

  } catch (error: any) {
    console.error('❌ 音频下载失败:', error)
    return res.status(500).json({ 
      success: false, 
      error: error.message || "音频下载失败"
    })
  }
}