import axios from 'axios'
import { getApiBase } from './runtimeApi'

const API_BASE_URL = getApiBase()
const TOKEN_KEY = 'token'
const AUTH_USER_KEY = 'authUser'
const CSRF_TOKEN_KEY = 'csrfToken'

const parseJwtPayload = (token) => {
  if (!token || typeof token !== 'string') return null
  const parts = token.split('.')
  if (parts.length !== 3) return null

  try {
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/')
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=')
    return JSON.parse(atob(padded))
  } catch {
    return null
  }
}

const hasValidJwtShape = (token) => {
  const payload = parseJwtPayload(token)
  if (!payload) return false
  if (payload.exp && Date.now() >= Number(payload.exp) * 1000) return false
  return true
}

const clearAuthStorage = () => {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(AUTH_USER_KEY)
  localStorage.removeItem(CSRF_TOKEN_KEY)
}

const emitAuthLogout = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('auth:logout'))
  }
}

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY)
  const csrfToken = localStorage.getItem(CSRF_TOKEN_KEY)
  if (token && hasValidJwtShape(token)) {
    config.headers.Authorization = `Bearer ${token}`
    const method = String(config.method || 'get').toUpperCase()
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method) && csrfToken) {
      config.headers['X-CSRF-Token'] = csrfToken
    }
  } else if (token) {
    clearAuthStorage()
    emitAuthLogout()
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      const url = error?.config?.url || ''
      const isAuthEndpoint = url.includes('/auth/login') || url.includes('/auth/register')
      if (!isAuthEndpoint) {
        clearAuthStorage()
        emitAuthLogout()
      }
    }
    return Promise.reject(error)
  }
)

export default api
