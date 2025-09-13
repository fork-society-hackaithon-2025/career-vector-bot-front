import React, { useMemo } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { format, startOfDay, subDays } from 'date-fns'
import { ru } from 'date-fns/locale'

function ActivityTimelineChart({ users }) {
  const data = useMemo(() => {
    if (!users || users.length === 0) return []
    
    // Получаем данные за последние 7 дней
    const days = Array.from({ length: 7 }, (_, i) => {
      const date = startOfDay(subDays(new Date(), 6 - i))
      return {
        date,
        dateString: format(date, 'dd.MM', { locale: ru }),
        registrations: 0,
        completions: 0,
      }
    })

    // Подсчитываем регистрации и завершения по дням
    users.forEach(user => {
      const createdDate = startOfDay(new Date(user.created_at))
      const dayIndex = days.findIndex(day => 
        day.date.getTime() === createdDate.getTime()
      )
      
      if (dayIndex !== -1) {
        days[dayIndex].registrations++
        if (user.is_completed) {
          days[dayIndex].completions++
        }
      }
    })

    return days
  }, [users])

  if (data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
        📊 Нет данных для отображения
      </div>
    )
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="font-semibold text-gray-900 dark:text-white mb-2">
            {label}
          </p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: <span className="font-medium">{entry.value}</span>
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="dateString" 
            tick={{ fontSize: 12 }}
          />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="registrations" 
            stroke="#3b82f6" 
            strokeWidth={2}
            name="Регистрации"
            dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line 
            type="monotone" 
            dataKey="completions" 
            stroke="#10b981" 
            strokeWidth={2}
            name="Завершения"
            dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default ActivityTimelineChart


