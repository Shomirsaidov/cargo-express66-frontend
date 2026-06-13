<template>
  <div class="max-w-4xl mx-auto px-4 py-12">
    <div class="text-center mb-12">
      <h1 class="text-3xl font-bold text-gray-900 mb-3">{{ $t('nav.contacts') }}</h1>
      <p class="text-gray-500">Свяжитесь с нами любым удобным способом</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div v-for="contact in contacts" :key="contact.label" class="card text-center">
        <div class="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center mx-auto mb-3">
          <span class="text-2xl">{{ contact.icon }}</span>
        </div>
        <h3 class="font-semibold mb-2">{{ contact.label }}</h3>
        <p class="text-gray-600 text-sm">{{ contact.value }}</p>
      </div>
    </div>

    <div class="card">
      <h2 class="text-xl font-bold mb-6">Написать нам</h2>
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
export default {
  name: 'ContactsPage',
  data() {
    return {
      form: { name: '', email: '', subject: '', message: '' },
      sending: false,
      sent: false,
      contacts: [
        { icon: '📧', label: 'Email', value: 'info@cargoexpress66.com' },
        { icon: '📱', label: 'Телефон', value: '+992 XX XXX XXXX' },
        { icon: '🕐', label: 'Рабочие часы', value: 'Пн-Пт: 9:00 - 18:00' }
      ]
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
  }
}
</script>
