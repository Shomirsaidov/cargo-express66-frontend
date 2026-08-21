<template>
  <div class="max-w-4xl mx-auto px-4 py-12">
    <div class="text-center mb-10">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">{{ $t('calculator.title') }}</h1>
      <p class="text-gray-500">Рассчитайте ориентировочную стоимость доставки по новым тарифам</p>
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
              <option v-for="t in tariffsList" :key="t.id" :value="t.country.toLowerCase()">
                {{ getCountryLabel(t.country) }}
              </option>
            </select>
          </div>

          <!-- Cargo Type Select -->
          <div class="form-group">
            <label class="form-label">Тип груза</label>
            <select v-model="form.cargo_type" class="input-field" required>
              <option value="regular">Обычный груз (расчет по весу)</option>
              <option value="tech">Электроника / Техника (фикс. тариф)</option>
            </select>
          </div>

          <!-- Tech Device Selection -->
          <div class="form-group" v-if="form.cargo_type === 'tech'">
            <label class="form-label">Выберите устройство</label>
            <select v-model="form.tech_type" class="input-field" required>
              <option value="">-- Выберите устройство --</option>
              <option value="macbook">MacBook (меньше 3кг) — ${{ getTechRate('macbook') }}</option>
              <option value="laptop">Ноутбук (меньше 3кг) — ${{ getTechRate('laptop') }}</option>
              <option value="iphone">iPhone — ${{ getTechRate('iphone') }}</option>
              <option value="watch">Apple Watch / Smart Watch — ${{ getTechRate('watch') }}</option>
              <option value="ipad">iPad — ${{ getTechRate('ipad') }}</option>
              <option value="airpods">AirPods — ${{ getTechRate('airpods') }}</option>
              <option value="meta_glasses">Meta Очки — ${{ getTechRate('meta_glasses') }}</option>
              <option value="airpods_max">AirPods Max — ${{ getTechRate('airpods_max') }}</option>
              <option value="ebook">E-book — ${{ getTechRate('ebook') }}</option>
              <option value="ps5_xbox">PlayStation 5 / Xbox Series X — по весу</option>
            </select>
          </div>

          <!-- Weight (Required only if cargo is regular or ps5_xbox) -->
          <div class="form-group" v-if="form.cargo_type === 'regular' || form.tech_type === 'ps5_xbox'">
            <label class="form-label">{{ $t('calculator.weight') }}</label>
            <div class="relative">
              <input v-model.number="form.weight" type="number" min="0.1" step="0.1" required
                class="input-field pr-12" placeholder="0.0" />
              <span class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">кг</span>
            </div>
            <p class="text-[10px] text-gray-400 mt-1 leading-relaxed">
              * Вес округляется до 1 кг, если он менее 1 кг. Более 1 кг рассчитывается по фактическому весу.
            </p>
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
                <span class="text-sm font-semibold text-primary">
                  {{ service.price_type === 'percentage' ? service.percentage + '%' : '$' + service.price }}
                </span>
              </label>
            </div>
          </div>

          <button type="submit" :disabled="!form.country || (form.cargo_type === 'regular' && !form.weight) || loading"
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

          <!-- Alert for special items -->
          <div v-if="form.cargo_type === 'tech' && form.tech_type === 'ps5_xbox'" class="mb-4 p-3 bg-yellow-50 text-yellow-800 text-xs rounded-xl border border-yellow-100">
            <strong>Обратите внимание:</strong> Для PlayStation 5 и Xbox Series X тариф рассчитывается по фактическому весу либо согласовывается отдельно с администратором.
          </div>

          <div class="space-y-3">
            <div class="flex justify-between items-center py-2 border-b border-gray-100">
              <span class="text-sm text-gray-600">Стоимость доставки</span>
              <span class="font-semibold">${{ result.delivery_cost?.toFixed(2) }}</span>
            </div>
            <div v-if="result.insurance_cost > 0"
              class="flex justify-between items-center py-2 border-b border-gray-100">
              <span class="text-sm text-gray-600">Страхование груза</span>
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
            class="btn btn-primary w-full mt-6 no-underline text-center justify-center">
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

        <!-- Tariff info summary -->
        <div class="mt-4 card">
          <h3 class="font-semibold text-gray-800 mb-3">Сетка тарифов (по весу) — {{ selectedTariff ? getCountryLabel(selectedTariff.country) : 'США' }}</h3>
          <div class="space-y-2">
            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p class="font-medium text-xs text-gray-800">До 100 кг</p>
              </div>
              <div class="text-right">
                <p class="font-semibold text-primary text-xs">${{ activeBasePrice }}/кг</p>
              </div>
            </div>
            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p class="font-medium text-xs text-gray-800">От 100 кг</p>
              </div>
              <div class="text-right">
                <p class="font-semibold text-primary text-xs">${{ Math.max(1, activeBasePrice - 1) }}/кг</p>
              </div>
            </div>
            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p class="font-medium text-xs text-gray-800">От 1000 кг</p>
              </div>
              <div class="text-right">
                <p class="font-semibold text-primary text-xs">${{ Math.max(1, activeBasePrice - 5) }}/кг</p>
              </div>
            </div>
            <div class="flex items-center justify-between p-3 bg-amber-50/50 rounded-lg border border-amber-100/50 mt-1">
              <div>
                <p class="font-medium text-xs text-amber-800">Минимальный заказ</p>
              </div>
              <div class="text-right">
                <p class="font-semibold text-amber-800 text-xs">${{ selectedTariff ? selectedTariff.minimum_charge : 10 }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { calculatorAPI, servicesAPI, tariffsAPI } from '@/api/index.js'

export default {
  name: 'CalculatorPage',

  data() {
    return {
      tariffsList: [],
      form: {
        country: '',
        cargo_type: 'regular',
        tech_type: '',
        weight: '',
        declared_value: 0,
        services: []
      },
      result: null,
      loading: false,
      availableServices: [
        { id: 'insurance', name: 'Страхование', description: 'Страховка (2% от стоимости)', price: 0, percentage: 2, price_type: 'percentage' },
        { id: 'f8b65003-8d46-4ab5-8e46-db4e4e1b6789', name: 'Осмотр товара', description: 'Проверка содержимого', price: 5, price_type: 'fixed' },
        { id: 'fa976004-9e57-4c06-8f57-eb5e5e2c7890', name: 'Проверка работоспособности', description: 'Проверка работоспособности приборов', price: 10, price_type: 'fixed' },
        { id: '11111111-2222-3333-4444-555555555555', name: 'Сделать фото', description: 'Детальные фото товаров', price: 2, price_type: 'fixed' },
        { id: '22222222-3333-4444-5555-666666666666', name: 'Дополнительная упаковка', description: 'Безопасная защитная упаковка', price: 2, price_type: 'fixed' }
      ]
    }
  },

  computed: {
    selectedTariff() {
      return this.tariffsList.find(t => t.country.toLowerCase() === this.form.country.toLowerCase())
    },
    activeBasePrice() {
      if (this.selectedTariff) {
        return parseFloat(this.selectedTariff.price_per_kg)
      }
      // Fallback
      return 16
    }
  },

  methods: {
    isServiceSelected(id) {
      return this.form.services.includes(id)
    },

    getCountryLabel(country) {
      const c = country.toLowerCase()
      if (c.includes('usa') || c.includes('сша')) return this.$t('calculator.usa')
      if (c.includes('germany') || c.includes('германи')) return this.$t('calculator.germany')
      if (c.includes('spain') || c.includes('испани')) return this.$t('calculator.spain')
      if (c.includes('italy') || c.includes('итали')) return this.$t('calculator.italy')
      if (c.includes('uk') || c.includes('англия') || c.includes('великобрита')) return this.$t('calculator.uk') || 'Великобритания'
      return country
    },

    getTechRate(type) {
      const defaults = {
        macbook: 100,
        laptop: 100,
        iphone: 100,
        watch: 30,
        ipad: 70,
        airpods: 20,
        meta_glasses: 20,
        airpods_max: 25,
        ebook: 15
      }
      if (this.selectedTariff && this.selectedTariff.tech_rates && typeof this.selectedTariff.tech_rates === 'object') {
        return this.selectedTariff.tech_rates[type] !== undefined ? this.selectedTariff.tech_rates[type] : defaults[type]
      }
      return defaults[type]
    },

    async calculate() {
      this.loading = true
      try {
        // Prepare request payload matching new tech schema
        const response = await calculatorAPI.calculate({
          country: this.form.country,
          weight: this.form.cargo_type === 'tech' && this.form.tech_type !== 'ps5_xbox' ? 1.0 : this.form.weight,
          declared_value: this.form.declared_value,
          service_ids: this.form.services,
          item_type: this.form.cargo_type === 'tech' ? this.form.tech_type : 'regular'
        })
        
        // Map backend response fields
        const backendData = response.data?.data || response.data
        if (backendData) {
          // Adjust response keys from backend API
          this.result = {
            delivery_cost: backendData.delivery_cost,
            insurance_cost: backendData.services?.find(s => s.name?.toLowerCase().includes('insurance') || s.service_id === 'insurance')?.cost || 0,
            services_cost: backendData.services?.filter(s => !s.name?.toLowerCase().includes('insurance') && s.service_id !== 'insurance').reduce((sum, s) => sum + s.cost, 0) || backendData.services_cost,
            total: backendData.total_cost || backendData.total,
            delivery_time: backendData.tariff?.delivery_time || (this.form.country === 'germany' ? '7-14 дней' : '6-10 дней')
          }
        } else {
          this.result = this.calculateLocally()
        }
      } catch (err) {
        console.warn('API error, falling back to local calculation:', err)
        this.result = this.calculateLocally()
      } finally {
        this.loading = false
      }
    },

    calculateLocally() {
      const weightVal = parseFloat(this.form.weight || 0)
      let baseCost = 0

      const techRates = {
        macbook: 100,
        laptop: 100,
        iphone: 100,
        watch: 30,
        ipad: 70,
        airpods: 20,
        meta_glasses: 20,
        airpods_max: 25,
        ebook: 15
      }

      if (this.selectedTariff && this.selectedTariff.tech_rates && typeof this.selectedTariff.tech_rates === 'object') {
        Object.assign(techRates, this.selectedTariff.tech_rates)
      }

      const isTechItem = this.form.cargo_type === 'tech' && this.form.tech_type !== 'ps5_xbox'
      if (isTechItem && techRates[this.form.tech_type]) {
        baseCost = techRates[this.form.tech_type]
      } else {
        // Enforce weight calculation logic locally using dynamic rates
        const basePrice = this.activeBasePrice
        const minimumCharge = this.selectedTariff ? parseFloat(this.selectedTariff.minimum_charge) : 10
        const calculatedWeight = weightVal < 1.0 ? 1.0 : weightVal
        
        let rate = basePrice
        if (calculatedWeight >= 1000) {
          rate = Math.max(1, basePrice - 5)
        } else if (calculatedWeight >= 100) {
          rate = Math.max(1, basePrice - 1)
        }
        baseCost = calculatedWeight * rate
        if (baseCost < minimumCharge) {
          baseCost = minimumCharge
        }
      }

      // Calculate insurance
      const isInsurance = this.form.services.includes('insurance')
      const insuranceCost = isInsurance ? (this.form.declared_value || 0) * 0.02 : 0

      // Calculate other fixed services
      const servicesCost = this.availableServices
        .filter(s => this.form.services.includes(s.id) && s.id !== 'insurance')
        .reduce((sum, s) => sum + (parseFloat(s.price) || 0), 0)

      return {
        delivery_cost: baseCost,
        insurance_cost: insuranceCost,
        services_cost: servicesCost,
        total: baseCost + insuranceCost + servicesCost,
        delivery_time: this.selectedTariff?.delivery_time || ((this.form.country === 'germany' || this.form.country === 'spain' || this.form.country === 'italy') ? '7-14 дней' : '6-10 дней')
      }
    }
  },

  async mounted() {
    // Load active tariffs from API
    try {
      const r = await tariffsAPI.getPublic()
      this.tariffsList = r.data?.data || r.data || []
    } catch (e) {
      console.error('Failed to load tariffs:', e)
    }

    // Load services from API if available
    servicesAPI.getAll().then(r => {
      const fetched = r.data?.data || r.data || []
      if (fetched.length > 0) {
        // Map services but retain fallback IDs for local fallback
        this.availableServices = fetched.map(fs => {
          const isIns = fs.name?.toLowerCase().includes('insurance') || fs.price_type === 'percentage'
          return {
            id: fs.id,
            name: fs.name,
            description: fs.description || (isIns ? 'Страховка (2% от стоимости)' : ''),
            price: parseFloat(fs.price) || 0,
            percentage: parseFloat(fs.percentage) || 2,
            price_type: fs.price_type || (isIns ? 'percentage' : 'fixed')
          }
        })
      }
    }).catch(() => {})
  }
}
</script>
