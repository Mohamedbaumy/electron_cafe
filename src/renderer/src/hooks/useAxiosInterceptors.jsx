import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

const useAxiosInterceptors = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => {
        const { data, status } = response
        return { data, status }
      },
      (error) => {
        const status = error.status || error.response.status
        // if (status === 401) {
        //   // try to refresh token
        //   const refreshToken = localStorage.getItem('refreshToken')
        //   if (refreshToken) {
        //     axios
        //       .post(
        //         '/auth/refresh',
        //         {},
        //         {
        //           headers: {
        //             'X-Refresh-Token': refreshToken
        //           }
        //         }
        //       )
        //       .then(({ data }) => {
        //         localStorage.setItem('token', data.token)
        //         localStorage.setItem('refreshToken', data.refreshToken)
        //         axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`
        //       })
        //       .catch(() => {
        //         localStorage.removeItem('token')
        //         localStorage.removeItem('refreshToken')
        //         navigate('/login', { replace: true })
        //       })
        //   } else {
        //     localStorage.removeItem('token')
        //     localStorage.removeItem('refreshToken')
        //     navigate('/login', { replace: true })
        //   }
        // } else if (status === 403) {
        //   navigate('/login', { replace: true })
        // }
        return Promise.reject(error)
      }
    )

    return () => {
      axios.interceptors.response.eject(interceptor)
    }
  }, [navigate])
}

export default useAxiosInterceptors
