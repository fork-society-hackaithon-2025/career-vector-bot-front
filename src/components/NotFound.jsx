import React from 'react'
import { Link } from 'react-router-dom'
import { Home, ArrowLeft } from 'lucide-react'

function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4">🔍</div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          404
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
          Страница не найдена
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link 
            to="/" 
            className="btn-primary"
          >
            <Home className="w-4 h-4" />
            На главную
          </Link>
          <button 
            onClick={() => window.history.back()} 
            className="btn-secondary"
          >
            <ArrowLeft className="w-4 h-4" />
            Назад
          </button>
        </div>
      </div>
    </div>
  )
}

export default NotFound


