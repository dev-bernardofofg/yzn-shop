import { axiosInstance, setConfig } from "@kubb/plugin-client/clients/axios"
import { STORAGE_KEYS } from "@/lib/constants"

setConfig({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000",
})

axiosInstance.interceptors.request.use((config) => {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem(STORAGE_KEYS.token)
      : null
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(STORAGE_KEYS.token)
    }
    return Promise.reject(error)
  }
)
