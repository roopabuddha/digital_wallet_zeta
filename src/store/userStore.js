import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    users: [],
    loading: false,
    error: null
  }),

  actions: {
    async fetchUsers() {
      this.loading = true
      this.error = null
      try {
        // Simulate API fetch
        await new Promise((r) => setTimeout(r, 500))
        this.users = [
          { id: 1, name: 'Rohit Mehta', email: 'rohit@wallet.com', role: 'ADMIN', active: true },
          { id: 2, name: 'Anjali Singh', email: 'anjali@wallet.com', role: 'CUSTOMER', active: true },
          { id: 3, name: 'Kiran Rao', email: 'kiran@wallet.com', role: 'FINANCE_MANAGER', active: false }
        ]
      } catch (err) {
        this.error = 'Failed to fetch users'
      } finally {
        this.loading = false
      }
    },

    addUser(newUser) {
      newUser.id = Date.now()
      this.users.push(newUser)
    },

    updateUser(updatedUser) {
      const index = this.users.findIndex((u) => u.id === updatedUser.id)
      if (index !== -1) this.users[index] = updatedUser
    },

    deleteUser(id) {
      this.users = this.users.filter((u) => u.id !== id)
    }
  }
})
