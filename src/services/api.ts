import axios from 'axios'
import { TokenStorage } from '../utils/tokenStorage'

const API_BASE = (typeof process !== 'undefined' && process.env && process.env.VITE_API_BASE) || 'http://localhost:4000'

const api = axios.create({ baseURL: API_BASE })

api.interceptors.request.use(config => {
  const token = TokenStorage.get()
  if (token && config && config.headers) {
    config.headers['Authorization'] = `Bearer ${token}`
  }
  return config
})

export default api
