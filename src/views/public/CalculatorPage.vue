<template>
  <div class="max-w-4xl mx-auto px-4 py-12">
    <div class="text-center mb-10">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">{{ $t('calculator.title') }}</h1>
      <p class="text-gray-500">{{ $t('calculator.subtitle') }}</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Calculator form -->
      <div class="card">
        <h2 class="section-title mb-6">Параметры доставки</h2>

        <form @submit.prevent="calculate" class="space-y-5">
          <!-- Country -->
          <div class="form-group">
            <label class="form-label">{{ $t('calculator.country') }}</label>
            <select v-model="form.country" class="input-field" required>
              <option value="">{{ $t('calculator.selectCountry') }}</option>
              <option value="usa">{{ $t('calculator.usa') }}</option>
              <option value="germany">{{ $t('calculator.germany') }}</option>
            </select>
          </div>

          <!-- Weight -->
          <div class="form-group">
            <label class="form-label">{{ $t('calculator.weight') }}</label>
            <div class="relative">
              <input v-model.number="form.weight" type="number" min="0.1" step="0.1" required
                class="input-field pr-12" placeholder="0.0" />
              <span class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">кг</span>
            </div>
          </div>

          <!-- Declared value -->
          <div class="form-group">
            <label class="form-label">Объявленная стоимость (USD)</label>
            <div class="relative">
              <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
              <input v-model.number="form.declared_value" type="number" min="0" step="0.01"
                class="input-field pl-7" placeholder="0.00" />
            </div>
          </div>

          <!-- Additional services -->
          <div class="form-group">
            <label class="form-label">{{ $t('calculator.additionalServices') }}</label>
            <div class="space-y-2">
              <label v-for="service in availableServices" :key="service.id"
                class="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-primary hover:bg-primary-50 transition-all"
                :class="{ 'border-primary bg-primary-50': isServiceSelected(service.id) }">
                <input type="checkbox" :value="service.id" v-model="form.services"
                  class="rounded border-gray-300 text-primary" />
                <div class="flex-1">
                  <p class="text-sm font-medium text-gray-800">{{ service.name }}</p>
                  <p class="text-xs text-gray-500">{{ service.description }}</p>
                </div>
                <span class="text-sm font-semibold text-primary">${{ service.price }}</span>
              </label>
            </div>
          </div>

          <button type="submit" :disabled="!form.country || !form.weight || loading"
            class="btn btn-primary w-full btn-lg">
            <svg v-if="loading" class="animate-spin w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            {{ $t('calculator.calculate') }}
          </button>
        </form>
      </div>

      <!-- Results -->
      <div>
        <div v-if="result" class="card">
          <h2 class="section-title mb-6">Результат расчёта</h2>

          <!-- Delivery time badge -->
          <div class="flex items-center gap-2 mb-6 p-3 bg-primary-50 rounded-xl">
            <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <div>
              <p class="text-xs text-gray-500">{{ $t('calculator.deliveryTime') }}</p>
              <p class="font-semibold text-primary">{{ result.delivery_time }}</p>
            </div>
          </div>

          <div class="space-y-3">
            <div class="flex justify-between items-center py-2 border-b border-gray-100">
              <span class="text-sm text-gray-600">{{ $t('calculator.deliveryCost') }}</span>
              <span class="font-semibold">${{ result.delivery_cost?.toFixed(2) }}</span>
            </div>
            <div v-if="result.insurance_cost > 0"
              class="flex justify-between items-center py-2 border-b border-gray-100">
              <span class="text-sm text-gray-600">{{ $t('calculator.insuranceCost') }}</span>
              <span class="font-semibold">${{ result.insurance_cost?.toFixed(2) }}</span>
            </div>
            <div v-if="result.services_cost > 0"
              class="flex justify-between items-center py-2 border-b border-gray-100">
              <span class="text-sm text-gray-600">{{ $t('calculator.servicesCost') }}</span>
              <span class="font-semibold">${{ result.services_cost?.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between items-center py-3 bg-primary-50 rounded-xl px-4">
              <span class="font-bold text-gray-900 text-lg">{{ $t('calculator.totalCost') }}</span>
              <span class="font-bold text-xl text-primary">${{ result.total?.toFixed(2) }}</span>
            </div>
          </div>

          <RouterLink to="/register"
            class="btn btn-primary w-full mt-6 no-underline">
            Зарегистрироваться и отправить
          </RouterLink>
        </div>

        <!-- Placeholder -->
        <div v-else class="card text-center py-12">
          <div class="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 11h.01M12 11h.01M15 11h.01M3 5h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
            </svg>
          </div>
          <p class="text-gray-500">Заполните форму и нажмите "{{ $t('calculator.calculate') }}"</p>
        </div>

        <!-- Tariff info -->
        <div class="mt-4 card">
          <h3 class="font-semibold text-gray-800 mb-3">Тарифы</h3>
          <div class="space-y-2">
            <div v-for="tariff in tariffInfo" :key="tariff.country"
              class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p class="font-medium text-sm text-gray-800">{{ tariff.country }}</p>
                <p class="text-xs text-gray-500">{{ tariff.time }}</p>
              </div>
              <div class="text-right">
                <p class="font-semibold text-primary text-sm">${{ tariff.price }}/кг</p>
                <p class="text-xs text-gray-400">мин. ${{ tariff.min }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { calculatorAPI, servicesAPI } from '@/api/index.js'

export default {
  name: 'CalculatorPage',

  data() {
    return {
      form: {
        country: '',
        weight: '',
        declared_value: 0,
        services: []
      },
      result: null,
      loading: false,
      availableServices: [
        { id: 'insurance', name: 'Страхование', description: 'Защита на случай повреждения', price: 5 },
        { id: 'inspection', name: 'Осмотр посылки', description: 'Проверка содержимого', price: 3 },
        { id: 'defect_check', name: 'Проверка дефектов', description: 'Фото при получении', price: 2 },
        { id: 'photo', name: 'Фото-верификация', description: '5+ фотографий посылки', price: 2 }
      ],
      tariffInfo: [
        { country: '🇺🇸 США', time: '6-10 дней', price: '8.00', min: '10' },
        { country: '🇩🇪 Германия', time: '7-14 дней', price: '7.00', min: '8' }
      ]
    }
  },

  methods: {
    isServiceSelected(id) {
      return this.form.services.includes(id)
    },

    async calculate() {
      this.loading = true
      try {
        // Try API first
        const response = await calculatorAPI.calculate({
          country: this.form.country,
          weight: this.form.weight,
          declared_value: this.form.declared_value,
          services: this.form.services
        })
        this.result = response.data
      } catch (err) {
        // Fallback local calculation
        this.result = this.calculateLocally()
      } finally {
        this.loading = false
      }
    },

    calculateLocally() {
      const rates = { usa: { price: 8, min: 10, time: '6-10 дней' }, germany: { price: 7, min: 8, time: '7-14 дней' } }
      const rate = rates[this.form.country]
      if (!rate) return null

      const delivery = Math.max(this.form.weight * rate.price, rate.min)
      const insurance = this.form.services.includes('insurance')
        ? (this.form.declared_value || 0) * 0.03
        : 0
      const servicesCost = this.availableServices
        .filter(s => this.form.services.includes(s.id) && s.id !== 'insurance')
        .reduce((sum, s) => sum + s.price, 0)

      return {
        delivery_cost: delivery,
        insurance_cost: insurance,
        services_cost: servicesCost,
        total: delivery + insurance + servicesCost,
        delivery_time: rate.time
      }
    }
  },

  mounted() {
    // Load services from API if available
    servicesAPI.getAll().then(r => {
      if (r.data && r.data.length > 0) {
        this.availableServices = r.data
      }
    }).catch(() => {})
  }
}
</script>
