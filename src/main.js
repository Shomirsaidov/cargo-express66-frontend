import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router/index.js'
import i18n from './i18n/index.js'
import App from './App.vue'
import './style.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(i18n)

app.config.errorHandler = (err, instance, info) => {
  console.error('Vue Runtime Error:', err);
  const div = document.createElement('div');
  div.style.position = 'fixed';
  div.style.top = '0';
  div.style.left = '0';
  div.style.width = '100vw';
  div.style.height = '100vh';
  div.style.backgroundColor = 'rgba(220, 38, 38, 0.95)';
  div.style.color = 'white';
  div.style.padding = '30px';
  div.style.zIndex = '99999';
  div.style.overflow = 'auto';
  div.style.fontFamily = 'monospace';
  div.innerHTML = `
    <h1 style="font-size: 24px; margin-bottom: 15px; border-b: 1px solid rgba(255,255,255,0.3); padding-bottom: 10px;">🔴 Vue Runtime Error</h1>
    <pre style="font-size: 14px; background: rgba(0,0,0,0.2); padding: 15px; border-radius: 8px; overflow-x: auto; white-space: pre-wrap;">${err.stack || err.message || err}</pre>
    <p style="margin-top: 15px; font-size: 13px; opacity: 0.8;">Component Info: ${info}</p>
  `;
  document.body.appendChild(div);
};

app.mount('#app')
