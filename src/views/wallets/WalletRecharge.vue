<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="wallet-recharge">
    <!-- HEADER -->
    <header class="header">
      <div class="title-section">
        <h1>💰 Wallet Recharge</h1>
        <p>Instantly add funds to your wallet</p>
      </div>
      <button class="back-btn" @click="goBack">← Back</button>
    </header>

    <!-- RECHARGE FORM CARD -->
    <div class="form-card">
      <h2 class="form-title">Add Money</h2>
      <p class="subtitle">Enter amount and confirm your recharge</p>

      <form @submit.prevent="rechargeWallet">
        <div class="form-group">
          <label>Amount (₹)</label>
          <input
            type="number"
            v-model.number="amount"
            min="1"
            placeholder="Enter amount (e.g. 500)"
            required
          />
        </div>

        <div class="form-group">
          <label>Payment Method</label>
          <select v-model="method" required>
            <option value="">Select Method</option>
            <option value="UPI">UPI</option>
            <option value="Credit Card">Credit Card</option>
            <option value="Debit Card">Debit Card</option>
          </select>
        </div>

        <div class="actions">
          <button type="submit" class="btn-primary" :disabled="loading">
            <span v-if="!loading">⚡ Add Money</span>
            <span v-else class="loader"></span>
          </button>
          <button type="button" class="btn-secondary" @click="goBack">
            Cancel
          </button>
        </div>
      </form>

      <transition name="fade">
        <p v-if="message" class="success-msg">{{ message }}</p>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const amount = ref('')
const method = ref('')
const loading = ref(false)
const message = ref('')

async function rechargeWallet() {
  const email = localStorage.getItem('auth_email')
  if (!email) {
    router.push({ name: 'Login' })
    return
  }

  const amt = parseFloat(amount.value)
  if (isNaN(amt) || amt <= 0) {
    message.value = '⚠️ Enter a valid amount above ₹0'
    return
  }

  loading.value = true

  setTimeout(() => {
    const wallets = JSON.parse(localStorage.getItem('wallets') || '[]')
    const walletIndex = wallets.findIndex((w) => w.userEmail === email)

    if (walletIndex === -1) {
      message.value = 'Wallet not found'
      loading.value = false
      return
    }

    // ✅ Update wallet balance
    wallets[walletIndex].balance += amt
    localStorage.setItem('wallets', JSON.stringify(wallets))

    // ✅ Add transaction record
    const txnsKey = `transactions_${email}`
    const txns = JSON.parse(localStorage.getItem(txnsKey) || '[]')
    txns.unshift({
      id: Date.now(),
      type: 'CREDIT',
      description: `Recharge via ${method.value}`,
      amount: amt,
      date: new Date().toLocaleString()
    })
    localStorage.setItem(txnsKey, JSON.stringify(txns))

    message.value = `✅ ₹${amt.toFixed(2)} added successfully!`

    // Redirect after 1.2s
    setTimeout(() => {
      router.push({ name: 'MyWallet' })
    }, 1200)

    loading.value = false
  }, 900)
}

function goBack() {
  router.push({ name: 'MyWallet' })
}
</script>

<style scoped>
.wallet-recharge {
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
  margin-bottom: 30px;
  flex-wrap: wrap;
}
.title-section h1 {
  font-size: 28px;
  background: linear-gradient(90deg, #06b6d4, #4f46e5);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.title-section p {
  color: #64748b;
  font-size: 14px;
}
.back-btn {
  background: linear-gradient(90deg, #ef4444, #b91c1c);
  border: none;
  padding: 10px 18px;
  border-radius: 10px;
  color: #fff;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}
.back-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 14px rgba(239, 68, 68, 0.3);
}

/* FORM CARD */
.form-card {
  background: #ffffffcc;
  backdrop-filter: blur(8px);
  border-radius: 14px;
  max-width: 480px;
  margin: 0 auto;
  padding: 30px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.05);
  text-align: left;
}
.form-title {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 6px;
  color: #111827;
}
.subtitle {
  font-size: 14px;
  color: #64748b;
  margin-bottom: 20px;
}

/* INPUTS */
.form-group {
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
}
label {
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 6px;
  color: #334155;
}
input,
select {
  padding: 10px 14px;
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  font-size: 14px;
  outline: none;
  transition: 0.2s ease;
}
input:focus,
select:focus {
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
}

/* BUTTONS */
.actions {
  display: flex;
  justify-content: center;
  gap: 10px;
}
.btn-primary {
  background: linear-gradient(90deg, #06b6d4, #4f46e5);
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s ease;
}
.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 14px rgba(79, 70, 229, 0.3);
}
.btn-secondary {
  background: #f1f5f9;
  border: 1px solid #cbd5e1;
  color: #475569;
  padding: 10px 16px;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s ease;
}
.btn-secondary:hover {
  background: #e2e8f0;
}

/* SUCCESS MSG */
.success-msg {
  text-align: center;
  margin-top: 18px;
  color: #16a34a;
  font-weight: 600;
  font-size: 14px;
}

/* LOADER */
.loader {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: inline-block;
  border: 2px solid rgba(255, 255, 255, 0.4);
  border-left-color: transparent;
  animation: spin 0.9s linear infinite;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* RESPONSIVE */
@media (max-width: 768px) {
  .wallet-recharge {
    padding: 20px;
  }
  .form-card {
    padding: 24px;
  }
}
</style>
