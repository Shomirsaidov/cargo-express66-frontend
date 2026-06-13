import { createI18n } from 'vue-i18n'
import ru from './ru.js'
import en from './en.js'

const savedLocale = localStorage.getItem('locale') || 'ru'

const i18n = createI18n({
  legacy: true,
  locale: savedLocale,
  fallbackLocale: 'ru',
  messages: {
    ru,
    en
  }
})

export default i18n
