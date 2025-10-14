import axios from 'axios'

// ✅ Create Axios instance
const apiClient = axios.create({
  baseURL: 'http://localhost:5000/api', // replace with your backend URL
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// ✅ Request interceptor (attach token)
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error) => Promise.reject(error)
)

// ✅ Response interceptor (handle errors)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message)
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('auth_role')
      window.location.href = '/' // redirect to login
    }
    return Promise.reject(error)
  }
)

export default apiClient
