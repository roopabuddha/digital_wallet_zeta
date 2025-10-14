<template>
  <div class="wallet-list-page">
    <!-- HEADER -->
    <header class="header">
      <div class="left">
        <h2>🏦 Wallet Management</h2>
        <p v-if="role === 'ADMIN'">
          View, create, and manage all wallets
        </p>
        <p v-else>
          View all customer wallets and balances
        </p>
      </div>

      <div class="actions">
        <button
          v-if="role === 'ADMIN'"
          class="add-btn"
          @click="goToCreate"
        >
          ➕ Add Wallet
        </button>
        <button class="back-btn" @click="goBack">← Back</button>
      </div>
    </header>

    <!-- TABLE -->
    <div class="table-container">
      <table class="wallet-table">
        <thead>
          <tr>
            <th>#</th>
            <th>User</th>
            <th>Email</th>
            <th>Balance</th>
            <th>Currency</th>
            <th v-if="role === 'ADMIN'">Actions</th>
            <th v-else>Details</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(wallet, i) in wallets" :key="wallet.id">
            <td>{{ i + 1 }}</td>
            <td>{{ wallet.user }}</td>
            <td>{{ wallet.email }}</td>
            <td>{{ formatCurrency(wallet.balance, wallet.currency) }}</td>
            <td>{{ wallet.currency }}</td>

            <!-- For Admin -->
            <td v-if="role === 'ADMIN'">
              <button class="edit-btn" @click="editWallet(wallet.id)">Edit</button>
              <button class="delete-btn" @click="deleteWallet(wallet.id, wallet.user)">Delete</button>
            </td>

            <!-- For Finance Manager -->
            <td v-else>
              <button class="view-btn" @click="viewWallet(wallet.id)">View</button>
            </td>
          </tr>
        </tbody>
      </table>

      <p v-if="!wallets.length" class="empty-state">No wallets found 💸</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const wallets = ref([])
const role = ref('')

onMounted(() => {
  role.value = localStorage.getItem('auth_role')

  if (role.value !== 'ADMIN' && role.value !== 'FINANCE_MANAGER') {
    alert('Access denied ❌')
    router.push({ name: 'Login' })
    return
  }

  const stored = JSON.parse(localStorage.getItem('wallets') || '[]')
  wallets.value = stored
})

function goToCreate() {
  router.push({ name: 'WalletNew' })
}

function editWallet(id) {
  router.push({ name: 'WalletNew', query: { editId: id } })
}

function deleteWallet(id, user) {
  if (confirm(`Are you sure you want to delete ${user}'s wallet?`)) {
    wallets.value = wallets.value.filter((w) => w.id !== id)
    localStorage.setItem('wallets', JSON.stringify(wallets.value))
  }
}

function viewWallet(id) {
  router.push({ name: 'WalletDetail', params: { id } })
}

function goBack() {
  const role = localStorage.getItem('auth_role')
  if (role === 'ADMIN') router.push({ name: 'AdminUsers' })
  else router.push({ name: 'PaymentDashboard' })
}



function formatCurrency(amount, currency) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency || 'INR'
  }).format(amount)
}
</script>

<style scoped>
.wallet-list-page {
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
  margin-bottom: 20px;
  flex-wrap: wrap;
}
.left h2 {
  font-size: 26px;
  background: linear-gradient(90deg, #4f46e5, #06b6d4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.left p {
  color: #64748b;
  font-size: 14px;
}
.actions {
  display: flex;
  gap: 10px;
}
.add-btn {
  background: linear-gradient(90deg, #06b6d4, #4f46e5);
  color: white;
  border: none;
  padding: 10px 18px;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
}
.back-btn {
  background: linear-gradient(90deg, #ef4444, #b91c1c);
  color: white;
  border: none;
  padding: 10px 18px;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
}

/* TABLE */
.table-container {
  background: #ffffffcc;
  border-radius: 14px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}
.wallet-table {
  width: 100%;
  border-collapse: collapse;
}
.wallet-table th {
  background: #f1f5f9;
  color: #475569;
  text-transform: uppercase;
  font-size: 13px;
  padding: 14px;
  text-align: left;
}
.wallet-table td {
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

/* ACTION BUTTONS */
.edit-btn,
.delete-btn,
.view-btn {
  border: none;
  border-radius: 6px;
  padding: 6px 12px;
  font-size: 13px;
  cursor: pointer;
  font-weight: 500;
}
.edit-btn {
  background: #4f46e5;
  color: white;
}
.edit-btn:hover {
  background: #4338ca;
}
.delete-btn {
  background: #ef4444;
  color: white;
}
.delete-btn:hover {
  background: #dc2626;
}
.view-btn {
  background: linear-gradient(90deg, #4f46e5, #06b6d4);
  color: white;
}
.view-btn:hover {
  transform: translateY(-2px);
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
  .wallet-list-page {
    padding: 20px;
  }
  .wallet-table th,
  .wallet-table td {
    padding: 10px;
  }
}
</style>
