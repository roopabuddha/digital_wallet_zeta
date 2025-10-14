<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="wallet-dashboard">
    <!-- HEADER -->
    <header class="header">
      <div class="title-section">
        <h1>👛 My Wallet</h1>
        <p>View your balance and transaction history</p>
      </div>
      <div class="header-actions">
        <button class="btn add" @click="goToRecharge">➕ Add Money</button>
        <button class="btn pay" @click="goToPayment">💸 Make Payment</button>
        <button class="btn logout" @click="logout">Logout</button>
      </div>
    </header>

    <!-- WALLET CARD -->
    <transition name="fade-slide" appear>
      <div v-if="wallet" class="wallet-card">
        <div class="wallet-top">
          <div>
            <h3>{{ wallet.userEmail }}</h3>
            <p>Wallet ID: #{{ wallet.id }}</p>
          </div>
        </div>
        <div class="wallet-balance">
          <h1>{{ formatCurrency(wallet.balance) }}</h1>
          <p class="currency">{{ wallet.currency }}</p>
        </div>
      </div>
    </transition>

    <!-- TRANSACTIONS -->
    <section class="transactions-section">
      <h4>Recent Transactions</h4>
      <transition-group name="fade-list" tag="ul" class="txn-list">
        <li v-for="txn in recentTransactions" :key="txn.id" class="txn-item">
          <div class="txn-info">
            <span :class="['type', txn.type]">
              {{ txn.type === 'CREDIT' ? '⬆ Credit' : '⬇ Debit' }}
            </span>
            <p>{{ txn.description }}</p>
          </div>
          <strong :class="txn.type">
            {{ txn.type === 'CREDIT' ? '+' : '-' }}
            {{ formatCurrency(txn.amount) }}
          </strong>
        </li>
      </transition-group>

      <p v-if="!recentTransactions.length" class="no-txn">No transactions yet 💸</p>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const wallet = ref(null)
const recentTransactions = ref([])

onMounted(() => {
  const email = localStorage.getItem('auth_email')
  if (!email) {
    router.push({ name: 'Login' })
    return
  }

  const wallets = JSON.parse(localStorage.getItem('wallets') || '[]')
  let currentWallet = wallets.find((w) => w.userEmail === email)

  if (!currentWallet) {
    currentWallet = {
      id: wallets.length + 1,
      userEmail: email,
      balance: 0,
      currency: 'INR'
    }
    wallets.push(currentWallet)
    localStorage.setItem('wallets', JSON.stringify(wallets))
  }

  wallet.value = currentWallet

  const txnsKey = `transactions_${email}`
  const userTxns = JSON.parse(localStorage.getItem(txnsKey) || '[]')
  recentTransactions.value = userTxns.reverse().slice(0, 6)
})

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR'
  }).format(amount)
}

function goToPayment() {
  router.push({ name: 'PaymentNew' })
}

function goToRecharge() {
  router.push({ name: 'WalletRecharge' })
}

function logout() {
  localStorage.clear()
  router.push({ name: 'Login' })
}
</script>

<style scoped>
.wallet-dashboard {
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
.header-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

/* BUTTONS */
.btn {
  border: none;
  border-radius: 10px;
  padding: 10px 16px;
  font-weight: 600;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;
}
.add {
  background: linear-gradient(90deg, #06b6d4, #4f46e5);
  color: white;
}
.pay {
  background: linear-gradient(90deg, #4f46e5, #06b6d4);
  color: white;
}
.logout {
  background: linear-gradient(90deg, #ef4444, #b91c1c);
  color: white;
}
.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.15);
}

/* WALLET CARD */
.wallet-card {
  background: #ffffffcc;
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
  text-align: center;
  animation: fadeIn 0.6s ease;
}
.wallet-card h3 {
  font-size: 18px;
  color: #1e293b;
}
.wallet-card p {
  color: #64748b;
  font-size: 13px;
}
.wallet-balance h1 {
  font-size: 36px;
  background: linear-gradient(90deg, #06b6d4, #4f46e5);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 14px 0 6px;
}
.currency {
  color: #64748b;
  font-size: 14px;
}

/* TRANSACTIONS */
.transactions-section {
  margin-top: 40px;
}
.transactions-section h4 {
  font-size: 18px;
  font-weight: 600;
  color: #334155;
  margin-bottom: 16px;
}
.txn-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
.txn-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #ffffffb3;
  border-radius: 12px;
  padding: 12px 16px;
  margin-bottom: 10px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.txn-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.15);
}
.txn-info p {
  font-size: 13px;
  color: #475569;
}
.type {
  display: inline-block;
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 2px;
}
.CREDIT {
  color: #16a34a;
}
.DEBIT {
  color: #dc2626;
}
.txn-item strong {
  font-size: 14px;
  font-weight: 600;
}
.no-txn {
  text-align: center;
  color: #94a3b8;
  font-size: 14px;
  margin-top: 20px;
}

/* ANIMATIONS */
.fade-slide-enter-active {
  transition: all 0.6s ease;
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.fade-list-enter-active,
.fade-list-leave-active {
  transition: all 0.3s ease;
}
.fade-list-enter-from,
.fade-list-leave-to {
  opacity: 0;
  transform: translateY(6px);
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
  .wallet-dashboard {
    padding: 20px;
  }
  .header {
    flex-direction: column;
    align-items: flex-start;
  }
  .header-actions {
    margin-top: 10px;
  }
}
</style>
