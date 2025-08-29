import { NextApiRequest, NextApiResponse } from 'next'
import { optimizeSunoForInstrumental } from '../../../lib/suno-instrumental-optimizer'

// 暂时使用简单的本地存储，不依赖数据库
const musicStorage: any[] = []

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }

  try {
    const { 
      mode = "custom", // "inspiration", "custom", "continue"
      gpt_description_prompt,
      prompt,
      tags,
      mv = "chirp-v3-0",
      title,
      task_id,
      continue_clip_id,
      continue_at,
      project_id,
      user_id
    } = req.body

    console.log('🎵 SUNO音乐生成请求:', {
      mode,
      title: title || gpt_description_prompt?.substring(0, 50),
      tags,
      mv,
      project_id,
      user_id
    })

    // 验证必需参数
    if (mode === "inspiration" && !gpt_description_prompt) {
      return res.status(400).json({
        success: false,
        error: "灵感模式需要gpt_description_prompt参数"
      })
    }

    if ((mode === "custom" || mode === "continue") && !prompt) {
      return res.status(400).json({
        success: false,
        error: "定制模式和续写模式需要prompt参数"
      })
    }

    if (mode === "continue" && (!continue_clip_id || continue_at === undefined)) {
      return res.status(400).json({
        success: false,
        error: "续写模式需要continue_clip_id和continue_at参数"
      })
    }

    // 构建API请求数据 - 按照官方API格式
    let apiData: any = {}

    switch (mode) {
      case "inspiration":
        apiData = {
          mode,
          gpt_description_prompt
        }
        break
      
      case "custom":
        apiData = {
          mode,
          prompt,
          tags: tags || "pop",
          title: title || "Untitled",
          mv: mv || "chirp-v3-0"
        }
        break
      
      case "continue":
        apiData = {
          mode,
          prompt,
          tags: tags || "pop", 
          title: title || "Untitled",
          mv: mv || "chirp-v3-0",
          task_id,
          continue_clip_id,
          continue_at
        }
        break
    }

    // 检查是否需要生成纯音乐（从请求体中获取）
    if (req.body.make_instrumental) {
      apiData.make_instrumental = true
      // 在发送SUNO请求前优化
      const optimizedData = optimizeSunoForInstrumental(apiData)
      apiData = optimizedData
    }

    console.log('📤 发送到SUNO API:', apiData)

    // 调用SUNO API - 使用正确的API端点
    const sunoResponse = await fetch("https://api.apicore.ai/suno/submit/music", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.SUNO_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(apiData)
    })

    console.log('📡 SUNO API响应状态:', sunoResponse.status, sunoResponse.statusText)

    // 检查响应状态
    if (!sunoResponse.ok) {
      const errorText = await sunoResponse.text()
      console.error('❌ SUNO API HTTP错误:', sunoResponse.status, errorText)
      throw new Error(`SUNO API错误: ${sunoResponse.status} ${sunoResponse.statusText}`)
    }

    const sunoData = await sunoResponse.json()
    console.log('📥 SUNO API响应:', sunoData)

    if (sunoData.code !== "success") {
      throw new Error(`SUNO生成失败: ${sunoData.message || "未知错误"}`)
    }

    const taskId = sunoData.data

    // 如果有用户ID，尝试保存到本地存储（不阻塞主流程）
    if (user_id) {
      try {
        const musicRecord = {
          id: `music-${Date.now()}`,
          user_id,
          project_id: (project_id && project_id !== "temp-suno-project") ? project_id : null,
          task_id: taskId,
          mode,
          title: title || gpt_description_prompt?.substring(0, 100) || "Untitled Music",
          prompt: prompt || gpt_description_prompt || "",
          tags: tags || "",
          mv_version: mv,
          gpt_description_prompt: gpt_description_prompt || null,
          continue_clip_id: continue_clip_id || null,
          continue_at: continue_at || null,
          status: "processing",
          audio_url: null,
          video_url: null,
          image_url: null,
          duration: null,
          error_message: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
        
        musicStorage.push(musicRecord)
        console.log('💾 音乐记录已保存:', musicRecord.id)
      } catch (dbError) {
        console.error('❌ 保存音乐记录失败，但不影响API响应:', dbError)
        // 数据库错误不应该阻止API响应，只记录错误
      }
    }

    return res.status(200).json({
      success: true,
      task_id: taskId,
      message: "音乐生成任务已提交",
      data: {
        task_id: taskId,
        mode,
        title: title || gpt_description_prompt?.substring(0, 100) || "Untitled Music",
        status: "processing"
      }
    })

  } catch (error: any) {
    console.error('❌ SUNO音乐生成失败:', error)
    return res.status(500).json({ 
      success: false, 
      error: error.message || "音乐生成失败"
    })
  }
}