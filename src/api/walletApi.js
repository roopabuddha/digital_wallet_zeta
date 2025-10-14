import apiClient from './axios'

// 🔹 Get all wallets
export async function getWallets() {
  const { data } = await apiClient.get('/wallets')
  return data
}

// 🔹 Get wallet by ID
export async function getWalletById(id) {
  const { data } = await apiClient.get(`/wallets/${id}`)
  return data
}

// 🔹 Create wallet
export async function createWallet(payload) {
  const { data } = await apiClient.post('/wallets', payload)
  return data
}

// 🔹 Update wallet
export async function updateWallet(id, payload) {
  const { data } = await apiClient.put(`/wallets/${id}`, payload)
  return data
}

// 🔹 Delete wallet
export async function deleteWallet(id) {
  const { data } = await apiClient.delete(`/wallets/${id}`)
  return data
}
