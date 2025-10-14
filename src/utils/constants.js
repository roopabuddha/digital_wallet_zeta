/*
|--------------------------------------------------------------------------
| Global Constants
|--------------------------------------------------------------------------
*/

export const ROLES = Object.freeze({
  ADMIN: 'ADMIN',
  FINANCE_MANAGER: 'FINANCE_MANAGER',
  CUSTOMER: 'CUSTOMER'
})

export const PAYMENT_STATUS = Object.freeze({
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  COMPLETED: 'COMPLETED'
})

export const CURRENCIES = Object.freeze(['INR', 'USD', 'EUR'])

export const DEFAULT_WALLET_BALANCE = 0

export const APP_NAME = 'Digital Wallet System'
export const APP_VERSION = '1.0.0'
