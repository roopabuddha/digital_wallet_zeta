<template>
  <div class="admin-dashboard">
    <!-- HEADER -->
    <header class="header">
      <div class="title-section">
        <h1>👥 User Management</h1>
        <p>Manage users, roles, and access control effortlessly</p>
      </div>

      <!-- HEADER ACTIONS -->
      <div class="header-actions">
        <button class="wallet-btn" @click="goToWallets">🏦 Manage Wallets</button>
        <button class="logout-btn" @click="logout">Logout</button>
      </div>
    </header>

    <!-- ADMIN INFO -->
    <p class="admin-summary">
      Welcome, <strong>{{ currentAdmin }}</strong> 🧑‍💼 | Role:
      <span>Admin</span>
    </p>

    <!-- STATS -->
    <div class="stats">
      <div class="stat-card" v-for="s in stats" :key="s.label">
        <div class="icon">{{ s.icon }}</div>
        <div class="text">
          <h3>{{ s.value }}</h3>
          <p>{{ s.label }}</p>
        </div>
      </div>
    </div>

    <!-- FILTER BAR -->
    <div class="filter-bar">
      <input
        v-model="search"
        type="text"
        placeholder="🔍 Search users by name or email"
        class="search-box"
      />
      <select v-model="filterRole" class="filter-select">
        <option value="">All Roles</option>
        <option value="ADMIN">Admin</option>
        <option value="FINANCE_MANAGER">Finance Manager</option>
        <option value="CUSTOMER">Customer</option>
      </select>
      <button class="add-btn" @click="goToCreate">➕ New User</button>
    </div>

    <!-- USERS TABLE -->
    <div class="table-container">
      <table class="user-table">
        <thead>
          <tr>
            <th>#</th>
            <th>User</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(user, i) in filteredUsers" :key="user.id">
            <td>{{ i + 1 }}</td>
            <td>{{ user.name }}</td>
            <td>{{ user.email }}</td>
            <td>
              <span class="badge" :class="user.role.toLowerCase()">
                {{ user.role }}
              </span>
            </td>
            <td>
              <span
                class="status"
                :class="{ active: user.active, inactive: !user.active }"
              >
                {{ user.active ? 'Active' : 'Inactive' }}
              </span>
            </td>
            <td>
              <button class="edit-btn" @click="editUser(user.id)">Edit</button>
              <button class="delete-btn" @click="deleteUser(user.id, user.name)">
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <p v-if="!filteredUsers.length" class="empty-state">
        No users found 🫥
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const users = ref([])
const search = ref('')
const filterRole = ref('')
const currentAdmin = localStorage.getItem('auth_email') || 'Admin'

onMounted(() => {
  const role = localStorage.getItem('auth_role')
  if (role !== 'ADMIN') {
    alert('Access denied ❌ Only Admins can access User Management.')
    router.push({ name: 'Login' })
    return
  }

  const storedUsers = JSON.parse(localStorage.getItem('users') || '[]')
  if (!storedUsers.length) {
    users.value = [
      { id: 1, name: 'Rohit Mehta', email: 'rohit@wallet.com', role: 'ADMIN', active: true },
      { id: 2, name: 'Anjali Singh', email: 'anjali@wallet.com', role: 'CUSTOMER', active: true },
      { id: 3, name: 'Kiran Rao', email: 'kiran@wallet.com', role: 'FINANCE_MANAGER', active: false }
    ]
    localStorage.setItem('users', JSON.stringify(users.value))
  } else {
    users.value = storedUsers
  }
})

const stats = computed(() => [
  { label: 'Total Users', value: users.value.length, icon: '👥' },
  { label: 'Active', value: users.value.filter(u => u.active).length, icon: '✅' },
  { label: 'Admins', value: users.value.filter(u => u.role === 'ADMIN').length, icon: '🧑‍💼' },
  { label: 'Customers', value: users.value.filter(u => u.role === 'CUSTOMER').length, icon: '💳' }
])

