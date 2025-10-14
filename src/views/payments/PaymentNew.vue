<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="payment-page">
    <header class="page-header">
      <h2>💸 Make a Payment</h2>
      <button class="btn-back" @click="goBack">← Back to Wallet</button>
    </header>

    <transition name="fade-slide" appear>
      <div class="payment-card" v-if="wallet">
        <div class="wallet-info">
          <p class="wallet-id">Wallet ID: #{{ wallet.id }}</p>
          <h3>Available Balance</h3>
          <h1 class="balance">{{ formatCurrency(wallet.balance) }}</h1>
        </div>

        <div class="divider"></div>

        <form @submit.prevent="makePayment" class="payment-form">
          <div class="field">
            <label>Recipient Name</label>
            <input
              v-model="recipient"
              type="text"
              placeholder="e.g. Flipkart, Amazon, etc."
              required
            />
          </div>

          <div class="field">
            <label>Amount (INR)</label>
            <input
              v-model.number="amount"
              type="number"
              min="1"
              step="1"
              placeholder="Enter amount"
              required
            />
          </div>

          <div class="actions">
            <button type="submit" class="pay-btn" :disabled="loading">
              <span v-if="!loading">Pay Now</span>
              <span v-else class="loader"></span>
            </button>

            <button type="button" class="add-btn" @click="showRechargeModal = true">
              + Add Money
            </button>
          </div>

          <p v-if="error" class="error-msg">{{ error }}</p>
          <p v-if="success" class="success-msg">{{ success }}</p>
        </form>
      </div>
    </transition>

    <!-- 💰 Recharge Modal -->
    <transition name="fade">
      <div v-if="showRechargeModal" class="modal-overlay">
        <div class="modal">
          <h3>Add Money to Wallet</h3>
          <p class="subtext">Enter the amount you’d like to add</p>
          <input
            v-model.number="rechargeAmount"
            type="number"
            min="1"
            placeholder="Enter amount in ₹"
          />
          <div class="modal-actions">
            <button class="modal-btn confirm" @click="addMoney">Add</button>
            <button class="modal-btn cancel" @click="closeModal">Cancel</button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const wallet = ref(null)
const amount = ref(0)
const recipient = ref('')
const loading = ref(false)
const error = ref('')
const success = ref('')
const showRechargeModal = ref(false)
const rechargeAmount = ref(null)

onMounted(() => {
  const email = localStorage.getItem('auth_email')
  if (!email) {
    router.push({ name: 'Login' })
    return
  }

  const wallets = JSON.parse(localStorage.getItem('wallets') || '[]')
  const currentWallet = wallets.find(w => w.userEmail === email)
  if (!currentWallet) {
    error.value = 'Wallet not found.'
    return
  }
  wallet.value = currentWallet
})

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR'
  }).format(amount)
}

function goBack() {
  router.push({ name: 'MyWallet' })
}

function closeModal() {
  showRechargeModal.value = false
  rechargeAmount.value = null
}

function addMoney() {
  if (!rechargeAmount.value || rechargeAmount.value <= 0) {
    alert('Enter a valid amount to add.')
    return
  }

  const email = localStorage.getItem('auth_email')
  const wallets = JSON.parse(localStorage.getItem('wallets') || '[]')
  const userWallet = wallets.find(w => w.userEmail === email)

  if (userWallet) {
    userWallet.balance += rechargeAmount.value
    localStorage.setItem('wallets', JSON.stringify(wallets))
    wallet.value.balance = userWallet.balance

    const txKey = `transactions_${email}`
    const transactions = JSON.parse(localStorage.getItem(txKey) || '[]')
    transactions.push({
      id: Date.now(),
      type: 'CREDIT',
      description: 'Wallet Recharge',
      amount: rechargeAmount.value,
      date: new Date().toLocaleString()
    })
    localStorage.setItem(txKey, JSON.stringify(transactions))

    success.value = `✅ ₹${rechargeAmount.value} added successfully!`
    closeModal()
    setTimeout(() => (success.value = ''), 2500)
  }
}

