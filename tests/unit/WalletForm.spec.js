import { mount } from '@vue/test-utils'
import WalletForm from '@/views/wallets/WalletForm.vue'

// ✅ Mock vue-router
vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
  useRoute: () => ({
    query: {}, // mock empty query param
  }),
}))

describe('WalletForm.vue', () => {
  beforeEach(() => {
    localStorage.clear()
    localStorage.setItem('auth_role', 'ADMIN')
    global.alert = vi.fn() // ✅ Prevent popup blocking
  })

  it('renders wallet creation form correctly', async () => {
    const wrapper = mount(WalletForm)
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toMatch(/Wallet|Balance|Currency/i)
  })

  it('saves wallet details to localStorage on submit', async () => {
    const wrapper = mount(WalletForm)

    // Fill the form via DOM to match how a user would interact
    const nameInput = wrapper.find('input[placeholder="Enter customer name"]')
    const emailInput = wrapper.find('input[placeholder="Enter email address"]')
    const balanceInput = wrapper.find('input[placeholder="Enter wallet balance"]')
    const currencySelect = wrapper.find('select')

    await nameInput.setValue('Kiran')
    await emailInput.setValue('kiran@mail.com')
    await balanceInput.setValue('2500')
    await currencySelect.setValue('INR')

    // Submit the form (this will call saveWallet)
    await wrapper.find('form').trigger('submit.prevent')

    // Validate localStorage data
    const wallets = JSON.parse(localStorage.getItem('wallets') || '[]')
    const saved = wallets.find(w => w.user === 'Kiran')

    expect(saved).toBeTruthy()
    expect(saved.balance).toBe(2500)
  })
})
