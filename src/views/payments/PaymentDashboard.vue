<template>
  <div class="finance-dashboard">
    <!-- HEADER -->
    <header class="header">
      <div class="header-left">
        <h1>💸 Finance Dashboard</h1>
        <p>Monitor transactions, track payment statuses & wallet balances.</p>
      </div>

      <div class="header-actions">
        <button class="wallet-btn" @click="goToWallets">🏦 View Wallets</button>
        <button class="logout-btn" @click="logout">Logout</button>
      </div>
    </header>

    <!-- MANAGER INFO -->
    <section class="manager-section">
      <p>Welcome back, <strong>{{ currentManager }}</strong> 💼</p>
      <p class="role">Role: <span>Finance Manager</span></p>
    </section>

    <!-- METRIC CARDS -->
    <div class="metrics">
      <div class="metric-card">
        <h3>Pending Payments</h3>
        <p>{{ pendingPayments.length }}</p>
      </div>
      <div class="metric-card">
        <h3>Processing</h3>
        <p>{{ processingPayments.length }}</p>
      </div>
      <div class="metric-card">
        <h3>Completed</h3>
        <p>{{ completedPayments.length }}</p>
      </div>
      <div class="metric-card total">
        <h3>Total Transactions</h3>
        <p>{{ payments.length }}</p>
      </div>
    </div>

    <!-- TABS -->
    <div class="tabs">
      <button
        v-for="tab in tabs"
        :key="tab"
        :class="['tab-btn', { active: activeTab === tab }]"
        @click="activeTab = tab"
      >
        {{ tab }}
      </button>
    </div>

    <!-- PAYMENT TABLE -->
    <div class="card table-container">
      <h2 class="table-title">
        {{ activeTab }} Payments
      </h2>

      <table class="payment-table">
        <thead>
          <tr>
            <th>#</th>
            <th>User</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(payment, i) in filteredPayments" :key="payment.id">
            <td>{{ i + 1 }}</td>
            <td>{{ payment.user }}</td>
            <td>{{ formatCurrency(payment.amount) }}</td>
            <td>
              <span class="status" :class="payment.status.toLowerCase()">
                {{ payment.status }}
              </span>
            </td>
            <td>{{ payment.date }}</td>
          </tr>
        </tbody>
      </table>

      <p v-if="!filteredPayments.length" class="empty-state">
        No {{ activeTab.toLowerCase() }} payments found 💳
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const activeTab = ref('PENDING')
const tabs = ['PENDING', 'PROCESSING', 'COMPLETED']
const payments = ref([])
const currentManager = localStorage.getItem('auth_email') || 'Finance Manager'

// Access Control + Data Load
onMounted(() => {
  const role = localStorage.getItem('auth_role')
  if (role !== 'FINANCE_MANAGER') {
    alert('Access denied ❌ Only Finance Managers can access this page.')
    router.push({ name: 'Login' })
    return
  }

  const saved = JSON.parse(localStorage.getItem('payments') || '[]')

  if (saved.length === 0) {
    payments.value = [
      { id: 1, user: 'Anjali Singh', amount: 1200, date: '2025-10-13', status: 'PENDING' },
      { id: 2, user: 'Rohit Mehta', amount: 2300, date: '2025-10-12', status: 'PROCESSING' },
      { id: 3, user: 'Kiran Rao', amount: 1500, date: '2025-10-11', status: 'COMPLETED' }
    ]
    localStorage.setItem('payments', JSON.stringify(payments.value))
  } else {
    payments.value = saved
  }
})

// Computed Filters
const filteredPayments = computed(() => payments.value.filter(p => p.status === activeTab.value))
const pendingPayments = computed(() => payments.value.filter(p => p.status === 'PENDING'))
const processingPayments = computed(() => payments.value.filter(p => p.status === 'PROCESSING'))
const completedPayments = computed(() => payments.value.filter(p => p.status === 'COMPLETED'))

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR'
  }).format(amount)
}

