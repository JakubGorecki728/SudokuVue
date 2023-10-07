// import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const app = createApp(App)

app.use(createPinia())
app.use(router)

const vuetify = createVuetify({
    components,
    directives,
    ssr: true
  })

app.use(vuetify)



app.mount('#app')

export const setAppTheme = <T extends 'light' | 'dark'>(theme?: T): void => {
  const html = document.documentElement;
  const setTheme = (t: T) => { html.setAttribute('data-bs-theme', t) };

  if (theme) { setTheme(theme); return; }

  const currentTheme: string | null = html.getAttribute('data-bs-theme');
  setTheme((!currentTheme || currentTheme === 'light' ? 'dark' : 'light') as T);
}


