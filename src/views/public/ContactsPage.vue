<template>
  <div class="max-w-5xl mx-auto px-4 py-12">
    <!-- Header -->
    <div class="text-center mb-12">
      <span class="bg-primary-50 text-primary border border-primary-200 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
        Наши представительства
      </span>
      <h1 class="text-3xl lg:text-4xl font-extrabold text-gray-900 mt-3 mb-4">Контакты и адреса складов</h1>
      <p class="text-gray-500 text-base max-w-2xl mx-auto">
        Свяжитесь с нашими координаторами или отправьте посылку на один из наших официальных пунктов приёма.
      </p>
    </div>

    <!-- Quick Call Actions -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
      <!-- USA General Contact -->
      <div v-if="contacts.usa" class="card p-6 border border-gray-150 flex items-center gap-4 bg-white hover:shadow-md transition-all">
        <div class="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-3xl">
          {{ contacts.usa.flag || '🇺🇸' }}
        </div>
        <div>
          <p class="text-xs text-gray-400 uppercase font-semibold tracking-wider">{{ contacts.usa.label }}</p>
          <a :href="'tel:' + (contacts.usa.phone_raw || contacts.usa.phone)"
            class="text-xl font-bold text-gray-950 hover:text-primary transition-colors block mt-0.5">
            {{ contacts.usa.phone }}
          </a>
          <p v-if="contacts.usa.note" class="text-xs text-gray-500 mt-1">{{ contacts.usa.note }}</p>
        </div>
      </div>

      <!-- Dushanbe Contact -->
      <div v-if="contacts.tajikistan" class="card p-6 border border-gray-150 flex items-center gap-4 bg-white hover:shadow-md transition-all">
        <div class="w-14 h-14 rounded-2xl bg-green-50 border border-green-100 flex items-center justify-center text-3xl">
          {{ contacts.tajikistan.flag || '🇹🇯' }}
        </div>
        <div>
          <p class="text-xs text-gray-400 uppercase font-semibold tracking-wider">{{ contacts.tajikistan.label }}</p>
          <div class="flex flex-col sm:flex-row sm:gap-4 mt-0.5">
            <a v-for="phone in tajikistanPhones" :key="phone.display"
              :href="'tel:' + (phone.raw || phone.display)"
              class="text-base font-bold text-gray-950 hover:text-primary transition-colors">
              {{ phone.display }}
            </a>
          </div>
          <p v-if="contacts.tajikistan.note" class="text-xs text-gray-500 mt-1">{{ contacts.tajikistan.note }}</p>
        </div>
      </div>
    </div>

    <!-- Email & working hours (managed in the admin panel → Контент сайта) -->
    <div v-if="contacts.email || contacts.working_hours"
      class="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
      <a v-if="contacts.email" :href="'mailto:' + contacts.email"
        class="card p-6 border border-gray-150 flex items-center gap-4 bg-white hover:shadow-md transition-all no-underline">
        <div class="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-3xl">
          ✉️
        </div>
        <div>
          <p class="text-xs text-gray-400 uppercase font-semibold tracking-wider">Email</p>
          <p class="text-base font-bold text-gray-950 mt-0.5 break-all">{{ contacts.email }}</p>
        </div>
      </a>

      <div v-if="contacts.working_hours"
        class="card p-6 border border-gray-150 flex items-center gap-4 bg-white">
        <div class="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-3xl">
          🕒
        </div>
        <div>
          <p class="text-xs text-gray-400 uppercase font-semibold tracking-wider">Часы работы</p>
          <p class="text-base font-bold text-gray-950 mt-0.5">{{ contacts.working_hours }}</p>
        </div>
      </div>
    </div>

    <!-- Warehouse & Office Locations -->
    <div v-if="locations.length" class="mb-12">
      <h2 class="text-2xl font-bold text-gray-900 mb-6">📍 Адреса пунктов приема и складов</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div v-for="loc in locations" :key="loc.name"
          class="bg-white rounded-2xl border border-gray-150 p-6 hover:shadow-md transition-all flex flex-col justify-between"
          :class="loc.highlight ? 'border-primary-300 ring-2 ring-primary ring-opacity-5' : ''">
          <div>
            <div class="flex justify-between items-start mb-4">
              <span class="text-3xl">{{ loc.icon }}</span>
              <span v-if="loc.badge" class="text-[10px] font-bold bg-primary-100 text-primary border border-primary-200 px-2 py-0.5 rounded-full uppercase tracking-wider">
                {{ loc.badge }}
              </span>
            </div>
            <h3 class="font-bold text-gray-900 text-lg mb-2">{{ loc.name }}</h3>
            <p class="text-sm font-medium text-gray-700 bg-gray-50 p-3 rounded-xl border border-gray-100 font-mono select-all mb-4">
              {{ loc.address }}
            </p>
            <p class="text-xs text-gray-500 leading-relaxed mb-4" v-if="loc.desc">
              {{ loc.desc }}
            </p>
          </div>
          <div v-if="loc.phone" class="pt-4 border-t border-gray-100 flex items-center justify-between text-xs">
            <span class="text-gray-500">Контакты представителя:</span>
            <a :href="'tel:' + (loc.phone_raw || loc.phone)" class="font-semibold text-primary hover:underline">
              {{ loc.phone }}
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- Contact Form -->
    <div class="card p-8 border border-gray-150 bg-white">
      <h2 class="text-xl font-bold mb-2 text-gray-950">Написать нам сообщение</h2>
      <p class="text-gray-500 text-sm mb-6">Если у вас возникли вопросы, заполните форму ниже и мы ответим в течение нескольких часов.</p>

      <form @submit.prevent="sendMessage" class="space-y-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="form-label">Имя</label>
            <input v-model="form.name" type="text" required class="input-field" placeholder="Ваше имя" />
          </div>
          <div>
            <label class="form-label">Email</label>
            <input v-model="form.email" type="email" required class="input-field" placeholder="email@example.com" />
          </div>
        </div>
        <div>
          <label class="form-label">Тема</label>
          <input v-model="form.subject" type="text" class="input-field" placeholder="Тема обращения" />
        </div>
        <div>
          <label class="form-label">Сообщение</label>
          <textarea v-model="form.message" required rows="4" class="input-field resize-none"
            placeholder="Ваше сообщение..."></textarea>
        </div>
        <button type="submit" :disabled="sending" class="btn btn-primary">
          {{ sending ? 'Отправляем...' : 'Отправить сообщение' }}
        </button>
        <div v-if="sent" class="p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-600">
          Сообщение отправлено! Мы свяжемся с вами в ближайшее время.
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { useSiteContentStore } from '@/stores/siteContent.js'

export default {
  name: 'ContactsPage',

  data() {
    return {
      form: { name: '', email: '', subject: '', message: '' },
      sending: false,
      sent: false
    }
  },

  computed: {
    contacts() {
      return useSiteContentStore().contacts
    },
    tajikistanPhones() {
      return (this.contacts.tajikistan && this.contacts.tajikistan.phones) || []
    },
    locations() {
      return useSiteContentStore().locations
    }
  },

  methods: {
    async sendMessage() {
      this.sending = true
      await new Promise(r => setTimeout(r, 1000))
      this.sent = true
      this.sending = false
      this.form = { name: '', email: '', subject: '', message: '' }
    }
  },

  mounted() {
    useSiteContentStore().load()
  }
}
</script>
