/*
|--------------------------------------------------------------------------
| Validation Utility Functions
|--------------------------------------------------------------------------
*/

/**
 * Validate email format
 */
/**
 * ✅ Email validation — checks for basic valid email format.
 */
export function isValidEmail(email) {
  const regex = /^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/;
  return regex.test(email.trim());
}

/**
 * ✅ Password validation — 
 * must have:
 *  - at least 6 characters
 *  - one uppercase
 *  - one lowercase
 *  - one number
 */
export function isValidPassword(password) {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
  return regex.test(password);
}

/**
 * Validate currency amount
 */
export function isValidAmount(amount) {
  return !isNaN(amount) && amount > 0
}

/**
 * Validate role selection
 */
export function isValidRole(role) {
  const validRoles = ['ADMIN', 'FINANCE_MANAGER', 'CUSTOMER']
  return validRoles.includes(role)
}

/**
 * Combined validation example (for forms)
 */
export function validateUserForm({ name, email, role }) {
  const errors = {}
  if (!name || name.trim().length < 2) errors.name = 'Name must be at least 2 characters'
  if (!isValidEmail(email)) errors.email = 'Invalid email format'
  if (!isValidRole(role)) errors.role = 'Role selection is required'
  return errors
}
