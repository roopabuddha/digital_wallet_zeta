<template>
  <div class="wallet-form-page">
    <!-- HEADER -->
    <header class="header">
      <div class="left">
        <h2>{{ isEdit ? '✏️ Update Wallet' : '➕ Create Wallet' }}</h2>
        <p>{{ isEdit ? 'Modify existing wallet details' : 'Add a new wallet for a customer' }}</p>
      </div>
      <button class="back-btn" @click="goBack">← Back</button>
    </header>

    <!-- FORM CARD -->
    <form class="wallet-form" @submit.prevent="saveWallet">
      <div class="form-group">
        <label>User Name</label>
        <input
          v-model="form.user"
          type="text"
          placeholder="Enter customer name"
          required
        />
      </div>

      <div class="form-group">
        <label>Email</label>
        <input
          v-model="form.email"
          type="email"
          placeholder="Enter email address"
          required
        />
      </div>

      <div class="form-group">
        <label>Initial Balance ({{ form.currency }})</label>
        <input
          v-model.number="form.balance"
          type="number"
          min="0"
          placeholder="Enter wallet balance"
          required
        />
      </div>

      <div class="form-group">
        <label>Currency</label>
        <select v-model="form.currency" required>
          <option value="INR">INR (₹)</option>
          <option value="USD">USD ($)</option>
          <option value="EUR">EUR (€)</option>
        </select>
      </div>

      <button class="save-btn" type="submit">
        {{ isEdit ? '💾 Update Wallet' : '🚀 Create Wallet' }}
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()
const form = ref({
  user: '',
  email: '',
  balance: 0,
  currency: 'INR'
})
const isEdit = ref(false)

onMounted(() => {
  const role = localStorage.getItem('auth_role')
  if (role !== 'ADMIN') {
    alert('Access denied ❌ Only Admins can manage wallets.')
    router.push({ name: 'Login' })
    return
  }

  const walletId = route.query.editId ? parseInt(route.query.editId) : null
  const wallets = JSON.parse(localStorage.getItem('wallets') || '[]')

  if (walletId) {
    const wallet = wallets.find((w) => w.id === walletId)
    if (wallet) {
      form.value = { ...wallet }
      isEdit.value = true
    }
  }
})

function saveWallet() {
  const wallets = JSON.parse(localStorage.getItem('wallets') || '[]')

  if (!form.value.user || !form.value.email) {
    alert('Please fill all required fields!')
    return
  }

  if (isEdit.value) {
    // Update existing wallet
    const index = wallets.findIndex((w) => w.id === form.value.id)
    if (index !== -1) {
      wallets[index] = { ...form.value }
      localStorage.setItem('wallets', JSON.stringify(wallets))
      alert('✅ Wallet updated successfully!')
    }
  } else {
    // Create new wallet
    const newWallet = {
      id: wallets.length ? wallets[wallets.length - 1].id + 1 : 1,
      user: form.value.user,
      email: form.value.email,
      balance: form.value.balance,
      currency: form.value.currency
    }
    wallets.push(newWallet)
    localStorage.setItem('wallets', JSON.stringify(wallets))
    alert('🎉 Wallet created successfully!')
  }

  router.push({ name: 'WalletList' })
}

function goBack() {
  router.push({ name: 'WalletList' })
}
</script>

<style scoped>
.wallet-form-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc, #e2e8f0);
  color: #1e293b;
  padding: 40px 60px;
  font-family: "Inter", sans-serif;
}

/* HEADER */
.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  margin-bottom: 30px;
}
.left h2 {
  font-size: 26px;
  background: linear-gradient(90deg, #4f46e5, #06b6d4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0;
}
.left p {
  color: #64748b;
  font-size: 14px;
  margin-top: 4px;
}
.back-btn {
  background: linear-gradient(90deg, #4f46e5, #06b6d4);
  color: #fff;
  border: none;
  padding: 10px 16px;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}
.back-btn:hover {
  transform: translateY(-2px);
}

/* FORM */
.wallet-form {
  background: #ffffffcc;
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 30px;
  max-width: 550px;
  margin: auto;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.05);
}
.form-group {
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
}
label {
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 6px;
}
input,
select {
  padding: 10px 14px;
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  font-size: 14px;
  outline: none;
  background: #fff;
}
input:focus,
select:focus {
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.2);
}

/* BUTTON */
.save-btn {
  width: 100%;
  background: linear-gradient(90deg, #06b6d4, #4f46e5);
  color: #fff;
  border: none;
  padding: 12px;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease;
}
.save-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
}

/* ANIMATION */
.fade-enter-active {
  animation: fadeIn 0.5s ease;
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
  .wallet-form-page {
    padding: 20px;
  }
  .wallet-form {
    padding: 20px;
  }
}
</style>
