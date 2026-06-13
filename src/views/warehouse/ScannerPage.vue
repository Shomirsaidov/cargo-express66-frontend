<template>
  <div class="max-w-4xl mx-auto p-4 sm:p-6">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
      <div>
        <h1 class="page-title">{{ $t('warehouse.scanner') }}</h1>
        <p class="text-sm text-gray-500 mt-1">Быстрое оприходование посылок на складе</p>
      </div>

      <!-- Warehouse selector -->
      <div class="flex items-center gap-2">
        <label class="text-sm font-medium text-gray-600">Текущий склад:</label>
        <select v-model="selectedWarehouseId" class="input-field w-52 bg-white" @change="saveWarehousePreference">
          <option v-for="w in warehouses" :key="w.id" :value="w.id">
            {{ w.name }} ({{ w.country }})
          </option>
        </select>
      </div>
    </div>

    <!-- Scan Input Card -->
    <div class="card p-6 mb-6 border-primary bg-primary-50/20">
      <div class="max-w-xl mx-auto text-center">
        <label class="block text-base font-semibold text-gray-700 mb-3">
          {{ $t('warehouse.scanParcel') }}
        </label>
        <div class="relative">
          <input
            ref="scanInput"
            v-model="trackingInput"
            type="text"
            :placeholder="$t('warehouse.scanPlaceholder')"
            class="input-field text-lg py-3 px-4 pl-12 font-mono"
            @keyup.enter="handleScan"
            :disabled="scanning"
          />
          <svg class="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"/>
          </svg>
        </div>
        <div class="flex items-center justify-center gap-2 mt-3 text-xs text-gray-500">
          <span class="inline-block w-2.5 h-2.5 bg-green-500 rounded-full animate-ping"></span>
          <span>Готов к сканированию... Нажмите Enter после ввода</span>
        </div>
      </div>
    </div>

    <!-- Loading scanner -->
    <div v-if="scanning" class="text-center py-12">
      <div class="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      <p class="text-sm text-gray-500 mt-2">Поиск трек-кода в системе...</p>
    </div>

    <!-- Scanner Result Page -->
    <div v-else-if="result" class="card p-6 border-t-4" :class="resultCardBorder">
      <div class="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
        <div>
          <span class="badge" :class="resultBadgeClass">{{ resultActionLabel }}</span>
          <p class="text-lg font-mono font-bold text-gray-900 mt-1">{{ result.tracking_number }}</p>
        </div>
        <button @click="resetScan" class="btn btn-ghost btn-sm text-gray-400 hover:text-gray-600">
          Сбросить ×
        </button>
      </div>

      <!-- Result Messages -->
      <div class="mb-6 p-3 rounded-lg text-sm bg-gray-50 text-gray-700">
        {{ result.message }}
      </div>

      <!-- Flow: If parcel already exists (action: found) -->
      <div v-if="result.action === 'found'">
        <div class="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p class="text-xs text-gray-400">Текущий статус</p>
            <StatusBadge :status="result.parcel.status" class="mt-1" />
          </div>
          <div>
            <p class="text-xs text-gray-400">Вес (кг)</p>
            <p class="text-sm font-medium mt-1">{{ result.parcel.weight || 'Не указан' }}</p>
          </div>
          <div>
            <p class="text-xs text-gray-400">Получатель</p>
            <p class="text-sm font-medium mt-1">
              {{ result.parcel.customers ? `${result.parcel.customers.last_name} ${result.parcel.customers.first_name}` : 'Неизвестно' }}
            </p>
          </div>
          <div>
            <p class="text-xs text-gray-400">ID клиента</p>
            <p class="text-sm font-mono mt-1">{{ result.parcel.customers?.customer_code || '—' }}</p>
          </div>
        </div>

        <div class="border-t border-gray-100 pt-4">
          <label class="form-label">Обновить статус посылки:</label>
          <div class="flex gap-2">
            <select v-model="quickStatus" class="input-field w-52">
              <option value="received_at_warehouse">Принять на склад</option>
              <option value="processing">В обработку</option>
              <option value="ready_for_pickup">Готов к выдаче</option>
              <option value="delivered">Доставлено</option>
            </select>
            <button @click="updateStatus" class="btn btn-primary" :disabled="saving">
              {{ $t('common.save') }}
            </button>
          </div>
        </div>
      </div>

      <!-- Flow: Pre-registered or Unknown Recipient -->
      <div v-else>
        <form @submit.prevent="saveParcel" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Customer Section -->
            <div class="card p-4 bg-gray-50 border-0">
              <h3 class="font-semibold text-sm mb-3">👤 Информация о клиенте</h3>

              <!-- Pre-registered client details -->
              <div v-if="selectedCustomer" class="space-y-2">
                <div class="flex justify-between items-center text-sm">
                  <span class="text-gray-500">Клиент:</span>
                  <span class="font-medium text-gray-900">{{ selectedCustomer.last_name }} {{ selectedCustomer.first_name }}</span>
                </div>
                <div class="flex justify-between items-center text-sm">
                  <span class="text-gray-500">ID:</span>
                  <span class="font-mono text-primary font-semibold">{{ selectedCustomer.customer_code }}</span>
                </div>
                <div class="flex justify-between items-center text-sm">
                  <span class="text-gray-500">Телефон:</span>
                  <span class="text-gray-900">{{ selectedCustomer.phone || '—' }}</span>
                </div>
                <button v-if="result.action === 'unknown' || result.action === 'pre_registered'" type="button" @click="clearCustomer"
                  class="text-xs text-danger hover:underline mt-2 block">
                  Изменить клиента / Назначить заново
                </button>
              </div>

              <!-- Customer lookup/search -->
              <div v-else class="space-y-3">
                <p class="text-xs text-red-500">Получатель не указан. Найдите клиента в системе:</p>
                <div class="relative">
                  <input
                    v-model="customerQuery"
                    type="text"
                    placeholder="Поиск по имени, ID, email..."
                    class="input-field py-1.5 text-xs"
                    @input="searchCustomers"
                  />
                  <div v-if="searchingCustomers" class="absolute right-3 top-1/2 -translate-y-1/2">
                    <div class="w-3.5 h-3.5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                  </div>
                </div>

                <!-- Customer search results list -->
                <div v-if="customerResults.length > 0" class="max-h-32 overflow-y-auto border border-gray-200 rounded-lg bg-white divide-y divide-gray-100">
                  <div v-for="c in customerResults" :key="c.id" @click="selectCustomer(c)"
                    class="p-2 text-xs hover:bg-primary-50 cursor-pointer transition-colors flex justify-between items-center">
                    <div>
                      <p class="font-medium text-gray-800">{{ c.last_name }} {{ c.first_name }}</p>
                      <p class="text-gray-400 font-mono">{{ c.customer_code }}</p>
                    </div>
                    <span class="text-primary hover:underline">Выбрать</span>
                  </div>
                </div>
                <p v-else-if="customerQuery.trim().length > 1" class="text-xs text-gray-400 italic">Ничего не найдено. Посылка будет создана без получателя (Unknown Recipient).</p>
              </div>
            </div>

            <!-- Parcel Parameters -->
            <div class="space-y-3">
              <div>
                <label class="form-label">{{ $t('warehouse.enterWeight') }} (кг):</label>
                <input
                  v-model="form.weight"
                  type="number"
                  step="0.01"
                  required
                  placeholder="0.00"
                  class="input-field font-semibold text-lg"
                  ref="weightField"
                />
              </div>

              <div>
                <label class="form-label">Размеры (ДхШхВ см, необязательно):</label>
                <input
                  v-model="form.dimensions"
                  type="text"
                  placeholder="30x20x15"
                  class="input-field font-mono"
                />
              </div>

              <div>
                <label class="form-label">Объявленная стоимость ($):</label>
                <input
                  v-model="form.declared_value"
                  type="number"
                  step="0.1"
                  placeholder="0.00"
                  class="input-field"
                />
              </div>
            </div>
          </div>

          <div>
            <label class="form-label">Заметки / Примечания:</label>
            <textarea
              v-model="form.notes"
              rows="2"
              placeholder="Дефекты упаковки, специфические условия..."
              class="input-field"
            ></textarea>
          </div>

          <!-- Photo upload integration -->
          <div class="border-t border-gray-100 pt-4">
            <label class="form-label mb-2 block">Прикрепить фотографии посылки:</label>
            <PhotoUpload ref="photoUploader" v-model:photos="form.photos" multiple />
          </div>

          <!-- Actions -->
          <div class="flex gap-3 border-t border-gray-100 pt-4">
            <button type="button" @click="resetScan" class="btn btn-ghost flex-1 border border-gray-200">
              {{ $t('common.cancel') }}
            </button>
            <button type="submit" class="btn btn-primary flex-1 py-3 text-base" :disabled="saving">
              <span v-if="saving" class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
              {{ $t('warehouse.saveAndScan') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { scannerAPI, warehousesAPI, parcelsAPI } from '@/api/index.js'
import StatusBadge from '@/components/common/StatusBadge.vue'
import PhotoUpload from '@/components/common/PhotoUpload.vue'

export default {
  name: 'WarehouseScannerPage',

  components: { StatusBadge, PhotoUpload },

  data() {
    return {
      warehouses: [],
      selectedWarehouseId: null,
      trackingInput: '',
      scanning: false,
      saving: false,
      result: null,

      // For found flow
      quickStatus: 'received_at_warehouse',

      // For creation flow
      selectedCustomer: null,
      customerQuery: '',
      searchingCustomers: false,
      customerResults: [],

      form: {
        weight: '',
        dimensions: '',
        declared_value: '',
        notes: '',
        photos: []
      }
    }
  },

  computed: {
    resultCardBorder() {
      if (!this.result) return ''
      if (this.result.action === 'found') return 'border-t-green-500'
      if (this.result.action === 'pre_registered') return 'border-t-blue-500'
      return 'border-t-yellow-500'
    },
    resultBadgeClass() {
      if (!this.result) return ''
      if (this.result.action === 'found') return 'bg-green-100 text-green-700'
      if (this.result.action === 'pre_registered') return 'bg-blue-100 text-blue-700'
      return 'bg-yellow-100 text-yellow-700'
    },
    resultActionLabel() {
      if (!this.result) return ''
      if (this.result.action === 'found') return 'Найдено в системе'
      if (this.result.action === 'pre_registered') return 'Ожидается клиентом'
      return 'Неизвестный трек-номер'
    }
  },

  methods: {
    saveWarehousePreference() {
      localStorage.setItem('preferred_warehouse_id', this.selectedWarehouseId)
    },

    async handleScan() {
      const code = this.trackingInput.trim()
      if (!code) return

      this.scanning = true
      this.result = null
      this.selectedCustomer = null
      this.customerQuery = ''
      this.customerResults = []
      this.form = {
        weight: '',
        dimensions: '',
        declared_value: '',
        notes: '',
        photos: []
      }

      try {
        const r = await scannerAPI.scanParcel(code)
        this.result = r.data.data

        if (this.result.action === 'pre_registered' && this.result.customer) {
          this.selectedCustomer = this.result.customer
        }

        // Set focus to weight field after UI renders
        this.$nextTick(() => {
          if (this.$refs.weightField) {
            this.$refs.weightField.focus()
          }
        })
      } catch (e) {
        alert('Ошибка при сканировании трек-номера')
      } finally {
        this.scanning = false
        this.trackingInput = ''
      }
    },

    async searchCustomers() {
      const q = this.customerQuery.trim()
      if (q.length < 2) {
        this.customerResults = []
        return
      }

      this.searchingCustomers = true
      try {
        const r = await scannerAPI.searchCustomers(q)
        this.customerResults = r.data.data?.users || r.data.data || []
      } catch (e) {
        this.customerResults = []
      } finally {
        this.searchingCustomers = false
      }
    },

    selectCustomer(customer) {
      this.selectedCustomer = customer
      this.customerResults = []
      this.customerQuery = ''
    },

    clearCustomer() {
      this.selectedCustomer = null
    },

    resetScan() {
      this.result = null
      this.selectedCustomer = null
      this.customerQuery = ''
      this.customerResults = []
      this.$nextTick(() => {
        this.$refs.scanInput.focus()
      })
    },

    // Convert Base64 Data URLs to Blobs for Multer File Upload
    dataURLtoBlob(dataurl) {
      const arr = dataurl.split(',')
      const mime = arr[0].match(/:(.*?);/)[1]
      const bstr = atob(arr[1])
      let n = bstr.length
      const u8arr = new Uint8Array(n)
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }
      return new Blob([u8arr], { type: mime })
    },

    async saveParcel() {
      if (!this.selectedWarehouseId) {
        alert('Пожалуйста, выберите склад!')
        return
      }

      this.saving = true
      try {
        const fd = new FormData()
        fd.append('tracking_number', this.result.tracking_number)
        fd.append('warehouse_id', this.selectedWarehouseId)

        if (this.selectedCustomer) {
          fd.append('customer_id', this.selectedCustomer.id)
        }

        if (this.form.weight) fd.append('weight', this.form.weight)
        if (this.form.dimensions) fd.append('dimensions', this.form.dimensions)
        if (this.form.declared_value) fd.append('declared_value', this.form.declared_value)
        if (this.form.notes) fd.append('notes', this.form.notes)

        // Convert and append base64 photos
        this.form.photos.forEach((base64, index) => {
          const blob = this.dataURLtoBlob(base64)
          fd.append('photos', blob, `scanner_photo_${index}.jpg`)
        })

        await scannerAPI.receiveParcel(fd)
        alert('Посылка успешно сохранена!')
        this.resetScan()
      } catch (e) {
        alert(e.response?.data?.error || 'Ошибка сохранения посылки')
      } finally {
        this.saving = false
      }
    },

    async updateStatus() {
      this.saving = true
      try {
        await scannerAPI.assignCustomer(this.result.parcel.id, this.result.parcel.customer_id)
        await parcelsAPI.updateStatus(this.result.parcel.id, this.quickStatus)
        alert('Статус посылки изменен!')
        this.resetScan()
      } catch (e) {
        alert('Ошибка обновления статуса')
      } finally {
        this.saving = false
      }
    },

    async loadWarehouses() {
      try {
        const r = await warehousesAPI.getAll()
        this.warehouses = r.data.data || []
        if (this.warehouses.length > 0) {
          const preferred = localStorage.getItem('preferred_warehouse_id')
          if (preferred && this.warehouses.some(w => String(w.id) === String(preferred))) {
            this.selectedWarehouseId = preferred
          } else {
            this.selectedWarehouseId = this.warehouses[0].id
          }
        }
      } catch (e) {
        console.error('Failed to load warehouses')
      }
    }
  },

  async mounted() {
    await this.loadWarehouses()
    this.$nextTick(() => {
      if (this.$refs.scanInput) {
        this.$refs.scanInput.focus()
      }
    })
  }
}
</script>