const filteredUsers = computed(() =>
  users.value.filter(
    u =>
      (!filterRole.value || u.role === filterRole.value) &&
      (u.name.toLowerCase().includes(search.value.toLowerCase()) ||
        u.email.toLowerCase().includes(search.value.toLowerCase()))
  )
)

function goToCreate() {
  router.push({ name: 'AdminUserNew' })
}

function editUser(id) {
  router.push({ name: 'AdminUserNew', query: { editId: id } })
}

function deleteUser(id, name) {
  if (confirm(`Delete user ${name}?`)) {
    users.value = users.value.filter(u => u.id !== id)
    localStorage.setItem('users', JSON.stringify(users.value))
  }
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
.admin-dashboard {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc, #e2e8f0);
  padding: 40px 60px;
  font-family: "Inter", sans-serif;
  color: #1e293b;
}

/* HEADER */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
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
  align-items: center;
  gap: 10px;
}
.wallet-btn {
  background: linear-gradient(90deg, #4f46e5, #06b6d4);
  color: white;
  border: none;
  padding: 10px 18px;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease;
}
.wallet-btn:hover {
  transform: translateY(-2px);
}
.logout-btn {
  background: linear-gradient(90deg, #ef4444, #b91c1c);
  color: white;
  border: none;
  padding: 10px 18px;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}
.logout-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 14px rgba(239, 68, 68, 0.3);
}

/* ADMIN SUMMARY */
.admin-summary {
  font-size: 14px;
  color: #475569;
  margin-bottom: 20px;
}
.admin-summary strong {
  color: #111827;
}
.admin-summary span {
  color: #4f46e5;
  font-weight: 600;
}

/* STATS */
.stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}
.stat-card {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(8px);
  border-radius: 14px;
  padding: 16px 20px;
  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  gap: 12px;
  transition: transform 0.2s ease;
}
.stat-card:hover {
  transform: translateY(-3px);
}
.stat-card .icon {
  font-size: 22px;
}
.stat-card h3 {
  margin: 0;
  font-size: 20px;
  color: #111827;
}
.stat-card p {
  margin: 0;
  font-size: 13px;
  color: #64748b;
}

/* FILTER BAR */
.filter-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 22px;
}
.search-box {
  flex: 1;
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  padding: 10px 14px;
  font-size: 14px;
  outline: none;
  background: #fff;
}
.filter-select {
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  padding: 10px 14px;
  font-size: 14px;
  background: #fff;
}
.add-btn {
  background: linear-gradient(90deg, #06b6d4, #4f46e5);
  color: white;
  border: none;
  padding: 10px 18px;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}
.add-btn:hover {
  transform: translateY(-2px);
}

/* TABLE */
.table-container {
  background: #ffffffcc;
  backdrop-filter: blur(10px);
  border-radius: 14px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}
.user-table {
  width: 100%;
  border-collapse: collapse;
}
.user-table th {
  background: #f1f5f9;
  color: #475569;
  text-transform: uppercase;
  font-size: 13px;
  padding: 14px;
  text-align: left;
}
.user-table td {
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

/* ROLE & STATUS */
.badge {
  padding: 4px 10px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 500;
  text-transform: capitalize;
}
.badge.admin {
  background: #eef2ff;
  color: #4f46e5;
}
.badge.finance_manager {
  background: #ecfeff;
  color: #06b6d4;
}
.badge.customer {
  background: #f0fdf4;
  color: #16a34a;
}
.status {
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
}
.status.active {
  background: #dcfce7;
  color: #15803d;
}
.status.inactive {
  background: #fee2e2;
  color: #b91c1c;
}

/* ACTION BUTTONS */
.edit-btn,
.delete-btn {
  border: none;
  border-radius: 6px;
  padding: 6px 12px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}
.edit-btn {
  background: #4f46e5;
  color: white;
}
.delete-btn {
  background: #ef4444;
  color: white;
}

/* RESPONSIVE */
@media (max-width: 768px) {
  .admin-dashboard {
    padding: 20px;
  }
  .filter-bar {
    flex-direction: column;
  }
  .user-table th,
  .user-table td {
    padding: 10px;
  }
}
</style>
