// 音乐生成模式
export type MusicMode = 'inspiration' | 'custom' | 'continuation';

// 音乐风格
export type MusicStyle = 
  | 'pop' | 'rock' | 'jazz' | 'classical' | 'electronic' 
  | 'hiphop' | 'country' | 'folk' | 'blues' | 'reggae'
  | 'punk' | 'metal' | 'indie' | 'ambient' | 'trap';

// 音乐作品接口
export interface MusicTrack {
  id: string;
  title: string;
  description: string;
  style: MusicStyle;
  mode: MusicMode;
  duration: number; // 秒
  fileUrl?: string;
  coverUrl?: string;
  createdAt: string;
  isGenerating: boolean;
  prompt: string;
  taskId?: string; // SUNO API任务ID
  progress?: number; // 生成进度 0-100
  error?: string; // 错误信息
}

// 生成参数接口
export interface GenerationParams {
  mode: MusicMode;
  prompt: string;
  style?: MusicStyle;
  duration?: number;
  title?: string;
}

// 本地存储键名
export const STORAGE_KEYS = {
  MUSIC_TRACKS: 'suno_music_tracks',
  USER_PREFERENCES: 'suno_user_preferences',
} as const;
