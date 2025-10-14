import { defineStore } from 'pinia'
import router from '@/router'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('auth_token') || null,
    role: localStorage.getItem('auth_role') || null,
    user: null,
    loading: false,
    error: null
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    isAdmin: (state) => state.role === 'ADMIN',
    isFinance: (state) => state.role === 'FINANCE_MANAGER',
    isCustomer: (state) => state.role === 'CUSTOMER'
  },

  actions: {
    async login(email, password, role) {
      this.loading = true
      this.error = null
      try {
        // Simulated API call (replace with axios POST /login)
        await new Promise((r) => setTimeout(r, 800))
        const token = 'demo-token-' + Math.random().toString(36).substring(2)
        this.token = token
        this.role = role
        localStorage.setItem('auth_token', token)
        localStorage.setItem('auth_role', role)

        // Redirect based on role
        if (role === 'ADMIN') router.push({ name: 'AdminUsers' })
        else if (role === 'FINANCE_MANAGER') router.push({ name: 'PaymentDashboard' })
        else router.push({ name: 'MyWallet' })
      } catch (err) {
        this.error = 'Invalid login'
        console.error(err)
      } finally {
        this.loading = false
      }
    },

    logout() {
      this.token = null
      this.role = null
      this.user = null
      localStorage.removeItem('auth_token')
      localStorage.removeItem('auth_role')
      router.push({ name: 'Login' })
    }
  }
})
