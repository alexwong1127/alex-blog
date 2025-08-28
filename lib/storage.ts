import { MusicTrack, STORAGE_KEYS } from '@/types';

// 获取所有音乐作品
export function getAllTracks(): MusicTrack[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.MUSIC_TRACKS);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading tracks from localStorage:', error);
    return [];
  }
}

// 保存音乐作品
export function saveTracks(tracks: MusicTrack[]): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEYS.MUSIC_TRACKS, JSON.stringify(tracks));
  } catch (error) {
    console.error('Error saving tracks to localStorage:', error);
  }
}

// 添加新音乐作品
export function addTrack(track: MusicTrack): void {
  const tracks = getAllTracks();
  tracks.unshift(track); // 添加到开头
  saveTracks(tracks);
}

// 更新音乐作品
export function updateTrack(id: string, updates: Partial<MusicTrack>): void {
  const tracks = getAllTracks();
  const index = tracks.findIndex(track => track.id === id);
  
  if (index !== -1) {
    tracks[index] = { ...tracks[index], ...updates };
    saveTracks(tracks);
  }
}

// 删除音乐作品
export function deleteTrack(id: string): void {
  const tracks = getAllTracks();
  const filteredTracks = tracks.filter(track => track.id !== id);
  saveTracks(filteredTracks);
}

// 生成唯一ID
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// 格式化时间
export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// SUNO音乐生成API调用
export async function generateMusic(params: {
  prompt: string;
  style?: string;
  duration?: number;
  mode?: string;
  title?: string;
}): Promise<{ 
  success: boolean; 
  taskId?: string;
  trackUrl?: string; 
  error?: string;
  status?: string;
}> {
  try {
    console.log('🎵 调用SUNO音乐生成API:', params);
    
    // 根据模式构建正确的请求参数
    let requestBody: any = {
      mode: params.mode || 'custom',
    };

    if (params.mode === 'inspiration') {
      // 灵感模式：将prompt作为gpt_description_prompt
      requestBody.gpt_description_prompt = params.prompt;
    } else {
      // 定制模式和续写模式：使用原有参数格式
      requestBody = {
        ...requestBody,
        prompt: params.prompt,
        tags: params.style || 'pop',
        title: params.title || 'Untitled',
        mv: 'chirp-v3-0'
      };
    }

    console.log('🎵 发送请求体:', requestBody);
    
    const response = await fetch('/api/suno', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ SUNO API调用失败:', errorData);
      return {
        success: false,
        error: errorData.error || `HTTP ${response.status}: ${response.statusText}`
      };
    }

    const data = await response.json();
    console.log('✅ SUNO API响应:', data);

    return {
      success: data.success,
      taskId: data.task_id,
      status: data.status,
      trackUrl: data.audio_url,
      error: data.error
    };
  } catch (error: any) {
    console.error('❌ SUNO音乐生成网络错误:', error);
    return {
      success: false,
      error: '网络错误：' + error.message
    };
  }
}

// 查询SUNO音乐生成状态
export async function checkMusicStatus(taskId: string): Promise<{
  success: boolean;
  status?: string;
  audioUrl?: string;
  coverUrl?: string;
  title?: string;
  duration?: number;
  progress?: number;
  error?: string;
}> {
  try {
    console.log('🔍 查询音乐生成状态:', taskId);
    
    const response = await fetch('/api/suno/status', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ task_id: taskId })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ 状态查询失败:', errorData);
      return {
        success: false,
        error: errorData.error || `HTTP ${response.status}: ${response.statusText}`
      };
    }

    const data = await response.json();
    console.log('✅ 状态查询响应:', data);

    return {
      success: data.success,
      status: data.status,
      audioUrl: data.audio_url,
      coverUrl: data.cover_url,
      title: data.title,
      duration: data.duration,
      progress: data.progress,
      error: data.error_message
    };
  } catch (error: any) {
    console.error('❌ 状态查询网络错误:', error);
    return {
      success: false,
      error: '网络错误：' + error.message
    };
  }
}
