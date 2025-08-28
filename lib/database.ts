// 音乐类型定义
export interface Music {
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

// 用户类型定义
export interface User {
  id: string
  email?: string
  name?: string
  created_at: string
}

// 数据库操作类
class Database {
  private MUSIC_KEY = 'demo-music'
  private USER_KEY = 'demo-user'

  // 音乐相关操作
  async createMusic(music: Omit<Music, 'id' | 'created_at' | 'updated_at'>): Promise<Music> {
    const newMusic: Music = {
      ...music,
      id: `music-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    try {
      const existingMusic = this.getAllMusic()
      const updatedMusic = [...existingMusic, newMusic]
      localStorage.setItem(this.MUSIC_KEY, JSON.stringify(updatedMusic))
      return newMusic
    } catch (error) {
      console.error('创建音乐记录失败:', error)
      throw new Error('创建音乐记录失败')
    }
  }

  async getMusic(userId: string): Promise<Music[]> {
    try {
      const allMusic = this.getAllMusic()
      return allMusic.filter(music => music.user_id === userId)
    } catch (error) {
      console.error('获取音乐列表失败:', error)
      return []
    }
  }

  async updateMusic(id: string, updates: Partial<Music>): Promise<Music | null> {
    try {
      const allMusic = this.getAllMusic()
      const musicIndex = allMusic.findIndex(music => music.id === id)
      
      if (musicIndex === -1) {
        console.error('音乐记录不存在:', id)
        return null
      }

      const updatedMusic = {
        ...allMusic[musicIndex],
        ...updates,
        updated_at: new Date().toISOString()
      }

      allMusic[musicIndex] = updatedMusic
      localStorage.setItem(this.MUSIC_KEY, JSON.stringify(allMusic))
      
      return updatedMusic
    } catch (error) {
      console.error('更新音乐记录失败:', error)
      throw new Error('更新音乐记录失败')
    }
  }

  async deleteMusic(id: string): Promise<boolean> {
    try {
      const allMusic = this.getAllMusic()
      const filteredMusic = allMusic.filter(music => music.id !== id)
      
      if (filteredMusic.length === allMusic.length) {
        console.error('音乐记录不存在:', id)
        return false
      }

      localStorage.setItem(this.MUSIC_KEY, JSON.stringify(filteredMusic))
      return true
    } catch (error) {
      console.error('删除音乐记录失败:', error)
      throw new Error('删除音乐记录失败')
    }
  }

  private getAllMusic(): Music[] {
    try {
      const musicData = localStorage.getItem(this.MUSIC_KEY)
      return musicData ? JSON.parse(musicData) : []
    } catch (error) {
      console.error('解析音乐数据失败:', error)
      return []
    }
  }

  // 用户相关操作
  async createUser(user: Omit<User, 'id' | 'created_at'>): Promise<User> {
    const newUser: User = {
      ...user,
      id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      created_at: new Date().toISOString()
    }

    try {
      localStorage.setItem(this.USER_KEY, JSON.stringify(newUser))
      return newUser
    } catch (error) {
      console.error('创建用户失败:', error)
      throw new Error('创建用户失败')
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const userData = localStorage.getItem(this.USER_KEY)
      return userData ? JSON.parse(userData) : null
    } catch (error) {
      console.error('获取用户信息失败:', error)
      return null
    }
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | null> {
    try {
      const currentUser = await this.getCurrentUser()
      
      if (!currentUser || currentUser.id !== id) {
        console.error('用户不存在或ID不匹配:', id)
        return null
      }

      const updatedUser = {
        ...currentUser,
        ...updates
      }

      localStorage.setItem(this.USER_KEY, JSON.stringify(updatedUser))
      return updatedUser
    } catch (error) {
      console.error('更新用户信息失败:', error)
      throw new Error('更新用户信息失败')
    }
  }

  // 清理数据
  async clearAllData(): Promise<void> {
    try {
      localStorage.removeItem(this.MUSIC_KEY)
      localStorage.removeItem(this.USER_KEY)
      console.log('已清理所有本地数据')
    } catch (error) {
      console.error('清理数据失败:', error)
      throw new Error('清理数据失败')
    }
  }

  // 获取统计信息
  async getStats(userId: string): Promise<{
    totalMusic: number
    completedMusic: number
    processingMusic: number
    failedMusic: number
  }> {
    try {
      const userMusic = await this.getMusic(userId)
      
      return {
        totalMusic: userMusic.length,
        completedMusic: userMusic.filter(m => m.status === 'completed').length,
        processingMusic: userMusic.filter(m => m.status === 'processing').length,
        failedMusic: userMusic.filter(m => m.status === 'failed').length
      }
    } catch (error) {
      console.error('获取统计信息失败:', error)
      return {
        totalMusic: 0,
        completedMusic: 0,
        processingMusic: 0,
        failedMusic: 0
      }
    }
  }
}

// 导出数据库实例
export const db = new Database()