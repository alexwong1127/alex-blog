import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }

  try {
    const { task_id, music_id } = req.body

    if (!task_id) {
      return res.status(400).json({
        success: false,
        error: "需要task_id参数"
      })
    }

    console.log('🔍 查询SUNO音乐状态:', { task_id, music_id })

    // 调用SUNO状态查询API - 正确的端点
    const statusResponse = await fetch(`https://api.apicore.ai/suno/fetch/${task_id}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${process.env.SUNO_API_KEY}`,
        "Content-Type": "application/json"
      }
    })

    console.log('📡 SUNO状态API响应状态:', statusResponse.status, statusResponse.statusText)

    let statusData: any = {}
    
    if (statusResponse.ok) {
      statusData = await statusResponse.json()
      console.log('📥 SUNO状态响应详细:', statusData)
      
      // 处理正确的响应格式
      if (statusData.code === "success" && statusData.data) {
        const taskData = statusData.data
        
        // 检查任务状态
        const isCompleted = taskData.status === "SUCCESS" && taskData.progress === "100%"
        let firstAudioUrl = null
        let firstClipId = null
        
        // 如果任务完成，提取第一个音频的信息
        if (isCompleted && taskData.data && taskData.data.length > 0) {
          const firstClip = taskData.data[0]
          firstAudioUrl = firstClip.audio_url
          firstClipId = firstClip.clip_id || firstClip.id
        }
        
        return res.status(200).json({
          success: true,
          task_id: task_id,
          status: isCompleted ? "completed" : taskData.status === "FAILED" ? "failed" : "processing",
          audio_url: firstAudioUrl,
          video_url: isCompleted && taskData.data.length > 0 ? taskData.data[0].video_url : null,
          image_url: isCompleted && taskData.data.length > 0 ? taskData.data[0].image_url : null,
          duration: isCompleted && taskData.data.length > 0 ? taskData.data[0].duration : null,
          clip_id: firstClipId,
          created_at: isCompleted && taskData.data.length > 0 ? taskData.data[0].created_at : null,
          progress: taskData.progress || "0%",
          clips: isCompleted ? taskData.data : [] // 返回所有生成的音频片段
        })
      }
    } else {
      // 如果状态API不可用，返回处理中状态
      const errorText = await statusResponse.text()
      console.log('⚠️ SUNO状态API响应错误:', errorText)
    }

    // 默认返回处理中状态
    return res.status(200).json({
      success: true,
      task_id: task_id,
      status: "processing",
      audio_url: null,
      video_url: null,
      image_url: null,
      message: "音乐正在生成中，请稍后刷新"
    })

  } catch (error: any) {
    console.error('❌ SUNO状态查询失败:', error)
    
    // 返回默认的处理中状态，而不是错误
    const { task_id } = req.body || {}
    
    return res.status(200).json({
      success: true,
      task_id: task_id,
      status: "processing",
      audio_url: null,
      video_url: null,
      image_url: null,
      message: "音乐正在生成中，请稍后刷新"
    })
  }
}
