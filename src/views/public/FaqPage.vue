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
        { q: 'Как узнать адрес склада в США?', a: 'После регистрации в личном кабинете в разделе "Профиль" вы найдёте персональный адрес нашего склада в США.' },
        { q: 'Сколько стоит доставка?', a: 'Из США: $8 за кг, минимум $10. Из Германии: $7 за кг, минимум $8. Используйте наш калькулятор для точного расчёта.' },
        { q: 'Как долго идёт посылка?', a: 'Из США: 6-10 рабочих дней. Из Германии: 7-14 рабочих дней. Сроки могут меняться из-за таможни и загруженности рейсов.' },
        { q: 'Как отследить посылку?', a: 'Добавьте трек-номер в личном кабинете или воспользуйтесь формой отслеживания на нашем сайте.' },
        { q: 'Что нельзя отправлять?', a: 'Запрещены: опасные вещества, оружие, наркотики, скоропортящиеся продукты, живые животные. Ознакомьтесь с полным списком в Правилах перевозки.' },
        { q: 'Есть ли страхование?', a: 'Да, вы можете застраховать посылку при создании отправления. Стоимость страховки — 3% от объявленной стоимости товара.' }
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
