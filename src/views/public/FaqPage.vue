<template>
  <div class="max-w-3xl mx-auto px-4 py-12">
    <div class="text-center mb-12">
      <h1 class="text-3xl font-bold text-gray-900 mb-3">{{ $t('nav.faq') }}</h1>
      <p class="text-gray-500">Ответы на часто задаваемые вопросы</p>
    </div>

    <div class="space-y-3">
      <div v-for="(item, index) in faqs" :key="index"
        class="card cursor-pointer"
        @click="toggle(index)">
        <div class="flex items-center justify-between">
          <h3 class="font-semibold text-gray-900 pr-4">{{ item.q }}</h3>
          <svg class="w-5 h-5 text-gray-400 flex-shrink-0 transition-transform"
            :class="{ 'rotate-180': openIndex === index }"
            fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
          </svg>
        </div>
        <transition name="slide-up">
          <p v-if="openIndex === index" class="mt-3 text-gray-600 text-sm leading-relaxed border-t border-gray-100 pt-3">
            {{ item.a }}
          </p>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FaqPage',
  data() {
    return {
      openIndex: null,
      faqs: [
        { q: 'Как узнать адрес склада в США?', a: 'Адреса наших складов приема в США указаны в разделе "Контакты". Для интернет-покупок используйте безналоговый склад в штате Делавэр: 1680 Porter Rd, Suite A-3, Bear, DE 19701, указав свой ID клиента.' },
        { q: 'Сколько стоит доставка?', a: 'Стоимость доставки обычного груза по весу составляет: до 100 кг – $16/кг, от 100 кг – $15/кг, от 1000 кг – $11/кг. Для техники действуют фиксированные тарифы (например, MacBook/ноутбуки/iPhone – $100, iPad – $70, AirPods – $20, часы – $30).' },
        { q: 'Как долго идёт посылка?', a: 'Доставка из США занимает 6-10 рабочих дней, из Германии — 7-14 рабочих дней. Сроки зависят от расписания авиарейсов и скорости таможенного оформления.' },
        { q: 'Как рассчитывается вес и округление?', a: 'Вес до 1 кг округляется до 1 кг (например, 0.4 кг рассчитывается как 1 кг). Если вес составляет 1.0 кг и выше (например, 1.2 кг или 2.8 кг), расчет ведется строго по фактическому весу.' },
        { q: 'Как отследить посылку?', a: 'Вы можете ввести трек-номер на странице отслеживания или отслеживать все свои посылки в личном кабинете после регистрации.' },
        { q: 'Что нельзя отправлять?', a: 'Запрещены оружие, боеприпасы, лекарства без рецепта, опасные жидкости, литиевые аккумуляторы отдельно от приборов, алкоголь и табачные изделия. Полный список смотрите на странице Условий.' },
        { q: 'Есть ли страхование?', a: 'Да, вы можете застраховать вашу посылку. Стоимость страховки составляет 2% от объявленной ценности товара. Это гарантирует возмещение в случае утери груза.' }
      ]
    }
  },
  methods: {
    toggle(index) {
      this.openIndex = this.openIndex === index ? null : index
    }
  }
}
</script>
