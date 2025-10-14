import { mount } from '@vue/test-utils'
import PaymentDashboard from '@/views/payments/PaymentDashboard.vue'

describe('PaymentDashboard.vue', () => {
  beforeEach(() => {
    localStorage.clear()
    localStorage.setItem('auth_role', 'FINANCE_MANAGER')
    localStorage.setItem('auth_email', 'finance@wallet.com')
    localStorage.setItem(
      'payments',
      JSON.stringify([
        { id: 1, user: 'Rohit Mehta', amount: 2300, date: '2025-10-12', status: 'PENDING' },
        { id: 2, user: 'Kiran Rao', amount: 1500, date: '2025-10-11', status: 'COMPLETED' }
      ])
    )
  })

  it('renders payment dashboard and filters PENDING', async () => {
    const wrapper = mount(PaymentDashboard)
    await wrapper.vm.$nextTick()

    // ✅ Wait for mount + reactive state load
    expect(wrapper.text()).toContain('Finance Dashboard')
    expect(wrapper.text()).toContain('Rohit Mehta')
  })

  it('filters COMPLETED payments correctly', async () => {
    const wrapper = mount(PaymentDashboard)
    wrapper.vm.activeTab = 'COMPLETED'
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toContain('Kiran Rao')
  })
})
