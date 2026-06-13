<template>
  <div class="max-w-4xl mx-auto px-4 py-12">
    <div class="text-center mb-12">
      <h1 class="text-3xl font-bold text-gray-900 mb-3">{{ $t('nav.howItWorks') }}</h1>
      <p class="text-gray-500 text-lg">Простой процесс в 5 шагов</p>
    </div>

    <div class="space-y-6">
      <div v-for="(step, index) in steps" :key="index"
        class="card flex items-start gap-6">
        <div class="w-14 h-14 rounded-2xl bg-primary text-white font-bold text-xl flex items-center justify-center flex-shrink-0">
          {{ index + 1 }}
        </div>
        <div>
          <h3 class="text-lg font-bold mb-2">{{ step.title }}</h3>
          <p class="text-gray-600 leading-relaxed">{{ step.desc }}</p>
        </div>
      </div>
    </div>

    <div class="mt-10 text-center">
      <RouterLink to="/register" class="btn btn-primary btn-lg no-underline">
        Начать пользоваться
      </RouterLink>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HowItWorksPage',
  computed: {
    steps() {
      return [
        { title: 'Регистрация', desc: 'Создайте бесплатный аккаунт и получите персональный номер клиента и адрес нашего склада в США или Германии.' },
        { title: 'Покупка в интернет-магазине', desc: 'Делайте покупки в любых интернет-магазинах США и Германии. При оформлении заказа укажите адрес нашего склада как адрес доставки.' },
        { title: 'Добавьте номер отслеживания', desc: 'После оформления заказа добавьте трек-номер в личном кабинете. Это поможет нам быстро идентифицировать вашу посылку.' },
        { title: 'Посылка прибывает на склад', desc: 'Наши сотрудники принимают посылку, взвешивают, фотографируют и уведомляют вас.' },
        { title: 'Отправка и доставка', desc: 'Посылка отправляется авиарейсом в Таджикистан. После прохождения таможни вы получаете уведомление и можете забрать посылку.' }
      ]
    }
  }
}
</script>
