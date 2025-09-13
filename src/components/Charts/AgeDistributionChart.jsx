import React, { useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

function AgeDistributionChart({ users }) {
  const data = useMemo(() => {
    if (!users || users.length === 0) return []
    
    // Группируем пользователей по возрасту
    const ageGroups = users.reduce((acc, user) => {
      const age = user.age
      if (!acc[age]) {
        acc[age] = { age, total: 0, completed: 0, in_progress: 0 }
      }
      acc[age].total++
      if (user.is_completed) {
        acc[age].completed++
      } else if (user.choices_count > 0) {
        acc[age].in_progress++
      }
      return acc
    }, {})

    return Object.values(ageGroups).sort((a, b) => a.age - b.age)
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
            Возраст: {label} лет
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
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="age" 
            tick={{ fontSize: 12 }}
            label={{ value: 'Возраст', position: 'insideBottom', offset: -5 }}
          />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar 
            dataKey="completed" 
            fill="#10b981" 
            name="Завершили"
            radius={[2, 2, 0, 0]}
          />
          <Bar 
            dataKey="in_progress" 
            fill="#f59e0b" 
            name="В процессе"
            radius={[2, 2, 0, 0]}
          />
          <Bar 
            dataKey="total" 
            fill="#6b7280" 
            name="Всего"
            fillOpacity={0.3}
            radius={[2, 2, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default AgeDistributionChart


