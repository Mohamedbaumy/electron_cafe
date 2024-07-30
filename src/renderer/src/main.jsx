import React from 'react'
import ReactDOM from 'react-dom/client'
import { createHashRouter, RouterProvider, Link, useRouteError } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import axios from 'axios'
import App from './App'

import { Result, Button } from 'antd'
import './index.css'

import Home from '@features/home/Home'

const queryClient = new QueryClient()

axios.defaults.baseURL = 'http://localhost:5005/api'
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

const ErrorPage = () => {
  const error = useRouteError()
  return (
    <Result
      status="500"
      title="خطأ غير متوقع"
      subTitle="نعتذر، ولكن حدث خطأ غير متوقع. برجاء المحاولة لاحقاً."
      extra={
        <div>
          <p>
            <strong>تفاصيل الخطأ:</strong> {error.statusText || error.message}
          </p>
          <Link to="/">
            <Button type="primary">العودة للصفحة الرئيسية</Button>
          </Link>
        </div>
      }
    />
  )
}

const router = createHashRouter([
  {
    path: 'login',
    element: <h1>Login</h1>
  },
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <Home />
      },

      {
        path: '/403',
        element: (
          <Result
            status="403"
            title="403"
            subTitle="ليس لديك صلاحية للدخول لهذه الصفحة"
            extra={
              <Link to="/" className="text-slate-900">
                العودة للصفحة الرئيسية
              </Link>
            }
          />
        )
      }
    ],
    errorElement: <ErrorPage />
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>
)
