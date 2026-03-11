import { apiClient } from './client'

export type AuthToken = string

export type AuthUser = {
  email: string
  selectedCourses: string[]
}

type LoginResponse = {
  token: AuthToken
}

type MessageResponse = {
  message: string
}

export async function login(email: string, password: string) {
  const data = await apiClient.post<LoginResponse>('/auth/login', {
    email,
    password,
  })
  return data.token
}

export async function register(email: string, password: string) {
  return apiClient.post<MessageResponse>('/auth/register', {
    email,
    password,
  })
}

export async function getCurrentUser(token: AuthToken) {
  return apiClient.get<AuthUser>('/users/me', token)
}