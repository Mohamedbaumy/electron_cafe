import { useContext, useState, createContext, useEffect } from 'react'
import { Navigate } from 'react-router-dom'

const AuthContext = createContext()

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    try {
      const localToken = localStorage.getItem('token')
      setToken(localToken)
    } catch (error) {
      setToken(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  if (isLoading) {
    // يمكنك عرض مؤشر تحميل هنا أو أي شيء آخر بينما يتم التحقق من المصادقة
    return <div>Loading...</div>
  }

  if (!token) {
    return <Navigate to="/login" />
  }

  return <AuthContext.Provider value={{ token }}>{children}</AuthContext.Provider>
}

const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export { AuthProvider, useAuth }