function goToWallets() {
  router.push({ name: 'WalletList' })
}

function logout() {
  localStorage.clear()
  router.push({ name: 'Login' })
}
</script>

<style scoped>
.finance-dashboard {
  min-height: 100vh;
  padding: 40px 60px;
  background: linear-gradient(135deg, #eef2ff, #f8fafc);
  color: #1e293b;
  font-family: 'Inter', sans-serif;
}

/* HEADER */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 20px;
}
.header-left h1 {
  font-size: 28px;
  background: linear-gradient(90deg, #06b6d4, #4f46e5);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.header-left p {
  font-size: 14px;
  color: #64748b;
}
.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}
.wallet-btn {
  background: linear-gradient(90deg, #4f46e5, #06b6d4);
  border: none;
  color: white;
  padding: 10px 18px;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.25s ease;
}
.wallet-btn:hover {
  transform: translateY(-2px);
}
.logout-btn {
  background: linear-gradient(90deg, #ef4444, #b91c1c);
  border: none;
  color: white;
  padding: 10px 18px;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.25s ease;
}
.logout-btn:hover {
  transform: translateY(-2px);
}

/* MANAGER SECTION */
.manager-section {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(6px);
  border-radius: 14px;
  padding: 16px 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  margin-bottom: 24px;
}
.manager-section p {
  margin: 4px 0;
}
.manager-section .role span {
  color: #4f46e5;
  font-weight: 600;
}

/* METRIC CARDS */
.metrics {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}
.metric-card {
  background: rgba(255, 255, 255, 0.85);
  border-radius: 14px;
  padding: 20px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}
.metric-card h3 {
  font-size: 14px;
  color: #475569;
  margin-bottom: 8px;
}
.metric-card p {
  font-size: 20px;
  font-weight: 700;
  color: #1e293b;
}
.metric-card.total {
  background: linear-gradient(90deg, #06b6d4, #4f46e5);
  color: white;
}

/* TABS */
.tabs {
  display: flex;
  gap: 12px;
  margin-bottom: 18px;
}
.tab-btn {
  border: none;
  padding: 10px 16px;
  border-radius: 10px;
  font-weight: 600;
  color: #475569;
  background: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  transition: all 0.2s ease;
}
.tab-btn.active {
  background: linear-gradient(90deg, #06b6d4, #4f46e5);
  color: white;
}
.tab-btn:hover {
  transform: translateY(-2px);
}

/* TABLE */
.table-container {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 16px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}
.table-title {
  font-size: 18px;
  font-weight: 600;
  padding: 16px 20px;
  border-bottom: 1px solid #e2e8f0;
}
.payment-table {
  width: 100%;
  border-collapse: collapse;
}
.payment-table th {
  background: #f1f5f9;
  color: #475569;
  text-transform: uppercase;
  font-size: 13px;
  padding: 14px;
  text-align: left;
}
.payment-table td {
  padding: 14px;
  font-size: 14px;
  border-top: 1px solid #e2e8f0;
}
tr:nth-child(even) {
  background: #f9fafb;
}
tr:hover {
  background: #eef2ff;
}

/* STATUS BADGES */
.status {
  padding: 4px 10px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}
.status.pending {
  background: #fee2e2;
  color: #b91c1c;
}
.status.processing {
  background: #fef9c3;
  color: #854d0e;
}
.status.completed {
  background: #dcfce7;
  color: #15803d;
}

/* EMPTY STATE */
.empty-state {
  text-align: center;
  padding: 24px;
  font-size: 14px;
  color: #94a3b8;
}

/* RESPONSIVE */
@media (max-width: 768px) {
  .finance-dashboard {
    padding: 20px;
  }
  .metrics {
    grid-template-columns: 1fr 1fr;
  }
  .payment-table th,
  .payment-table td {
    padding: 10px;
  }
}
</style>