function makePayment() {
  error.value = ''
  success.value = ''

  if (!recipient.value.trim()) {
    error.value = 'Enter recipient name.'
    return
  }

  if (amount.value <= 0) {
    error.value = 'Enter valid amount.'
    return
  }

  const email = localStorage.getItem('auth_email')
  const wallets = JSON.parse(localStorage.getItem('wallets') || '[]')
  const userWallet = wallets.find(w => w.userEmail === email)

  if (!userWallet) {
    error.value = 'Wallet not found.'
    return
  }

  if (userWallet.balance < amount.value) {
    error.value = '❌ Insufficient balance! Please add funds.'
    return
  }

  loading.value = true

  setTimeout(() => {
    userWallet.balance -= amount.value
    localStorage.setItem('wallets', JSON.stringify(wallets))
    wallet.value.balance = userWallet.balance

    const txKey = `transactions_${email}`
    const transactions = JSON.parse(localStorage.getItem(txKey) || '[]')
    transactions.push({
      id: Date.now(),
      type: 'DEBIT',
      description: `Payment to ${recipient.value}`,
      amount: amount.value,
      date: new Date().toLocaleString()
    })
    localStorage.setItem(txKey, JSON.stringify(transactions))

    success.value = `✅ Payment of ${formatCurrency(amount.value)} to ${recipient.value} successful!`
    amount.value = 0
    recipient.value = ''
    loading.value = false
    setTimeout(() => (success.value = ''), 3000)
  }, 1000)
}
</script>

<style scoped>
.payment-page {
  min-height: 100vh;
  padding: 40px;
  background: linear-gradient(180deg, #0f172a 0%, #071033 70%);
  color: #e6eef8;
  font-family: 'Inter', sans-serif;
  animation: fadeIn 0.6s ease;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}
.page-header h2 {
  font-size: 24px;
  color: #fff;
}
.btn-back {
  background: rgba(255, 255, 255, 0.08);
  border: none;
  color: #cbd5e1;
  padding: 8px 14px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.25s ease;
}
.btn-back:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-2px);
}

.payment-card {
  background: rgba(255, 255, 255, 0.06);
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
  max-width: 480px;
  margin: 0 auto;
  backdrop-filter: blur(10px);
}

.wallet-info {
  text-align: center;
}
.wallet-id {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
}
.balance {
  font-size: 38px;
  font-weight: 700;
  background: linear-gradient(90deg, #06b6d4, #4f46e5);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
  margin: 24px 0;
}

.field {
  margin-bottom: 20px;
}
.field label {
  display: block;
  font-size: 13px;
  color: rgba(230, 238, 248, 0.8);
  margin-bottom: 6px;
}
.field input {
  width: 100%;
  padding: 12px 14px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.05);
  color: #fff;
  outline: none;
  transition: all 0.25s ease;
}
.field input:focus {
  border-color: #06b6d4;
  box-shadow: 0 0 10px rgba(6, 182, 212, 0.3);
}

.actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-top: 16px;
}
.pay-btn {
  background: linear-gradient(90deg, #06b6d4, #4f46e5);
  border: none;
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 600;
  color: #fff;
  cursor: pointer;
}
.add-btn {
  background: rgba(255, 255, 255, 0.08);
  border: none;
  color: #67e8f9;
  padding: 12px 20px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.25s ease;
}
.add-btn:hover {
  background: rgba(6, 182, 212, 0.15);
  transform: translateY(-2px);
}

.error-msg {
  color: #f87171;
  font-size: 13px;
  text-align: center;
  margin-top: 14px;
}
.success-msg {
  color: #22c55e;
  font-size: 13px;
  text-align: center;
  margin-top: 14px;
}

/* 💰 Modal styles */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}
.modal {
  background: #1e293b;
  border-radius: 14px;
  padding: 24px;
  text-align: center;
  width: 320px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.6);
}
.modal h3 {
  font-size: 18px;
  color: #fff;
  margin-bottom: 6px;
}
.subtext {
  color: #94a3b8;
  font-size: 13px;
  margin-bottom: 14px;
}
.modal input {
  width: 100%;
  padding: 10px;
  border-radius: 10px;
  border: none;
  outline: none;
  text-align: center;
  font-size: 16px;
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
  margin-bottom: 14px;
}
.modal-actions {
  display: flex;
  justify-content: space-between;
}
.modal-btn {
  flex: 1;
  padding: 10px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  font-weight: 600;
}
.modal-btn.confirm {
  background: linear-gradient(90deg, #06b6d4, #4f46e5);
  color: #fff;
  margin-right: 8px;
}
.modal-btn.cancel {
  background: rgba(255, 255, 255, 0.08);
  color: #94a3b8;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
