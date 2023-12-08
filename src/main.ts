import { createApp } from 'vue'
import './style.css'
import router from './router'
import App from './App.vue'
import PrimeVue from 'primevue/config';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import 'primevue/resources/themes/lara-light-teal/theme.css'
import 'primeflex/primeflex.css'
import 'primeicons/primeicons.css'
import ToastService from 'primevue/toastservice';

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate)

const app = createApp(App)
app.use(pinia)
app.use(PrimeVue)
app.use(router)
app.use(ToastService)
app.mount('#app')
