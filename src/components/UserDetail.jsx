import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, User, Calendar, Trophy, MessageSquare } from 'lucide-react'
import { adminApi } from '../api/adminApi'
import { formatDate, getCategoryClass, getCategoryDescription, getCategoryColor } from '../utils/formatters'

function UserDetail() {
  const { id } = useParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadUserReport()
  }, [id])

  const loadUserReport = async () => {
    try {
      setLoading(true)
      const result = await adminApi.getUserReport(id)
      setData(result)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <LoadingSkeleton />
  }

  if (error) {
    return <ErrorState error={error} onRetry={loadUserReport} />
  }

  if (!data) {
    return <NotFoundState />
  }

  const { user, competency_scores, total_score, max_possible_score, category, category_description, game_choices } = data

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to="/" className="btn-secondary">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            👤 Report
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {user.username ? `@${user.username}` : `ID: ${user.telegram_id}`}
          </p>
        </div>
      </div>

      {/* User Info Card */}
      <div className="card p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <InfoItem
            icon={<User className="w-5 h-5" />}
            label="User"
            value={user.username ? `@${user.username}` : `ID: ${user.telegram_id}`}
          />
          <InfoItem
            icon={<Calendar className="w-5 h-5" />}
            label="Age"
            value={`${user.age} years`}
          />
          <InfoItem
            icon={<Calendar className="w-5 h-5" />}
            label="Registration Date"
            value={formatDate(user.created_at)}
          />
        </div>
      </div>

      {/* Score Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6 text-center">
          <div className="text-lg font-medium text-gray-900 dark:text-white mt-1">
            Final Score
          </div>
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
            {total_score}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            out of {max_possible_score} points
          </div>
        </div>
        
        <div className="card p-6 text-center">
          <div className="text-lg font-medium text-gray-900 dark:text-white mt-1">
            Category
          </div>
          <div className={`text-3xl font-bold mb-2 ${getCategoryClass(category).replace('badge', '').trim()}`}>
            {category}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            score range
          </div>
        </div>

        <div className="card p-6 text-center">
          <div className="text-lg font-medium text-gray-900 dark:text-white mt-1">
            Activity
          </div>
          <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
            {game_choices ? game_choices.length : 0}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            game choices
          </div>
        </div>
      </div>

      {/* Category Description */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
          <Trophy className="w-5 h-5" />
          Results Interpretation
        </h3>
        <div className={`p-4 rounded-lg border-l-4 ${
          category === '0-24' ? 'bg-green-50 dark:bg-green-900/20 border-green-500' :
          category === '25-49' ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500' :
          category === '50-73' ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500' :
          'bg-red-50 dark:bg-red-900/20 border-red-500'
        }`}>
          <p className="text-gray-800 dark:text-gray-200">
            {category_description}
          </p>
        </div>
      </div>


      {/* Game Choices */}
      {game_choices && game_choices.length > 0 && (
        <div className="card p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Game Choices History ({game_choices.length})
          </h2>
          <div className="space-y-4">
            {game_choices.map((choice, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900 dark:text-white">
                    Choice #{index + 1}
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatDate(choice.created_at)}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">
                    Choice: {choice.selected_choice} | {choice.competency ? choice.competency.name_ru : `Competency ID: ${choice.competency_id}`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// Helper Components
function LoadingSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="flex items-center gap-4">
        <div className="w-16 h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="w-64 h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
      {[...Array(3)].map((_, i) => (
        <div key={i} className="card p-6">
          <div className="w-48 h-6 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
          <div className="w-full h-40 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      ))}
    </div>
  )
}

function ErrorState({ error, onRetry }) {
  return (
    <div className="card p-8 text-center">
      <div className="text-6xl mb-4">❌</div>
      <div className="text-xl font-bold text-gray-900 dark:text-white mb-2">
        Data loading error
      </div>
      <div className="text-gray-600 dark:text-gray-400 mb-6">
        {error}
      </div>
      <div className="flex items-center justify-center gap-4">
        <button onClick={onRetry} className="btn-primary">
          Try again
        </button>
        <Link to="/" className="btn-secondary">
          <ArrowLeft className="w-4 h-4" />
          Back to main
        </Link>
      </div>
    </div>
  )
}

function NotFoundState() {
  return (
    <div className="card p-8 text-center">
      <div className="text-6xl mb-4">🔍</div>
      <div className="text-xl font-bold text-gray-900 dark:text-white mb-2">
        User not found
      </div>
      <div className="text-gray-600 dark:text-gray-400 mb-6">
        User with this ID does not exist or has not completed testing
      </div>
      <Link to="/" className="btn-primary">
        <ArrowLeft className="w-4 h-4" />
        Back to list
      </Link>
    </div>
  )
}

function InfoItem({ icon, label, value }) {
  return (
    <div className="flex items-center gap-3">
      <div className="text-gray-400 dark:text-gray-500">
        {icon}
      </div>
      <div>
        <div className="text-sm text-gray-500 dark:text-gray-400">{label}</div>
        <div className="font-medium text-gray-900 dark:text-white">{value}</div>
      </div>
    </div>
  )
}


export default UserDetail