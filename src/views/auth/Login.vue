<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="auth-page">
    <div class="background-layer"></div>

    <!-- Left Illustration -->
    <div class="illustration">
      <div class="wallet">
        <div class="flap"></div>
        <div class="money"></div>
      </div>
      <div class="tagline">
        <h1>Seamless Transactions</h1>
        <h2>Smarter Wallet Experience ⚡</h2>
        <p>Pay • Save • Manage — all in one secure place.</p>
      </div>
    </div>

    <!-- Right Form Card -->
    <div class="card">
      <header>
        <h1>Zeta's Digital Wallet</h1>
        <p class="subtitle">Secure • Smart • Fast Payments</p>
      </header>

      <transition name="fade">
        <form key="form" class="form" @submit.prevent="handleSubmit">
          <div class="input-group">
            <input v-model="email" type="email" required />
            <label>Email</label>
          </div>

          <div class="input-group password">
            <input
              :type="showPassword ? 'text' : 'password'"
              v-model="password"
              required
              minlength="6"
              @input="checkStrength"
            />
            <label>Password</label>
            <button type="button" class="toggle" @click="showPassword = !showPassword">
              {{ showPassword ? 'close' : 'show' }}
            </button>
          </div>

          <transition name="fade">
            <div v-if="isSignUp && password" class="strength">
              <div class="bar-bg">
                <div :class="['bar', strength.level]"></div>
              </div>
              <p :class="['strength-text', strength.level]">{{ strength.label }}</p>
            </div>
          </transition>

          <div v-if="!isSignUp" class="roles">
            <p>Login as:</p>
            <div class="role-options">
              <button
                v-for="r in roles"
                :key="r.value"
                type="button"
                :class="['role-btn', { active: role === r.value }]"
                @click="role = r.value"
              >
                {{ r.label }}
              </button>
            </div>
          </div>

          <p v-if="error" class="error">{{ error }}</p>
          <p v-if="success" class="success">{{ success }}</p>

          <button class="btn" :disabled="loading">
            <span v-if="!loading">{{ isSignUp ? 'Sign Up' : 'Sign In' }}</span>
            <span v-else class="loader"></span>
          </button>

          <p class="switch">
            <span v-if="!isSignUp">
              Only Customers can create new accounts.
              <a href="#" @click.prevent="toggleMode">Create one</a>
            </span>
            <span v-else>
              Already have an account?
              <a href="#" @click.prevent="toggleMode">Login here</a>
            </span>
          </p>
        </form>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { isValidEmail, isValidPassword } from '@/utils/validations'

const router = useRouter()
const email = ref('')
const password = ref('')
const role = ref('CUSTOMER')
const loading = ref(false)
const isSignUp = ref(false)
const error = ref('')
const success = ref('')
const showPassword = ref(false)
const strength = ref({ level: '', label: '' })

const roles = [
  { label: 'Admin', value: 'ADMIN' },
  { label: 'Finance Manager', value: 'FINANCE_MANAGER' },
  { label: 'Customer', value: 'CUSTOMER' }
]

function toggleMode() {
  isSignUp.value = !isSignUp.value
  email.value = ''
  password.value = ''
  error.value = ''
  success.value = ''
  showPassword.value = false
  strength.value = { level: '', label: '' }
}

function checkStrength() {
  const pass = password.value
  if (!pass) return (strength.value = { level: '', label: '' })
  const strong = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/
  const medium = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/
  if (strong.test(pass)) strength.value = { level: 'strong', label: 'Strong password' }
  else if (medium.test(pass)) strength.value = { level: 'medium', label: 'Medium strength' }
  else strength.value = { level: 'weak', label: 'Weak password' }
}

