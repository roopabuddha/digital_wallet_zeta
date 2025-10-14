import { config } from '@vue/test-utils'

// ✅ Global mocks for router
config.global.mocks = {
  $router: {
    push: vi.fn(),
  },
  $route: {
    params: {},
    query: {},
  },
}

// ✅ Mock alert (prevents jsdom from breaking)
global.alert = vi.fn()

// ✅ Mock localStorage
global.localStorage = {
  store: {},
  getItem(key) {
    return this.store[key] || null
  },
  setItem(key, value) {
    this.store[key] = String(value)
  },
  removeItem(key) {
    delete this.store[key]
  },
  clear() {
    this.store = {}
  },
}
