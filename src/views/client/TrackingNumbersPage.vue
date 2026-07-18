<template>
  <div class="p-4 sm:p-6 max-w-2xl mx-auto">
    <div class="flex items-center justify-between mb-6">
      <h1 class="page-title">{{ $t('tracking.title') }}</h1>
      <button @click="openAddModal" class="btn btn-primary btn-sm">
        + {{ $t('tracking.addTracking') }}
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-12">
      <div class="inline-block w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>

    <!-- Empty state -->
    <div v-else-if="trackingNumbers.length === 0" class="card text-center py-12">
      <div class="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
      </div>
      <p class="text-gray-500 font-medium">{{ $t('tracking.noTracking') }}</p>
      <p class="text-gray-400 text-sm mt-1">{{ $t('tracking.addFirst') }}</p>
      <button @click="openAddModal" class="btn btn-primary mt-4">
        {{ $t('tracking.addTracking') }}
      </button>
    </div>

    <!-- List -->
    <div v-else class="space-y-3">
      <div v-for="item in trackingNumbers" :key="item.id"
        class="card hover:border-primary hover:shadow-sm transition-all">
        <div class="flex items-start justify-between">
          <div class="min-w-0 flex-1">
            <p class="font-bold text-gray-900 truncate">{{ item.tracking_number }}</p>
            <div class="flex items-center gap-3 mt-1 flex-wrap">
              <span v-if="item.store_name"
                class="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                🛍️ {{ item.store_name }}
              </span>
              <span v-if="item.country_of_origin"
                class="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                {{ countryFlag(item.country_of_origin) }} {{ item.country_of_origin }}
              </span>
              <span v-if="item.warehouse_name"
                class="text-xs bg-green-50 text-green-600 px-2 py-0.5 rounded-full">
                🏭 {{ item.warehouse_name }}
              </span>
            </div>
            <p v-if="item.notes" class="text-xs text-gray-400 mt-1 truncate">{{ item.notes }}</p>
          </div>
          <div class="flex gap-2 ml-3 flex-shrink-0">
            <button @click="editItem(item)"
              class="p-2 text-gray-400 hover:text-primary hover:bg-primary-50 rounded-lg transition-all">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
              </svg>
            </button>
            <button @click="confirmDelete(item)"
              class="p-2 text-gray-400 hover:text-danger hover:bg-red-50 rounded-lg transition-all">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <Teleport to="body">
      <transition name="fade">
        <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
          <transition name="slide-up">
            <div v-if="showModal" class="modal-content">
              <div class="p-6">
                <h2 class="text-lg font-bold mb-5">
                  {{ editingItem ? $t('tracking.editTracking') : $t('tracking.addTracking') }}
                </h2>

                <form @submit.prevent="saveTracking" class="space-y-4">
                  <div class="form-group">
                    <label class="form-label">{{ $t('tracking.trackingNumber') }} *</label>
                    <input v-model="form.tracking_number" type="text" required class="input-field"
                      placeholder="1Z999AA10123456784" />
                  </div>

                  <div class="form-group">
                    <label class="form-label">{{ $t('tracking.storeName') }}</label>
                    <input v-model="form.store_name" type="text" class="input-field"
                      placeholder="Amazon, eBay, ASOS..." />
                  </div>

                  <div class="form-group">
                    <label class="form-label">{{ $t('tracking.countryOfOrigin') }}</label>
                    <select v-model="form.country_of_origin" class="input-field">
                      <option value="">Выберите страну</option>
                      <option value="USA">🇺🇸 {{ $t('tracking.usa') }}</option>
                      <option value="Germany">🇩🇪 {{ $t('tracking.germany') }}</option>
                    </select>
                  </div>

                  <div class="form-group">
                    <label class="form-label">{{ $t('tracking.warehouseSelect') }}</label>
                    <select v-model="form.warehouse_id" class="input-field">
                      <option value="">Выберите склад</option>
                      <option v-for="w in warehouses" :key="w.id" :value="w.id">{{ w.name }}</option>
                    </select>
                  </div>

                  <div class="form-group">
                    <label class="form-label">{{ $t('tracking.notes') }}</label>
                    <textarea v-model="form.notes" rows="2" class="input-field resize-none"
                      placeholder="Дополнительные заметки..."></textarea>
                  </div>

                  <!-- Existing parcel weight notice or estimated weight input -->
                  <div v-if="existingParcelWeight" class="p-3 bg-green-50 text-green-700 text-xs rounded-lg">
                    Посылка уже принята на складе. Фактический вес: <strong>{{ existingParcelWeight }} кг</strong>
                  </div>
                  <div v-else class="form-group">
                    <label class="form-label">Ориентировочный вес (кг) для расчета стоимости:</label>
                    <input v-model="form.estimated_weight" type="number" step="0.1" min="0" class="input-field"
                      placeholder="Например: 1.5" />
                  </div>

                  <!-- Additional Services Checklist -->
                  <div class="form-group" v-if="availableServices.length > 0">
                    <label class="form-label font-bold text-gray-700">Дополнительные услуги:</label>
                    <div class="space-y-2 mt-2 bg-gray-50 p-3 rounded-lg border border-gray-100">
                      <div v-for="service in availableServices" :key="service.id" class="flex items-start">
                        <input type="checkbox" :id="'service_' + service.id" :value="service.id" v-model="form.additional_services"
                          class="rounded border-gray-300 text-primary focus:ring-primary w-4 h-4 mr-2 mt-0.5 cursor-pointer" />
                        <label :for="'service_' + service.id" class="text-sm text-gray-700 cursor-pointer select-none flex-1">
                          <span class="font-medium text-gray-900">{{ getServiceNameRu(service) }}</span>
                          <span class="text-gray-400 font-medium ml-1">
                            ({{ service.price_type === 'percentage' ? service.percentage + '%' : '+$' + service.price }})
                          </span>
                          <p class="text-xs text-gray-400 mt-0.5" v-if="service.description">
                            {{ service.description }}
                          </p>
                        </label>
                      </div>
                    </div>
                  </div>

                  <!-- Declared value input (if Insurance is selected) -->
                  <div v-if="isInsuranceSelected" class="form-group bg-blue-50 border border-blue-100 p-3 rounded-lg">
                    <label class="form-label text-blue-900">Стоимость товара ($) *</label>
                    <input v-model.number="form.declared_value" type="number" step="0.1" min="0" required class="input-field border-blue-200 focus:border-primary"
                      placeholder="Введите объявленную стоимость..." />
                  </div>

                  <!-- Calculation Breakdown -->
                  <div class="bg-gray-50 rounded-xl p-4 space-y-2 border border-gray-100">
                    <h4 class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Расчет стоимости</h4>
                    <div class="flex justify-between text-sm">
                      <span class="text-gray-600">Доставка:</span>
                      <span class="font-semibold text-gray-900">
                        {{ deliveryCost ? '$' + deliveryCost.toFixed(2) : '— (определяется при взвешивании)' }}
                      </span>
                    </div>
                    <div class="flex justify-between text-sm">
                      <span class="text-gray-600">Дополнительные услуги:</span>
                      <span class="font-semibold text-gray-900">${{ additionalServicesCost.toFixed(2) }}</span>
                    </div>
                    <div v-if="isInsuranceSelected" class="flex justify-between text-sm">
                      <span class="text-gray-600">Страхование:</span>
                      <span class="font-semibold text-gray-900">${{ insuranceCost.toFixed(2) }}</span>
                    </div>
                    <div class="flex justify-between text-base font-bold pt-2 border-t border-gray-200">
                      <span class="text-gray-800">Итого:</span>
                      <span class="text-primary">${{ totalCost.toFixed(2) }}</span>
                    </div>
                  </div>

                  <div class="flex gap-3 pt-2">
                    <button type="button" @click="closeModal" class="btn btn-ghost flex-1 border border-gray-200">
                      {{ $t('common.cancel') }}
                    </button>
                    <button type="submit" :disabled="saving" class="btn btn-primary flex-1">
                      {{ saving ? $t('common.loading') : $t('common.save') }}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </transition>
        </div>
      </transition>
    </Teleport>

    <!-- Confirm delete modal -->
    <ConfirmModal
      :is-open="showDeleteConfirm"
      :message="$t('tracking.confirmDelete')"
      type="danger"
      @confirm="deleteTracking"
      @update:is-open="showDeleteConfirm = $event"
    />
  </div>
