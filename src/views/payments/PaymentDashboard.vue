<template>
  <div class="finance-dashboard">
    <!-- HEADER -->
    <header class="header">
      <div class="header-left">
        <h1>Finance Dashboard</h1>
        <p>Monitor transactions, track payment statuses & wallet balances.</p>
      </div>

      <div class="header-actions">
        <button class="wallet-btn" @click="goToWallets">View Wallets</button>
        <button class="logout-btn" @click="logout">Logout</button>
      </div>
    </header>

    <!-- MANAGER INFO -->
    <section class="manager-section">
      <p>Welcome back, <strong>{{ currentManager }}</strong></p>
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
      <h2 class="table-title">{{ activeTab }} Payments</h2>

      <table class="payment-table">
        <thead>
          <tr>
            <th>#</th>
            <th>User</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Date</th>
            <th>Action</th>
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
            <td>
              <!-- Dropdown to change payment status -->
              <select
                v-model="payment.status"
                @change="updateStatus(payment)"
                class="status-dropdown"
              >
                <option value="PENDING">PENDING</option>
                <option value="PROCESSING">PROCESSING</option>
                <option value="COMPLETED">COMPLETED</option>
              </select>
            </td>
          </tr>
        </tbody>
      </table>

      <p v-if="!filteredPayments.length" class="empty-state">
        No {{ activeTab.toLowerCase() }} payments found.
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

// Load payments and validate access
onMounted(() => {
  const role = localStorage.getItem('auth_role')
  if (role !== 'FINANCE_MANAGER') {
    alert('Access denied. Only Finance Managers can access this page.')
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

// Computed payment filters
const filteredPayments = computed(() => payments.value.filter(p => p.status === activeTab.value))
const pendingPayments = computed(() => payments.value.filter(p => p.status === 'PENDING'))
const processingPayments = computed(() => payments.value.filter(p => p.status === 'PROCESSING'))
const completedPayments = computed(() => payments.value.filter(p => p.status === 'COMPLETED'))

// Currency formatter
function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR'
  }).format(amount)
}

// Update status and persist to localStorage
function updateStatus(payment) {
  const updated = payments.value.map(p =>
    p.id === payment.id ? { ...p, status: payment.status } : p
  )
  payments.value = updated
  localStorage.setItem('payments', JSON.stringify(updated))
  alert(`Status updated to ${payment.status}`)
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

/* Header */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
}
.header-left h1 {
  font-size: 26px;
  background: linear-gradient(90deg, #06b6d4, #4f46e5);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.header-left p {
  color: #64748b;
  font-size: 14px;
}
.wallet-btn,
.logout-btn {
  padding: 10px 16px;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}
.wallet-btn {
  background: linear-gradient(90deg, #4f46e5, #06b6d4);
  color: white;
}
.logout-btn {
  background: linear-gradient(90deg, #ef4444, #b91c1c);
  color: white;
}
.wallet-btn:hover,
.logout-btn:hover {
  transform: translateY(-2px);
}

/* Manager Info */
.manager-section {
  background: rgba(255, 255, 255, 0.8);
  padding: 16px;
  border-radius: 14px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
  margin-bottom: 20px;
}
.manager-section .role span {
  color: #4f46e5;
  font-weight: 600;
}

/* Metrics */
.metrics {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
  margin-bottom: 20px;
}
.metric-card {
  background: white;
  border-radius: 14px;
  padding: 16px;
  text-align: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
}
.metric-card.total {
  background: linear-gradient(90deg, #06b6d4, #4f46e5);
  color: white;
}

/* Tabs */
.tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 16px;
}
.tab-btn {
  padding: 10px 16px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  background: #e2e8f0;
  cursor: pointer;
}
.tab-btn.active {
  background: linear-gradient(90deg, #06b6d4, #4f46e5);
  color: white;
}

/* Table */
.table-container {
  background: white;
  border-radius: 16px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
}
.table-title {
  padding: 16px 20px;
  border-bottom: 1px solid #e2e8f0;
  font-weight: 600;
}
.payment-table {
  width: 100%;
  border-collapse: collapse;
}
.payment-table th,
.payment-table td {
  padding: 14px;
  border-bottom: 1px solid #e2e8f0;
  text-align: left;
}
tr:nth-child(even) {
  background: #f9fafb;
}

/* Status */
.status {
  padding: 4px 10px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
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

/* Dropdown */
.status-dropdown {
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid #cbd5e1;
  font-size: 13px;
  outline: none;
  cursor: pointer;
}

/* Empty state */
.empty-state {
  text-align: center;
  padding: 20px;
  color: #64748b;
}
</style>