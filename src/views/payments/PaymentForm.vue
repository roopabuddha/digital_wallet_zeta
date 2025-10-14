<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="payment-dashboard">
    <!-- HEADER -->
    <header class="header">
      <div class="title-section">
        <h1>💳 Make a Payment</h1>
        <p>Transfer funds securely from your wallet</p>
      </div>
      <button class="btn back" @click="goBack">← Back to Wallet</button>
    </header>

    <!-- PAYMENT FORM -->
    <transition name="fade">
      <div class="form-card" v-if="visible">
        <form @submit.prevent="submitPayment">
          <div class="form-group">
            <label>Receiver Name</label>
            <input
              v-model="receiver"
              placeholder="Enter recipient name"
              required
            />
          </div>

          <div class="form-group">
            <label>Amount (INR)</label>
            <input
              v-model.number="amount"
              type="number"
              placeholder="Enter amount"
              min="1"
              required
            />
          </div>

          <div class="form-group">
            <label>Description</label>
            <input
              v-model="description"
              placeholder="e.g., Payment for groceries"
              required
            />
          </div>

          <p class="balance-info">
            💰 Your Balance:
            <strong>{{ formatCurrency(wallet.balance) }}</strong>
          </p>

          <button class="btn-primary" :disabled="loading">
            <span v-if="!loading">🚀 Pay Now</span>
            <span v-else class="loader"></span>
          </button>

          <p v-if="error" class="error-msg">{{ error }}</p>
          <p v-if="success" class="success-msg">{{ success }}</p>
        </form>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const visible = ref(false)
const loading = ref(false)
const receiver = ref('')
const amount = ref(0)
const description = ref('')
const wallet = ref({ balance: 0 })
const error = ref('')
const success = ref('')

onMounted(() => {
  const email = localStorage.getItem('auth_email')
  const role = localStorage.getItem('auth_role')

  // Restrict non-customers
  if (role !== 'CUSTOMER') {
    alert('Only customers can make payments.')
    router.push({ name: 'Login' })
    return
  }

  const wallets = JSON.parse(localStorage.getItem('wallets') || '[]')
  const current = wallets.find((w) => w.userEmail === email)
  if (!current) {
    alert('No wallet found for this account.')
    router.push({ name: 'MyWallet' })
    return
  }

  wallet.value = current
  setTimeout(() => (visible.value = true), 100)
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

function submitPayment() {
  error.value = ''
  success.value = ''

  if (!receiver.value || !amount.value || amount.value <= 0) {
    error.value = '⚠️ Please fill all fields properly.'
    return
  }

  if (amount.value > wallet.value.balance) {
    error.value = '❌ Insufficient balance in your wallet.'
    return
  }

  loading.value = true
  setTimeout(() => {
    const email = localStorage.getItem('auth_email')
    const wallets = JSON.parse(localStorage.getItem('wallets') || '[]')
    const currentWallet = wallets.find((w) => w.userEmail === email)

    if (!currentWallet) {
      error.value = 'Wallet not found.'
      loading.value = false
      return
    }

    // Deduct amount
    currentWallet.balance -= amount.value
    localStorage.setItem('wallets', JSON.stringify(wallets))

    // Add transaction record
    const key = `transactions_${email}`
    const txns = JSON.parse(localStorage.getItem(key) || '[]')
    txns.unshift({
      id: Date.now(),
      type: 'DEBIT',
      description: description.value || `Payment to ${receiver.value}`,
      amount: amount.value,
      date: new Date().toLocaleString()
    })
    localStorage.setItem(key, JSON.stringify(txns))

    // Update UI
    wallet.value.balance = currentWallet.balance
    success.value = `✅ Payment of ${formatCurrency(amount.value)} sent to ${receiver.value}.`
    receiver.value = ''
    amount.value = 0
    description.value = ''
    loading.value = false
  }, 1000)
}
</script>

<style scoped>
.payment-dashboard {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc, #e2e8f0);
  color: #1e293b;
  font-family: "Inter", sans-serif;
  padding: 40px 60px;
}

/* HEADER */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 30px;
}
.title-section h1 {
  font-size: 28px;
  background: linear-gradient(90deg, #06b6d4, #4f46e5);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.title-section p {
  font-size: 14px;
  color: #64748b;
}
.btn.back {
  background: linear-gradient(90deg, #ef4444, #b91c1c);
  color: #fff;
  border: none;
  padding: 10px 16px;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s ease;
}
.btn.back:hover {
  transform: translateY(-2px);
}

/* FORM CARD */
.form-card {
  background: #ffffffcc;
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 30px;
  max-width: 480px;
  margin: auto;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.05);
  animation: fadeIn 0.5s ease;
}

/* INPUTS */
.form-group {
  margin-bottom: 18px;
  display: flex;
  flex-direction: column;
}
label {
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 6px;
  color: #334155;
}
input {
  padding: 10px 14px;
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  font-size: 14px;
  outline: none;
  transition: 0.2s ease;
}
input:focus {
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
}

.balance-info {
  font-size: 14px;
  margin: 10px 0;
  color: #475569;
}
.balance-info strong {
  color: #111827;
}

/* BUTTONS */
.btn-primary {
  width: 100%;
  background: linear-gradient(90deg, #06b6d4, #4f46e5);
  color: #fff;
  border: none;
  padding: 12px;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s ease;
}
.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 14px rgba(79, 70, 229, 0.25);
}

/* FEEDBACK MESSAGES */
.error-msg {
  color: #ef4444;
  text-align: center;
  margin-top: 12px;
  font-size: 14px;
  font-weight: 500;
}
.success-msg {
  color: #16a34a;
  text-align: center;
  margin-top: 12px;
  font-size: 14px;
  font-weight: 500;
}

/* LOADER */
.loader {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.4);
  border-left-color: transparent;
  animation: spin 0.9s linear infinite;
  display: inline-block;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* ANIMATION */
.fade-enter-active {
  animation: fadeIn 0.4s ease;
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* RESPONSIVE */
@media (max-width: 768px) {
  .payment-dashboard {
    padding: 20px;
  }
  .form-card {
    padding: 24px;
  }
}
</style>
