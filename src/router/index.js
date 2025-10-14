import { createRouter, createWebHistory } from 'vue-router'

// 🔹 Lazy-loaded pages (adjust paths if structure differs)
const Login = () => import('@/views/auth/Login.vue')
const UserList = () => import('@/views/users/UserList.vue')
const UserForm = () => import('@/views/users/UserForm.vue')
const WalletList = () => import('@/views/wallets/WalletList.vue')
const WalletDetail = () => import('@/views/wallets/WalletDetail.vue')
const WalletForm = () => import('@/views/wallets/WalletForm.vue')
const PaymentDashboard = () => import('@/views/payments/PaymentDashboard.vue')
const PaymentForm = () => import('@/views/payments/PaymentForm.vue')
const MyWallet = () => import('@/views/wallets/MyWallet.vue')
const WalletRecharge = () => import('@/views/wallets/WalletRecharge.vue')

// 🔸 Role constants used throughout
const ROLES = {
  ADMIN: 'ADMIN',
  FINANCE: 'FINANCE_MANAGER',
  CUSTOMER: 'CUSTOMER'
}

const routes = [
  // 🔹 Public route
  { path: '/', name: 'Login', component: Login },

  // 🔹 Admin: User Management
  {
    path: '/admin/users',
    name: 'AdminUsers',
    component: UserList,
    meta: { roles: [ROLES.ADMIN] }
  },
  {
    path: '/admin/users/new',
    name: 'AdminUserNew',
    component: UserForm,
    meta: { roles: [ROLES.ADMIN] }
  },

  // 🔹 Wallet Management (Admin + Finance)
  {
    path: '/wallets',
    name: 'WalletList',
    component: WalletList,
    meta: { roles: [ROLES.ADMIN, ROLES.FINANCE] }
  },
  {
    path: '/wallets/new',
    name: 'WalletNew',
    component: WalletForm,
    meta: { roles: [ROLES.ADMIN] }
  },
  {
    path: '/wallets/:id',
    name: 'WalletDetail',
    component: WalletDetail,
    meta: { roles: [ROLES.ADMIN, ROLES.FINANCE, ROLES.CUSTOMER] }
  },
  {
    path: '/wallets/:id/edit',
    name: 'WalletEdit',
    component: WalletForm,
    meta: { roles: [ROLES.ADMIN] }
  },

  // 🔹 Customer-specific wallet routes
  {
    path: '/my-wallet',
    name: 'MyWallet',
    component: MyWallet,
    meta: { roles: [ROLES.CUSTOMER] }
  },
  {
    path: '/wallet/recharge',
    name: 'WalletRecharge',
    component: WalletRecharge,
    meta: { roles: [ROLES.CUSTOMER] }
  },

  // 🔹 Payments
  {
    path: '/payments',
    name: 'PaymentDashboard',
    component: PaymentDashboard,
    meta: { roles: [ROLES.ADMIN, ROLES.FINANCE] }
  },
  {
    path: '/payments/new',
    name: 'PaymentNew',
    component: PaymentForm,
    meta: { roles: [ROLES.CUSTOMER] }
  },
  {
    path: '/payments/:id',
    name: 'PaymentEdit',
    component: PaymentForm,
    meta: { roles: [ROLES.ADMIN, ROLES.FINANCE] }
  },

  // 🔹 Fallback route
  { path: '/:catchAll(.*)', redirect: '/' }
]

// 🔸 Router setup
const router = createRouter({
  history: createWebHistory(),
  routes
})

// 🔒 Auth helper
function getAuth() {
  const token = localStorage.getItem('auth_token')
  const role = localStorage.getItem('auth_role')
  return { token, role }
}

// 🔐 Global navigation guard for auth + role protection
router.beforeEach((to, from, next) => {
  const publicPage = to.name === 'Login'
  const { token, role } = getAuth()

  // 1️⃣ Redirect to login if not authenticated
  if (!token && !publicPage) {
    return next({ name: 'Login' })
  }

  // 2️⃣ Check role access (meta.roles)
  if (to.meta && to.meta.roles && to.meta.roles.length > 0) {
    if (!role || !to.meta.roles.includes(role)) {
      alert('Access denied ❌')
      return next({ name: 'Login' })
    }
  }

  // 3️⃣ If already logged in, avoid showing login again
  if (publicPage && token) {
    if (role === ROLES.ADMIN) return next({ name: 'AdminUsers' })
    if (role === ROLES.FINANCE) return next({ name: 'PaymentDashboard' })
    if (role === ROLES.CUSTOMER) return next({ name: 'MyWallet' })
  }

  next()
})

export default router
