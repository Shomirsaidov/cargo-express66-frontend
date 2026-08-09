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
      <div class="card p-6 border border-gray-150 flex items-center gap-4 bg-white hover:shadow-md transition-all">
        <div class="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-3xl">
          🇺🇸
        </div>
        <div>
          <p class="text-xs text-gray-400 uppercase font-semibold tracking-wider">Связь в США</p>
          <a href="tel:+15185284810" class="text-xl font-bold text-gray-950 hover:text-primary transition-colors block mt-0.5">
            +1 (518) 528-4810
          </a>
          <p class="text-xs text-gray-500 mt-1">Звонки, сообщения, WhatsApp/Telegram</p>
        </div>
      </div>

      <!-- Dushanbe Contact -->
      <div class="card p-6 border border-gray-150 flex items-center gap-4 bg-white hover:shadow-md transition-all">
        <div class="w-14 h-14 rounded-2xl bg-green-50 border border-green-100 flex items-center justify-center text-3xl">
          🇹🇯
        </div>
        <div>
          <p class="text-xs text-gray-400 uppercase font-semibold tracking-wider">Связь в Таджикистане (Душанбе)</p>
          <div class="flex flex-col sm:flex-row sm:gap-4 mt-0.5">
            <a href="tel:+992929744499" class="text-base font-bold text-gray-950 hover:text-primary transition-colors">
              +992 929 74 44 99
            </a>
            <a href="tel:+992927784086" class="text-base font-bold text-gray-950 hover:text-primary transition-colors">
              +992 927 78 40 86
            </a>
          </div>
          <p class="text-xs text-gray-500 mt-1">Поддержка клиентов, выдача посылок</p>
        </div>
      </div>
    </div>

    <!-- Warehouse & Office Locations -->
    <div class="mb-12">
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
          <div class="pt-4 border-t border-gray-100 flex items-center justify-between text-xs">
            <span class="text-gray-500">Контакты представителя:</span>
            <a :href="'tel:' + loc.phoneRaw" class="font-semibold text-primary hover:underline">
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
export default {
  name: 'ContactsPage',
  data() {
    return {
      form: { name: '', email: '', subject: '', message: '' },
      sending: false,
      sent: false,
      locations: [
        { 
          icon: '🗽', 
          name: 'New York Office', 
          address: '1729 73rd Street, Brooklyn, NY 11204', 
          phone: '+1 (646) 740-7752', 
          phoneRaw: '+16467407752', 
          desc: 'Склад приёма посылок в Бруклине.' 
        },
        { 
          icon: '🏛️', 
          name: 'Washington, D.C. & Virginia', 
          address: '9411 Lee Hwy Apt G9, Fairfax, VA 22031', 
          phone: '+1 (518) 528-4810', 
          phoneRaw: '+15185284810', 
          desc: 'Склад обслуживания клиентов в регионе Вирджиния / Вашингтон.' 
        },
        { 
          icon: '🔔', 
          name: 'Philadelphia collection point', 
          address: '1811 Rhawn St, Philadelphia, PA 19111', 
          phone: '+1 (267) 746-8442', 
          phoneRaw: '+12677468442', 
          badge: 'Новый пункт',
          desc: 'Пункт приема посылок в Пенсильвании. Весь собранный груз отправляется в Делавэр раз в неделю по четвергам.' 
        },
        { 
          icon: '🛡️', 
          name: 'Delaware Main Warehouse', 
          address: '1680 Porter Rd, Suite A-3, Bear, DE 19701', 
          phone: '+1 (518) 528-4810', 
          phoneRaw: '+15185284810', 
          highlight: true,
          badge: 'Обязательный для онлайн-покупок',
          desc: 'Безналоговый склад в штате Делавэр. Указывайте именно этот адрес при заказе из любых интернет-магазинов США.' 
        }
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
