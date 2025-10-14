import { mount } from '@vue/test-utils'
import WalletList from '@/views/wallets/WalletList.vue'

describe('WalletList.vue', () => {
  beforeEach(() => {
    // Mock localStorage data before test
    localStorage.clear()
    localStorage.setItem('auth_role', 'ADMIN')
    localStorage.setItem(
      'wallets',
      JSON.stringify([
        { id: 1, user: 'Anjali', email: 'a@mail.com', balance: 1200, currency: 'INR' },
        { id: 2, user: 'Rohit', email: 'r@mail.com', balance: 2300, currency: 'INR' }
      ])
    )

    // Mock confirm to always return true
    global.confirm = vi.fn(() => true)
  })

  it('renders wallet list correctly', async () => {
    const wrapper = mount(WalletList)

    // ✅ Force data reload (since Vue Test Utils may miss onMounted localStorage load)
    await wrapper.vm.$nextTick()
    wrapper.vm.wallets = JSON.parse(localStorage.getItem('wallets'))
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('Wallet Management')
    expect(wrapper.text()).toContain('Anjali')
    expect(wrapper.text()).toContain('Rohit')
  })

  it('deletes wallet and updates localStorage', async () => {
    const wrapper = mount(WalletList)
    wrapper.vm.wallets = JSON.parse(localStorage.getItem('wallets'))
    await wrapper.vm.$nextTick()

    // ✅ Trigger delete with mocked confirm
    await wrapper.vm.deleteWallet(1, 'Anjali')

    const wallets = JSON.parse(localStorage.getItem('wallets'))
    expect(wallets.find(w => w.user === 'Anjali')).toBeUndefined()
  })
})
