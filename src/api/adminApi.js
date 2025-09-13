const API_BASE = import.meta.env.PROD ? 'https://career-vector-bot.onrender.com' : 'https://career-vector-bot.onrender.com'

class AdminAPI {
  async request(endpoint, options = {}) {
    console.log(import.meta.env)
    const url = `${API_BASE}/api${endpoint}`
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error)
      throw error
    }
  }

  // Get dashboard data (users + statistics)
  async getDashboard() {
    return this.request('/dashboard')
  }

  // Get list of all users
  async getUsers() {
    return this.request('/users')
  }

  // Get detailed user report
  async getUserReport(userId) {
    return this.request(`/users/${userId}/report`)
  }

  // Get general statistics
  async getStats() {
    return this.request('/stats')
  }
}

export const adminApi = new AdminAPI()

// React Query hooks (if you want to add later)
export const API_KEYS = {
  dashboard: 'dashboard',
  users: 'users',
  userReport: (id) => ['user', id, 'report'],
  stats: 'stats',
}


