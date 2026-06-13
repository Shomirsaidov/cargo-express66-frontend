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
import { warehousesAPI } from '@/api/index.js'
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
        notes: ''
      },
      warehouses: []
    }
  },

  computed: {
    trackingStore() { return useTrackingStore() },
    trackingNumbers() { return this.trackingStore.trackingNumbers },
    loading() { return this.trackingStore.loading }
  },

  methods: {
    openAddModal() {
      this.editingItem = null
      this.form = { tracking_number: '', store_name: '', country_of_origin: '', warehouse_id: '', notes: '' }
      this.showModal = true
    },
    editItem(item) {
      this.editingItem = item
      this.form = {
        tracking_number: item.tracking_number,
        store_name: item.store_name || '',
        country_of_origin: item.country_of_origin || '',
        warehouse_id: item.warehouse_id || '',
        notes: item.notes || ''
      }
      this.showModal = true
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
        if (this.editingItem) {
          result = await this.trackingStore.updateTrackingNumber(this.editingItem.id, this.form)
        } else {
          result = await this.trackingStore.addTrackingNumber(this.form)
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

  async mounted() {
    await this.trackingStore.fetchTrackingNumbers()
    try {
      const r = await warehousesAPI.getAll()
      this.warehouses = r.data.data || r.data || []
    } catch (e) {
      this.warehouses = [
        { id: '1', name: 'USA Warehouse' },
        { id: '2', name: 'Germany Warehouse' }
      ]
    }
  }
}
</script>
