import apiClient from './axios'

// 🔹 Get all payments
export async function getPayments() {
  const { data } = await apiClient.get('/payments')
  return data
}

// 🔹 Create a new payment
export async function createPayment(payload) {
  const { data } = await apiClient.post('/payments', payload)
  return data
}

// 🔹 Update payment status
export async function updatePaymentStatus(id, status) {
  const { data } = await apiClient.patch(`/payments/${id}`, { status })
  return data
}

// 🔹 Delete payment
export async function deletePayment(id) {
  const { data } = await apiClient.delete(`/payments/${id}`)
  return data
}