function handleSubmit() {
  error.value = ''
  success.value = ''
  if (!isValidEmail(email.value)) {
    error.value = 'Enter a valid email address.'
    return
  }
  if (!isValidPassword(password.value)) {
    error.value = 'Password must include uppercase, lowercase, and number.'
    return
  }

  loading.value = true
  setTimeout(() => {
    const users = JSON.parse(localStorage.getItem('demoUsers') || '[]')

    // SIGN UP FLOW
    if (isSignUp.value) {
      const exists = users.find(u => u.email === email.value)
      if (exists) {
        error.value = 'Email already exists.'
        loading.value = false
        return
      }

      const newUser = { email: email.value, password: password.value, role: 'CUSTOMER' }
      users.push(newUser)
      localStorage.setItem('demoUsers', JSON.stringify(users))

      // Create wallet
      const wallets = JSON.parse(localStorage.getItem('wallets') || '[]')
      wallets.push({
        id: wallets.length + 1,
        userEmail: email.value,
        balance: 0,
        currency: 'INR'
      })
      localStorage.setItem('wallets', JSON.stringify(wallets))

      success.value = 'Account created successfully! Please log in to continue.'
      isSignUp.value = false
      email.value = ''
      password.value = ''
      strength.value = { level: '', label: '' }
      loading.value = false
      return
    }

    // LOGIN FLOW
    const user = users.find(u => u.email === email.value && u.role === role.value)
    if (!user) {
      error.value = 'User not found.'
      loading.value = false
      return
    }
    if (user.password !== password.value) {
      error.value = 'Wrong password.'
      loading.value = false
      return
    }

    localStorage.setItem('auth_token', 'demo-' + Math.random().toString(36).slice(2))
    localStorage.setItem('auth_email', user.email)
    localStorage.setItem('auth_role', user.role)

    if (user.role === 'ADMIN') router.push({ name: 'AdminUsers' })
    else if (user.role === 'FINANCE_MANAGER') router.push({ name: 'PaymentDashboard' })
    else router.push({ name: 'MyWallet' })

    loading.value = false
  }, 800)
}

// Ensure default users exist
function ensureDefaultUsers() {
  const existing = JSON.parse(localStorage.getItem('demoUsers') || '[]')
  const defaults = [
    { email: 'admin@wallet.com', password: 'Admin123', role: 'ADMIN' },
    { email: 'finance@wallet.com', password: 'Finance123', role: 'FINANCE_MANAGER' },
    { email: 'customer@wallet.com', password: 'Customer123', role: 'CUSTOMER' }
  ]

  defaults.forEach(def => {
    if (!existing.some(u => u.email === def.email)) {
      existing.push(def)
    }
  })
  localStorage.setItem('demoUsers', JSON.stringify(existing))
}
ensureDefaultUsers()
</script>

<style scoped>
.auth-page {
  display: flex;
  height: 100vh;
  background: linear-gradient(135deg, #0f172a, #020617);
  color: #e2e8f0;
  font-family: "Inter", sans-serif;
  overflow: hidden;
  justify-content: center;
  align-items: center;
  padding: 40px 80px;
}

/* Background glow */
.background-layer {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 20% 20%, rgba(6, 182, 212, 0.25), transparent 60%),
              radial-gradient(circle at 80% 80%, rgba(79, 70, 229, 0.25), transparent 60%);
  filter: blur(120px);
  animation: pulse 8s ease-in-out infinite alternate;
}

