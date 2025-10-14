import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import router from './router'

import './assets/styles/global.css'
import './assets/styles/theme.css'
import './assets/styles/variables.css'
import './assets/styles/animations.css'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')
