import { format, formatDistanceToNow } from 'date-fns'
import { ru } from 'date-fns/locale'

// Форматирование даты
export const formatDate = (dateString) => {
  if (!dateString) return '-'
  
  try {
    const date = new Date(dateString)
    return format(date, 'dd.MM.yyyy HH:mm', { locale: ru })
  } catch (error) {
    return dateString
  }
}

// Форматирование относительного времени
export const formatRelativeTime = (dateString) => {
  if (!dateString) return '-'
  
  try {
    const date = new Date(dateString)
    return formatDistanceToNow(date, { addSuffix: true, locale: ru })
  } catch (error) {
    return dateString
  }
}

// Форматирование баллов
export const formatScore = (score, maxScore) => {
  if (typeof score !== 'number' || typeof maxScore !== 'number') {
    return '-'
  }
  return `${score}/${maxScore}`
}

// Форматирование процентов
export const formatPercentage = (value, decimals = 1) => {
  if (typeof value !== 'number') return '-'
  return `${value.toFixed(decimals)}%`
}

// Получение класса CSS для категории баллов
export const getCategoryClass = (category) => {
  switch (category) {
    case '0-24':
      return 'badge badge-success' // Лучшая категория
    case '25-49':
      return 'badge badge-info'
    case '50-73':
      return 'badge badge-warning'
    case '74-98':
      return 'badge badge-error' // Худшая категория
    default:
      return 'badge'
  }
}

// Получение описания категории
export const getCategoryDescription = (category) => {
  switch (category) {
    case '0-24':
      return 'Высоко соответствует профилю социального лидера'
    case '25-49':
      return 'Соответствует профилю социального лидера'
    case '50-73':
      return 'Заметно разнящийся с профилем социального лидера'
    case '74-98':
      return 'НЕ соответствует профилю социального лидера'
    default:
      return 'Неизвестная категория'
  }
}

// Получение цвета для графиков
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

// Получение короткого описания категории для легенды
export const getCategoryLabel = (category) => {
  switch (category) {
    case '0-24':
      return 'Высокое соответствие'
    case '25-49':
      return 'Частичное соответствие'
    case '50-73':
      return 'Заметное различие'
    case '74-98':
      return 'Не соответствует'
    default:
      return 'Неизвестная категория'
  }
}

// Форматирование имени пользователя
export const formatUserName = (user) => {
  if (user.username) {
    return `@${user.username}`
  }
  return `ID: ${user.telegram_id}`
}

// Форматирование статуса
export const getStatusInfo = (isCompleted, choicesCount = 0) => {
  if (isCompleted) {
    return {
      text: 'Завершен',
      icon: '✅',
      class: 'text-green-600 dark:text-green-400'
    }
  }
  
  if (choicesCount > 0) {
    return {
      text: 'В процессе',
      icon: '🔄',
      class: 'text-yellow-600 dark:text-yellow-400'
    }
  }
  
  return {
    text: 'Не начат',
    icon: '⏳',
    class: 'text-gray-600 dark:text-gray-400'
  }
}


