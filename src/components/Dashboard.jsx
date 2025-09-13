import React, { useState, useEffect } from 'react'
import { Users, CheckCircle, Clock, TrendingUp, BarChart3, PieChart } from 'lucide-react'
import { adminApi } from '../api/adminApi'
import { formatDate, getCategoryClass, getStatusInfo } from '../utils/formatters'
import UserTable from './UserTable'
import { CategoryPieChart, AgeDistributionChart, ActivityTimelineChart } from './Charts'

function Dashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadDashboard()
  }, [])

  const loadDashboard = async () => {
    try {
      setLoading(true)
      const result = await adminApi.getDashboard()
      setData(result)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card p-6">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="card p-8 text-center">
        <div className="text-red-500 mb-4">❌ Data loading error</div>
        <div className="text-gray-600 dark:text-gray-400 mb-4">{error}</div>
        <button onClick={loadDashboard} className="btn-primary">
          Try again
        </button>
      </div>
    )
  }

  const stats = data?.stats || {}
  const users = data?.users || []

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          📊 Reports
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Overview of career guidance testing results
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={stats.total_users || 0}
          icon={<Users className="w-6 h-6" />}
          color="blue"
        />
        <StatCard
          title="Completed Test"
          value={stats.completed_users || 0}
          icon={<CheckCircle className="w-6 h-6" />}
          color="green"
        />
        <StatCard
          title="In Progress"
          value={stats.in_progress_users || 0}
          icon={<Clock className="w-6 h-6" />}
          color="yellow"
        />
        <StatCard
          title="Average Score"
          value={stats.average_score ? stats.average_score.toFixed(1) : '0.0'}
          icon={<TrendingUp className="w-6 h-6" />}
          color="purple"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Category Distribution */}
        <div className="card p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <PieChart className="w-5 h-5" />
            Category Distribution
          </h2>
          <CategoryPieChart categories={stats.categories} />
        </div>

        {/* Age Distribution */}
        <div className="card p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Age Distribution
          </h2>
          <AgeDistributionChart users={users} />
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="card p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Activity for the last 7 days
        </h2>
        <ActivityTimelineChart users={users} />
      </div>

      {/* Advanced Users Table */}
      {users.length > 0 ? (
        <UserTable users={users} />
      ) : (
        <div className="card p-12 text-center">
          <div className="text-6xl mb-4">📭</div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            No users yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Start using the Telegram bot to see data
          </p>
        </div>
      )}
    </div>
  )
}

function StatCard({ title, value, icon, color }) {
  const colors = {
    blue: 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900',
    green: 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900', 
    yellow: 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900',
    purple: 'text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900',
  }

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
            {title}
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {value}
          </p>
        </div>
        <div className={`p-3 rounded-lg ${colors[color]}`}>
          {icon}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
