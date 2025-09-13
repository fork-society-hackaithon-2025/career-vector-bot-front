import { format, formatDistanceToNow } from 'date-fns'
import { enUS } from 'date-fns/locale'

// Date formatting
export const formatDate = (dateString) => {
  if (!dateString) return '-'
  
  try {
    const date = new Date(dateString)
    return format(date, 'MM/dd/yyyy HH:mm', { locale: enUS })
  } catch (error) {
    return dateString
  }
}

// Relative time formatting
export const formatRelativeTime = (dateString) => {
  if (!dateString) return '-'
  
  try {
    const date = new Date(dateString)
    return formatDistanceToNow(date, { addSuffix: true, locale: enUS })
  } catch (error) {
    return dateString
  }
}

// Score formatting
export const formatScore = (score, maxScore) => {
  if (typeof score !== 'number' || typeof maxScore !== 'number') {
    return '-'
  }
  return `${score}/${maxScore}`
}

// Percentage formatting
export const formatPercentage = (value, decimals = 1) => {
  if (typeof value !== 'number') return '-'
  return `${value.toFixed(decimals)}%`
}

// Get CSS class for score category
export const getCategoryClass = (category) => {
  switch (category) {
    case '0-24':
      return 'badge badge-success' // Best category
    case '25-49':
      return 'badge badge-info'
    case '50-73':
      return 'badge badge-warning'
    case '74-98':
      return 'badge badge-error' // Worst category
    default:
      return 'badge'
  }
}

// Get category description
export const getCategoryDescription = (category) => {
  switch (category) {
    case '0-24':
      return 'Highly matches social leader profile'
    case '25-49':
      return 'Matches social leader profile'
    case '50-73':
      return 'Significantly differs from social leader profile'
    case '74-98':
      return 'Does NOT match social leader profile'
    default:
      return 'Unknown category'
  }
}

// Get color for charts
export const getCategoryColor = (category) => {
  switch (category) {
    case '0-24':
      return '#10b981' // green-500
    case '25-49':
      return '#3b82f6' // blue-500
    case '50-73':
      return '#f59e0b' // amber-500
    case '74-98':
      return '#ef4444' // red-500
    default:
      return '#6b7280' // gray-500
  }
}

// Get short category description for legend
export const getCategoryLabel = (category) => {
  switch (category) {
    case '0-24':
      return 'High match'
    case '25-49':
      return 'Partial match'
    case '50-73':
      return 'Significant difference'
    case '74-98':
      return 'No match'
    default:
      return 'Unknown category'
  }
}

// User name formatting
export const formatUserName = (user) => {
  if (user.username) {
    return `@${user.username}`
  }
  return `ID: ${user.telegram_id}`
}

// Status formatting
export const getStatusInfo = (isCompleted, choicesCount = 0) => {
  if (isCompleted) {
    return {
      text: 'Completed',
      icon: '✅',
      class: 'text-green-600 dark:text-green-400'
    }
  }
  
  if (choicesCount > 0) {
    return {
      text: 'In Progress',
      icon: '🔄',
      class: 'text-yellow-600 dark:text-yellow-400'
    }
  }
  
  return {
    text: 'Not Started',
    icon: '⏳',
    class: 'text-gray-600 dark:text-gray-400'
  }
}


