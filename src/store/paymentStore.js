import { defineStore } from 'pinia'

export const usePaymentStore = defineStore('payment', {
  state: () => ({
    payments: [],
    loading: false,
    error: null
  }),

  getters: {
    pending: (state) => state.payments.filter((p) => p.status === 'PENDING'),
    processing: (state) => state.payments.filter((p) => p.status === 'PROCESSING'),
    completed: (state) => state.payments.filter((p) => p.status === 'COMPLETED')
  },

  actions: {
    async fetchPayments() {
      this.loading = true
      this.error = null
      try {
        await new Promise((r) => setTimeout(r, 500))
        this.payments = [
          { id: 501, user: 'Anjali Singh', amount: 1200, status: 'COMPLETED', date: '2025-10-14' },
          { id: 502, user: 'Rohit Mehta', amount: 850, status: 'PENDING', date: '2025-10-13' },
          { id: 503, user: 'Kiran Rao', amount: 2200, status: 'PROCESSING', date: '2025-10-12' }
        ]
      } catch (e) {
        this.error = 'Error fetching payments'
      } finally {
        this.loading = false
      }
    },

    addPayment(payment) {
      payment.id = Date.now()
      payment.status = 'PENDING'
      this.payments.unshift(payment)
    },

    updateStatus(id, newStatus) {
      const payment = this.payments.find((p) => p.id === id)
      if (payment) payment.status = newStatus
    }
  }
})
