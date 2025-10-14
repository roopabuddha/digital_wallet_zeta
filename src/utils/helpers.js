/*
|--------------------------------------------------------------------------
| Helper Utility Functions
|--------------------------------------------------------------------------
*/

/**
 * Format currency into INR/other currency
 */
export function formatCurrency(amount, currency = 'INR') {
  if (isNaN(amount)) return '₹0.00'
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency
  }).format(amount)
}

/**
 * Format date as DD MMM YYYY
 */
export function formatDate(dateString) {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

/**
 * Generate a random ID (for mock data)
 */
export function generateId(prefix = '') {
  return prefix + Math.floor(Math.random() * 100000)
}

/**
 * Deep clone an object
 */
export function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj))
}

/**
 * Convert status to colored badge class
 */
export function getStatusClass(status) {
  switch (status) {
    case 'PENDING':
      return 'bg-red-500'
    case 'PROCESSING':
      return 'bg-yellow-500'
    case 'COMPLETED':
      return 'bg-green-500'
    default:
      return ''
  }
}
export function logoutUser(router) {
  localStorage.removeItem('auth_token')
  localStorage.removeItem('auth_role')
  router.push({ name: 'Login' })
}
