<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="wallet-page">
    <!-- Header -->
    <header class="wallet-header">
      <h2 class="title">Wallet Management</h2>
      <div class="actions">
        <button v-if="role === 'ADMIN'" class="btn add" @click="goToAddWallet">➕ Add Wallet</button>
        <button class="btn back" @click="goBack">← Back</button>
      </div>
    </header>

    <!-- Wallets Table -->
    <transition name="fade-slide" appear>
      <div v-if="wallets.length" class="wallet-card">
        <table class="wallet-table">
          <thead>
            <tr>
              <th>#</th>
              <th>User</th>
              <th>Email</th>
              <th>Balance</th>
              <th>Currency</th>
              <th v-if="role === 'ADMIN'">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(wallet, index) in wallets" :key="wallet.id">
              <td>{{ index + 1 }}</td>
              <td>{{ wallet.user }}</td>
              <td>{{ wallet.email }}</td>
              <td>{{ formatCurrency(wallet.balance) }}</td>
              <td>{{ wallet.currency }}</td>
              <td v-if="role === 'ADMIN'" class="action-cell">
                <button class="edit" @click="editWallet(wallet.id)">Edit</button>
                <button class="delete" @click="deleteWallet(wallet.id)">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </transition>

    <!-- Empty State -->
   <p v-if="!wallets.length" class="empty-state">No wallets found 💸</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const wallets = ref([])
const role = localStorage.getItem('auth_role') || ''

onMounted(() => {
  // ✅ Role-based access check
  if (role !== 'ADMIN' && role !== 'FINANCE_MANAGER') {
    alert('Access denied')
    router.push({ name: 'Login' })
    return
  }

  const storedWallets = JSON.parse(localStorage.getItem('wallets') || '[]')

  if (storedWallets.length === 0) {
    wallets.value = [
      { id: 1, user: 'Anjali Singh', email: 'anjali@mail.com', balance: 1200, currency: 'INR' },
      { id: 2, user: 'Rohit Mehta', email: 'rohit@mail.com', balance: 2500, currency: 'INR' },
      { id: 3, user: 'Kiran Rao', email: 'kiran@mail.com', balance: 1800, currency: 'INR' }
    ]
    localStorage.setItem('wallets', JSON.stringify(wallets.value))
  } else {
    wallets.value = storedWallets
  }
})

// ✅ Format currency nicely
function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR'
  }).format(amount)
}

// ✅ Navigation actions
function goToAddWallet() {
  router.push({ name: 'WalletForm' })
}

function goBack() {
  if (role === 'FINANCE_MANAGER') {
    router.push({ name: 'PaymentDashboard' })
  } else {
    router.push({ name: 'AdminDashboard' })
  }
}

// ✅ Admin-only functions
function editWallet(id) {
  router.push({ name: 'WalletForm', query: { editId: id } })
}

function deleteWallet(id) {
  if (confirm('Are you sure you want to delete this wallet?')) {
    const updated = wallets.value.filter((w) => w.id !== id)
    wallets.value = updated
    localStorage.setItem('wallets', JSON.stringify(updated))
  }
}
</script>

<style scoped>
.wallet-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc, #e2e8f0);
  color: #1e293b;
  padding: 40px 60px;
  font-family: "Inter", sans-serif;
}

/* HEADER */
.wallet-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  flex-wrap: wrap;
}
.title {
  font-size: 26px;
  background: linear-gradient(90deg, #4f46e5, #06b6d4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0;
}
.actions {
  display: flex;
  gap: 10px;
}
.btn {
  border: none;
  border-radius: 10px;
  padding: 10px 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
}
.add {
  background: linear-gradient(90deg, #06b6d4, #67e8f9);
  color: #0f172a;
}
.back {
  background: linear-gradient(90deg, #4f46e5, #818cf8);
  color: #fff;
}
.btn:hover {
  transform: translateY(-2px);
}

/* TABLE */
.wallet-card {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.05);
  animation: fadeIn 0.5s ease;
}
.wallet-table {
  width: 100%;
  border-collapse: collapse;
}
.wallet-table th {
  text-align: left;
  padding: 12px;
  background: #f1f5f9;
  color: #475569;
  font-size: 13px;
  text-transform: uppercase;
}
.wallet-table td {
  padding: 12px;
  border-top: 1px solid #e2e8f0;
  font-size: 14px;
}
.wallet-table tr:nth-child(even) {
  background: #f9fafb;
}
.wallet-table tr:hover {
  background: #eef2ff;
}

/* ACTION BUTTONS */
.action-cell button {
  border: none;
  padding: 6px 10px;
  border-radius: 8px;
  margin-right: 6px;
  font-size: 13px;
  cursor: pointer;
  transition: 0.2s;
}
.action-cell .edit {
  background: #22c55e;
  color: white;
}
.action-cell .delete {
  background: #ef4444;
  color: white;
}
.action-cell button:hover {
  transform: translateY(-2px);
}

/* EMPTY STATE */
.empty-state {
  text-align: center;
  color: #64748b;
  font-size: 15px;
  margin-top: 40px;
}

/* ANIMATION */
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
.fade-slide-enter-active {
  transition: all 0.6s ease;
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(15px);
}

/* RESPONSIVE */
@media (max-width: 768px) {
  .wallet-page {
    padding: 20px;
  }
  .wallet-header {
    flex-direction: column;
    align-items: flex-start;
  }
  .wallet-card {
    padding: 10px;
  }
}
</style>
