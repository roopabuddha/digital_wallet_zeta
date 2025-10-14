<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <transition name="fade-scale">
    <div class="overlay" v-if="visible" @click.self="closeForm">
      <div class="user-form-card">
        <header class="form-header">
          <h2>
            <span class="icon">👤</span>
            {{ isEdit ? 'Edit User' : 'Add New User' }}
          </h2>
        </header>

        <form class="user-form" @submit.prevent="saveUser">
          <div class="form-group">
            <label>Name</label>
            <input v-model="user.name" placeholder="Enter full name" required />
          </div>

          <div class="form-group">
            <label>Email</label>
            <input
              v-model="user.email"
              type="email"
              placeholder="user@example.com"
              required
            />
          </div>

          <div class="form-group">
            <label>Role</label>
            <select v-model="user.role" required>
              <option value="">Select role</option>
              <option value="ADMIN">Admin</option>
              <option value="FINANCE_MANAGER">Finance Manager</option>
              <option value="CUSTOMER">Customer</option>
            </select>
          </div>

          <div class="form-group">
            <label>Status</label>
            <select v-model="user.active" required>
              <option :value="true">Active</option>
              <option :value="false">Inactive</option>
            </select>
          </div>

          <div class="form-actions">
            <button type="button" class="cancel-btn" @click="closeForm">
              Cancel
            </button>
            <button type="submit" class="save-btn">
              {{ isEdit ? 'Update' : 'Create' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const visible = ref(false)
const isEdit = ref(false)

const user = ref({
  id: null,
  name: '',
  email: '',
  role: '',
  active: true
})

onMounted(() => {
  setTimeout(() => (visible.value = true), 100)
  const editId = route.query.editId
  if (editId) {
    isEdit.value = true
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const existing = users.find((u) => u.id === Number(editId))
    if (existing) user.value = { ...existing }
  }
})

function saveUser() {
  const users = JSON.parse(localStorage.getItem('users') || '[]')

  if (isEdit.value) {
    const idx = users.findIndex((u) => u.id === user.value.id)
    if (idx !== -1) users[idx] = { ...user.value }
  } else {
    user.value.id = Date.now()
    users.push({ ...user.value })
  }

  localStorage.setItem('users', JSON.stringify(users))
  closeForm()
}

function closeForm() {
  visible.value = false
  setTimeout(() => router.push({ name: 'AdminUsers' }), 250)
}
</script>

<style scoped>
/* Overlay with blur */
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(10, 12, 20, 0.6);
  backdrop-filter: blur(6px);
  display: grid;
  place-items: center;
  z-index: 1000;
}

/* Main Card */
.user-form-card {
  width: 420px;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 20px;
  padding: 30px 26px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4),
    0 0 8px rgba(79, 70, 229, 0.4);
  backdrop-filter: blur(12px);
  color: #e2e8f0;
  animation: popIn 0.4s ease;
}

/* Header */
.form-header {
  text-align: center;
  margin-bottom: 22px;
}
.form-header h2 {
  font-size: 22px;
  font-weight: 700;
  background: linear-gradient(90deg, #06b6d4, #4f46e5);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.icon {
  font-size: 20px;
  margin-right: 6px;
}

/* Inputs */
.form-group {
  margin-bottom: 16px;
}
label {
  display: block;
  font-size: 13px;
  color: rgba(230, 238, 248, 0.9);
  margin-bottom: 6px;
}
input,
select {
  width: 100%;
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(15, 23, 42, 0.6);
  color: #fff;
  outline: none;
  font-size: 14px;
  transition: all 0.2s ease;
}
input:focus,
select:focus {
  border-color: #4f46e5;
  box-shadow: 0 0 6px rgba(99, 102, 241, 0.4);
  transform: translateY(-2px);
}

/* Buttons */
.form-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 24px;
}
.cancel-btn,
.save-btn {
  border: none;
  padding: 10px 16px;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.2s ease;
}
.cancel-btn {
  background: rgba(239, 68, 68, 0.15);
  color: #f87171;
}
.cancel-btn:hover {
  background: rgba(239, 68, 68, 0.25);
  transform: translateY(-2px);
}
.save-btn {
  background: linear-gradient(90deg, #06b6d4, #4f46e5);
  color: white;
  box-shadow: 0 0 10px rgba(79, 70, 229, 0.4);
}
.save-btn:hover {
  transform: translateY(-2px);
}

/* Animations */
@keyframes popIn {
  from {
    transform: scale(0.9);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: all 0.4s ease;
}
.fade-scale-enter-from,
.fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
</style>