</template>

<script>
import { useTrackingStore } from '@/stores/tracking.js'
import { warehousesAPI, servicesAPI, tariffsAPI, parcelsAPI } from '@/api/index.js'
import ConfirmModal from '@/components/common/ConfirmModal.vue'

export default {
  name: 'TrackingNumbersPage',

  components: { ConfirmModal },

  data() {
    return {
      showModal: false,
      showDeleteConfirm: false,
      editingItem: null,
      deletingItem: null,
      saving: false,
      form: {
        tracking_number: '',
        store_name: '',
        country_of_origin: '',
        warehouse_id: '',
        notes: '',
        additional_services: [],
        declared_value: 0,
        estimated_weight: ''
      },
      warehouses: [],
      availableServices: [],
      tariffs: [],
      existingParcelWeight: null
    }
  },

  computed: {
    trackingStore() { return useTrackingStore() },
    trackingNumbers() { return this.trackingStore.trackingNumbers },
    loading() { return this.trackingStore.loading },
    isInsuranceSelected() {
      const insuranceService = this.availableServices.find(s => s.name.toLowerCase().includes('insurance'));
      return insuranceService && this.form.additional_services.includes(insuranceService.id);
    },
    insuranceCost() {
      if (!this.isInsuranceSelected) return 0;
      const insuranceService = this.availableServices.find(s => s.name.toLowerCase().includes('insurance'));
      if (!insuranceService) return 0;
      const value = parseFloat(this.form.declared_value) || 0;
      return (value * parseFloat(insuranceService.percentage)) / 100;
    },
    additionalServicesCost() {
      let sum = 0;
      this.form.additional_services.forEach(id => {
        const service = this.availableServices.find(s => s.id === id);
        if (service && service.price_type === 'fixed') {
          sum += parseFloat(service.price) || 0;
        }
      });
      return sum;
    },
    deliveryCost() {
      if (this.existingParcelWeight) {
        return this.calculateDeliveryCostForWeight(this.existingParcelWeight);
      }
      if (this.form.estimated_weight) {
        return this.calculateDeliveryCostForWeight(parseFloat(this.form.estimated_weight));
      }
      return 0;
    },
    totalCost() {
      return this.deliveryCost + this.additionalServicesCost + this.insuranceCost;
    }
  },

  methods: {
    getServiceNameRu(service) {
      const name = service.name.toLowerCase();
      if (name.includes('insurance')) return 'Страхование';
      if (name.includes('inspection')) return 'Проверить товар';
      if (name.includes('photo')) return 'Сделать фото';
      if (name.includes('functionality')) return 'Проверить работоспособность';
      if (name.includes('packaging') || name.includes('repackaging')) return 'Дополнительная упаковка';
      return service.name;
    },
    calculateDeliveryCostForWeight(weight) {
      if (!weight) return 0;
      let country = this.form.country_of_origin;
      if (!country && this.form.warehouse_id) {
        const wh = this.warehouses.find(w => w.id === this.form.warehouse_id);
        if (wh) country = wh.country;
      }
      if (!country) return 0;
      const tariff = this.tariffs.find(t => t.country.toLowerCase() === country.toLowerCase() && t.is_active);
      if (!tariff) return 0;
      return Math.max(weight * parseFloat(tariff.price_per_kg), parseFloat(tariff.minimum_charge));
    },
    async checkExistingParcel() {
      const trackNum = this.form.tracking_number.trim();
      if (!trackNum) {
        this.existingParcelWeight = null;
        return;
      }
      try {
        const r = await parcelsAPI.getByTracking(trackNum);
        const parcel = r.data.data || r.data;
        if (parcel && parcel.id) {
          this.existingParcelWeight = parseFloat(parcel.weight) || null;
        } else {
          this.existingParcelWeight = null;
        }
      } catch (e) {
        this.existingParcelWeight = null;
      }
    },
    openAddModal() {
      this.editingItem = null
      this.form = {
        tracking_number: '',
        store_name: '',
        country_of_origin: '',
        warehouse_id: '',
        notes: '',
        additional_services: [],
        declared_value: 0,
        estimated_weight: ''
      }
      this.existingParcelWeight = null
      this.showModal = true
    },
    editItem(item) {
      this.editingItem = item
      this.form = {
        tracking_number: item.tracking_number,
        store_name: item.store_name || '',
        country_of_origin: item.country_of_origin || '',
        warehouse_id: item.warehouse_id || '',
        notes: item.notes || '',
        additional_services: item.additional_services || [],
        declared_value: item.declared_value || 0,
        estimated_weight: ''
      }
      this.showModal = true
      this.checkExistingParcel()
    },
    closeModal() {
      this.showModal = false
      this.editingItem = null
    },
    confirmDelete(item) {
      this.deletingItem = item
      this.showDeleteConfirm = true
    },
    async saveTracking() {
      this.saving = true
      try {
        let result
        const payload = {
          tracking_number: this.form.tracking_number,
          store_name: this.form.store_name,
          country_of_origin: this.form.country_of_origin,
          warehouse_id: this.form.warehouse_id,
          notes: this.form.notes,
          additional_services: this.form.additional_services,
          declared_value: this.form.declared_value
        }
        if (this.editingItem) {
          result = await this.trackingStore.updateTrackingNumber(this.editingItem.id, payload)
        } else {
          result = await this.trackingStore.addTrackingNumber(payload)
        }
        if (result.success) {
          this.closeModal()
        }
      } finally {
        this.saving = false
      }
    },
    async deleteTracking() {
      if (this.deletingItem) {
        await this.trackingStore.deleteTrackingNumber(this.deletingItem.id)
        this.deletingItem = null
      }
    },
    countryFlag(country) {
      if (!country) return ''
      if (country.toLowerCase().includes('usa') || country.toLowerCase() === 'usa') return '🇺🇸'
      if (country.toLowerCase().includes('germany') || country.toLowerCase().includes('german')) return '🇩🇪'
      return '🌍'
    }
  },

  watch: {
    'form.tracking_number': {
      handler() {
        this.checkExistingParcel();
      }
    }
  },

  async mounted() {
    await this.trackingStore.fetchTrackingNumbers()
    try {
      const r = await warehousesAPI.getAll()
      this.warehouses = r.data.data || r.data || []
    } catch (e) {
      this.warehouses = []
    }
    try {
      const s = await servicesAPI.getAll()
      this.availableServices = (s.data.data || s.data || []).filter(srv => srv.is_active)
    } catch (e) {
      this.availableServices = []
    }
    try {
      const t = await tariffsAPI.getAll()
      this.tariffs = (t.data.data || t.data || []).filter(trf => trf.is_active)
    } catch (e) {
      this.tariffs = []
    }
  }
}
</script>
