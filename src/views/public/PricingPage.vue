<template>
  <div class="max-w-4xl mx-auto px-4 py-12">
    <div class="text-center mb-12">
      <h1 class="text-3xl font-bold text-gray-900 mb-3">{{ $t('nav.pricing') }}</h1>
      <p class="text-gray-500 text-lg">Прозрачные тарифы без скрытых платежей</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
      <div v-for="tariff in tariffs" :key="tariff.country"
        class="card border-2 hover:border-primary transition-all">
        <div class="flex items-center gap-3 mb-6">
          <span class="text-4xl">{{ tariff.flag }}</span>
          <div>
            <h2 class="text-xl font-bold">{{ tariff.country }}</h2>
            <p class="text-gray-500 text-sm">{{ tariff.route }}</p>
          </div>
        </div>
        <div class="space-y-3">
          <div class="flex justify-between">
            <span class="text-gray-600">Цена за кг</span>
            <span class="font-bold text-primary text-lg">${{ tariff.price_per_kg }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Минимальная оплата</span>
            <span class="font-semibold">${{ tariff.min_charge }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Срок доставки</span>
            <span class="font-semibold">{{ tariff.time }}</span>
          </div>
        </div>
        <div class="mt-6 pt-4 border-t border-gray-100">
          <RouterLink :to="'/calculator'" class="btn btn-outline w-full no-underline">
            Рассчитать стоимость
          </RouterLink>
        </div>
      </div>
    </div>

    <div class="card">
      <h2 class="text-xl font-bold mb-4">Дополнительные услуги</h2>
      <div class="overflow-x-auto">
        <table class="min-w-full">
          <thead>
            <tr class="border-b border-gray-200">
              <th class="text-left py-3 text-sm font-semibold text-gray-600">Услуга</th>
              <th class="text-right py-3 text-sm font-semibold text-gray-600">Стоимость</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="service in services" :key="service.name">
              <td class="py-3 text-gray-800">{{ service.name }}</td>
              <td class="py-3 text-right font-semibold text-primary">${{ service.price }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PricingPage',
  data() {
    return {
      tariffs: [
        { flag: '🇺🇸', country: 'США', route: 'USA → Таджикистан', price_per_kg: '8.00', min_charge: '10', time: '6-10 дней' },
        { flag: '🇩🇪', country: 'Германия', route: 'Germany → Таджикистан', price_per_kg: '7.00', min_charge: '8', time: '7-14 дней' }
      ],
      services: [
        { name: 'Страхование (3% от стоимости)', price: 'от 3%' },
        { name: 'Осмотр посылки', price: '3' },
        { name: 'Проверка дефектов', price: '2' },
        { name: 'Тест электроники', price: '5' },
        { name: 'Фото-верификация', price: '2' }
      ]
    }
  }
}
</script>
