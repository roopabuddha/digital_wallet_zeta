<template>
  <div class="wallet-detail">
    <!-- HEADER -->
    <header class="header">
      <div class="left">
        <h2>🏦 Wallet Details</h2>
        <p>Track balances, view transactions, and manage payments</p>
      </div>
      <button class="back-btn" @click="goBack">← Back</button>
    </header>

    <!-- WALLET CARD -->
    <transition name="fade">
      <div v-if="wallet" class="wallet-card">
        <div class="wallet-header">
          <div>
            <h3>{{ wallet.user }}</h3>
            <p class="wallet-id">Wallet ID: #{{ wallet.id }}</p>
          </div>
          <p class="currency">{{ wallet.currency }}</p>
        </div>

        <div class="wallet-balance">
          <p class="label">Current Balance</p>
          <h1 class="amount">{{ formatCurrency(wallet.balance, wallet.currency) }}</h1>
        </div>

        <!-- ACTION BUTTONS -->
        <div class="wallet-actions" v-if="role === 'CUSTOMER'">
          <button class="add-btn" @click="goToRecharge">💰 Add Money</button>
          <button class="pay-btn" @click="goToPayment">💸 Make Payment</button>
        </div>
      </div>
    </transition>

    <!-- TRANSACTIONS -->
    <section class="transactions">
      <h3>Recent Transactions</h3>
      <ul v-if="transactions.length">
        <li v-for="txn in transactions" :key="txn.id" class="txn-item">
          <div class="txn-info">
            <span class="txn-type" :class="txn.type">{{ txn.type }}</span>
            <span class="txn-desc">{{ txn.description }}</span>
          </div>
          <strong :class="txn.type">
            {{ txn.type === 'CREDIT' ? '+' : '-' }}
            {{ formatCurrency(txn.amount, wallet.currency) }}
          </strong>
        </li>
      </ul>
      <p v-else class="empty-txn">No transactions yet 💸</p>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const wallet = ref(null)
const transactions = ref([])
const role = localStorage.getItem('auth_role') || 'CUSTOMER'

onMounted(() => {
  const wallets = JSON.parse(localStorage.getItem('wallets') || '[]')
  const walletId = parseInt(route.params.id)
  wallet.value = wallets.find((w) => w.id === walletId)

  if (!wallet.value) {
    alert('Wallet not found!')
    router.push({ name: 'WalletList' })
    return
  }

  const txnsKey = `transactions_${wallet.value.email}`
  transactions.value = JSON.parse(localStorage.getItem(txnsKey) || '[]')
})

function formatCurrency(amount, currency) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency || 'INR'
  }).format(amount)
}

function goToRecharge() {
  router.push({ name: 'WalletRecharge', params: { id: wallet.value.id } })
}

function goToPayment() {
  router.push({ name: 'PaymentNew', params: { id: wallet.value.id } })
}

function goBack() {
  router.push({ name: 'WalletList' })
}
</script>

<style scoped>
.wallet-detail {
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
  margin-bottom: 30px;
  flex-wrap: wrap;
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

/* WALLET CARD */
.wallet-card {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.05);
  margin-bottom: 30px;
}
.wallet-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.wallet-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: #111827;
}
.wallet-id {
  font-size: 13px;
  color: #94a3b8;
}
.currency {
  font-size: 13px;
  color: #06b6d4;
  font-weight: 600;
}

.wallet-balance {
  margin-top: 12px;
}
.label {
  font-size: 13px;
  color: #64748b;
}
.amount {
  font-size: 28px;
  font-weight: 700;
  margin-top: 6px;
  background: linear-gradient(90deg, #06b6d4, #4f46e5);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* ACTION BUTTONS */
.wallet-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
  gap: 12px;
}
.add-btn,
.pay-btn {
  padding: 10px 18px;
  border: none;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}
.add-btn {
  background: #16a34a;
  color: #fff;
}
.add-btn:hover {
  background: #15803d;
}
.pay-btn {
  background: #4f46e5;
  color: #fff;
}
.pay-btn:hover {
  background: #4338ca;
}

/* TRANSACTIONS */
.transactions {
  background: rgba(255, 255, 255, 0.85);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.05);
}
.transactions h3 {
  font-size: 18px;
  margin-bottom: 12px;
  color: #111827;
}
.txn-item {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #e2e8f0;
}
.txn-info {
  display: flex;
  flex-direction: column;
}
.txn-type {
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
}
.txn-type.CREDIT {
  color: #16a34a;
}
.txn-type.DEBIT {
  color: #dc2626;
}
.txn-desc {
  font-size: 13px;
  color: #475569;
}
.txn-item strong {
  font-size: 14px;
}
strong.CREDIT {
  color: #16a34a;
}
strong.DEBIT {
  color: #dc2626;
}

.empty-txn {
  text-align: center;
  margin-top: 16px;
  color: #94a3b8;
  font-size: 14px;
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
  .wallet-detail {
    padding: 20px;
  }
  .header {
    flex-direction: column;
    align-items: flex-start;
  }
  .wallet-actions {
    flex-direction: column;
    align-items: flex-end;
  }
}
</style>
