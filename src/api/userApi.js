import apiClient from './axios'

// 🔹 Get all users
export async function getUsers() {
  const { data } = await apiClient.get('/users')
  return data
}

// 🔹 Create user
export async function createUser(payload) {
  const { data } = await apiClient.post('/users', payload)
  return data
}

// 🔹 Update user
export async function updateUser(id, payload) {
  const { data } = await apiClient.put(`/users/${id}`, payload)
  return data
}

// 🔹 Delete user
export async function deleteUser(id) {
  const { data } = await apiClient.delete(`/users/${id}`)
  return data
}
