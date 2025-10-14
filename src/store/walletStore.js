import { defineStore } from 'pinia'

export const useWalletStore = defineStore('wallet', {
  state: () => ({
    wallets: [],
    loading: false,
    error: null
  }),

  actions: {
    async fetchWallets() {
      this.loading = true
      this.error = null
      try {
        // Mock API
        await new Promise((r) => setTimeout(r, 600))
        this.wallets = [
          { id: 101, user: 'Anjali Singh', balance: 4500, currency: 'INR' },
          { id: 102, user: 'Rohit Mehta', balance: 9820, currency: 'INR' },
          { id: 103, user: 'Kiran Rao', balance: 2650, currency: 'INR' }
        ]
      } catch (e) {
        this.error = 'Unable to load wallets'
      } finally {
        this.loading = false
      }
    },

    createWallet(wallet) {
      wallet.id = Date.now()
      this.wallets.push(wallet)
    },

    updateWallet(wallet) {
      const index = this.wallets.findIndex((w) => w.id === wallet.id)
      if (index !== -1) this.wallets[index] = wallet
    },

    deleteWallet(id) {
      this.wallets = this.wallets.filter((w) => w.id !== id)
    }
  }
})