/* Left illustration */
.illustration {
  flex: 1.1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  text-align: center;
  padding: 70px 60px;
  margin-right: 60px;
}
.wallet {
  width: 210px;
  height: 140px;
  background: linear-gradient(145deg, #4f46e5, #06b6d4);
  border-radius: 20px;
  position: relative;
  animation: float 4s ease-in-out infinite;
}
.wallet .flap {
  position: absolute;
  top: -10px;
  width: 100%;
  height: 40px;
  border-radius: 20px 20px 0 0;
  background: linear-gradient(145deg, #818cf8, #38bdf8);
}
.wallet .money {
  position: absolute;
  top: 20px;
  left: 20px;
  width: 60%;
  height: 60%;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.3);
}
.tagline {
  margin-top: 50px;
}
.tagline h1 {
  font-size: 34px;
  font-weight: 600;
  color: #f8fafc;
  letter-spacing: 0.3px;
}
.tagline h2 {
  font-size: 20px;
  color: #38bdf8;
  margin-bottom: 10px;
}
.tagline p {
  font-size: 15px;
  color: rgba(255, 255, 255, 0.6);
}

/* Card */
.card {
  flex: 0.9;
  max-width: 500px;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(18px);
  border-radius: 30px;
  padding: 60px 50px 70px;
  box-shadow: 0 15px 45px rgba(0, 0, 0, 0.55);
  z-index: 2;
}
header h1 {
  color: #fff;
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 10px;
}
.subtitle {
  font-size: 15px;
  color: rgba(255, 255, 255, 0.65);
  margin-bottom: 38px;
}

/* Input group */
.input-group {
  position: relative;
  margin-bottom: 30px;
}
.input-group input {
  width: 100%;
  padding: 16px 14px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.12); /* ✅ visible background */
  border: 1px solid rgba(255, 255, 255, 0.25);
  color: #fff; /* ✅ visible text */
  font-size: 15px;
  transition: all 0.25s ease;
  outline: none;
}
.input-group input:focus {
  border-color: #38bdf8;
  background: rgba(255, 255, 255, 0.2);
}
.input-group label {
  position: absolute;
  left: 14px;
  top: 16px;
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
  transition: 0.2s ease;
  pointer-events: none;
}
.input-group input:focus + label,
.input-group input:valid + label {
  top: -10px;
  left: 12px;
  font-size: 12px;
  color: #06b6d4;
  background: rgba(15, 23, 42, 0.9);
  padding: 0 4px;
  border-radius: 4px;
}
.password .toggle {
  position: absolute;
  right: 12px;
  top: 12px;
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  font-size: 16px;
}

/* Roles */
.roles {
  margin-top: 10px;
  margin-bottom: 30px;
}
.role-options {
  display: flex;
  gap: 10px;
  margin-top: 8px;
}
.role-btn {
  flex: 1;
  background: rgba(255, 255, 255, 0.08);
  color: #cbd5e1;
  border: none;
  border-radius: 12px;
  padding: 10px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}
.role-btn.active {
  background: linear-gradient(90deg, #06b6d4, #4f46e5);
  color: #fff;
}

/* Buttons */
.btn {
  width: 100%;
  padding: 16px;
  border-radius: 14px;
  border: none;
  background: linear-gradient(90deg, #06b6d4, #4f46e5);
  color: white;
  font-weight: 600;
  font-size: 15px;
  margin-top: 14px;
  cursor: pointer;
  transition: transform 0.2s ease;
}
.btn:hover {
  transform: translateY(-3px);
}

/* Errors & Success */
.error {
  color: #ef4444;
  font-size: 14px;
  text-align: center;
  margin-top: 10px;
}
.success {
  color: #22c55e;
  font-size: 14px;
  text-align: center;
  margin-top: 10px;
}

/* Switch link */
.switch {
  text-align: center;
  font-size: 13px;
  margin-top: 22px;
  color: rgba(230, 238, 248, 0.8);
}
.switch a {
  color: #06b6d4;
  font-weight: 600;
  text-decoration: underline;
  cursor: pointer;
}

/* Animations */
@keyframes pulse {
  0%,100% { opacity: 0.9; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.05); }
}
@keyframes float {
  0%,100% { transform: translateY(0); }
  50% { transform: translateY(-12px); }
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Responsive */
@media (max-width: 900px) {
  .illustration {
    display: none;
  }
  .auth-page {
    padding: 30px 20px;
  }
  .card {
    width: 100%;
    max-width: 420px;
    padding: 50px 32px;
  }
  header h1 {
    font-size: 24px;
  }
  .subtitle {
    font-size: 13px;
  }
  .input-group input {
    font-size: 14px;
  }
}
</style>
