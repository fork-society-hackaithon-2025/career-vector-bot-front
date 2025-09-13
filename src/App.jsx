import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './hooks/useTheme'
import Layout from './components/Layout'
import Dashboard from './components/Dashboard'
import UserDetail from './components/UserDetail'
import NotFound from './components/NotFound'

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/user/:id" element={<UserDetail />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </div>
      </Router>
    </ThemeProvider>
  )
}

export default App


