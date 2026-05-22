import { createApp } from 'vue'
import App from './App.vue'

// Prevent duplicate mount from HMR
const container = document.getElementById('app')
if (container._vue_app) {
  container._vue_app.unmount()
}
const app = createApp(App)
app.mount(container)
container._vue_app = app
