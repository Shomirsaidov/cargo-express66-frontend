<template>
  <div class="max-w-3xl mx-auto px-4 py-12">
    <div class="text-center mb-10">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">{{ $t('publicTracking.title') }}</h1>
      <p class="text-gray-500">{{ $t('publicTracking.subtitle') }}</p>
    </div>

    <!-- Search form -->
    <div class="card mb-8">
      <div class="flex gap-3">
        <input
          v-model="trackingNumber"
          type="text"
          :placeholder="$t('publicTracking.placeholder')"
          class="input-field flex-1 text-base"
          @keyup.enter="track"
        />
        <button @click="track" :disabled="!trackingNumber.trim() || loading"
          class="btn btn-primary btn-lg flex-shrink-0">
          <svg v-if="loading" class="animate-spin w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
          {{ $t('publicTracking.trackBtn') }}
        </button>
      </div>
    </div>

    <!-- Not found -->
    <div v-if="notFound" class="card text-center py-10">
      <div class="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <svg class="w-8 h-8 text-danger" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
      </div>
      <h3 class="font-semibold text-gray-800 mb-1">{{ $t('publicTracking.notFound') }}</h3>
      <p class="text-sm text-gray-500">Проверьте правильность номера и попробуйте снова</p>
    </div>

    <!-- Parcel info -->
    <div v-if="parcel">
      <!-- Status card -->
      <div class="card mb-4">
        <div class="flex items-start justify-between mb-4">
          <div>
            <p class="text-xs text-gray-500 mb-1">{{ $t('shipments.trackingNumber') }}</p>
            <p class="font-bold text-lg text-gray-900">{{ parcel.tracking_number }}</p>
          </div>
          <StatusBadge :status="parcel.status" />
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div v-if="parcel.weight">
            <p class="text-xs text-gray-500">{{ $t('shipments.weight') }}</p>
            <p class="font-medium">{{ parcel.weight }} кг</p>
          </div>
          <div v-if="parcel.warehouse_name">
            <p class="text-xs text-gray-500">{{ $t('shipments.warehouse') }}</p>
            <p class="font-medium">{{ parcel.warehouse_name }}</p>
          </div>
          <div v-if="parcel.arrival_date">
            <p class="text-xs text-gray-500">{{ $t('shipments.arrivalDate') }}</p>
            <p class="font-medium">{{ formatDate(parcel.arrival_date) }}</p>
          </div>
        </div>
      </div>

      <!-- Status timeline -->
      <div class="card">
        <h3 class="section-title mb-6">{{ $t('publicTracking.statusHistory') }}</h3>
        <div v-if="parcel.status_history && parcel.status_history.length > 0" class="space-y-0">
          <div v-for="(item, index) in parcel.status_history" :key="index"
            class="relative flex gap-4">
            <!-- Line -->
            <div class="flex flex-col items-center">
              <div class="w-3 h-3 rounded-full mt-1 flex-shrink-0"
                :class="index === 0 ? 'bg-primary ring-4 ring-primary-100' : 'bg-gray-300'"></div>
              <div v-if="index < parcel.status_history.length - 1"
                class="w-0.5 flex-1 bg-gray-200 my-1 min-h-[2rem]"></div>
            </div>
            <!-- Content -->
            <div class="pb-4 min-w-0">
              <p class="font-medium text-sm text-gray-900">
                {{ $t(`statuses.${item.status}`) }}
              </p>
              <p v-if="item.note" class="text-xs text-gray-500 mt-0.5">{{ item.note }}</p>
              <p class="text-xs text-gray-400 mt-0.5">{{ formatDateTime(item.created_at) }}</p>
            </div>
          </div>
        </div>

        <!-- Fallback if no history but has status -->
        <div v-else class="flex gap-4">
          <div class="flex flex-col items-center">
            <div class="w-3 h-3 rounded-full bg-primary ring-4 ring-primary-100 mt-1"></div>
          </div>
          <div class="pb-4">
            <p class="font-medium text-sm text-gray-900">{{ $t(`statuses.${parcel.status}`) }}</p>
            <p class="text-xs text-gray-400 mt-0.5">{{ formatDateTime(parcel.updated_at) }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { parcelsAPI } from '@/api/index.js'
import StatusBadge from '@/components/common/StatusBadge.vue'

export default {
  name: 'TrackingPage',

  components: { StatusBadge },

  data() {
    return {
      trackingNumber: '',
      parcel: null,
      notFound: false,
      loading: false
    }
  },

  methods: {
    async track() {
      if (!this.trackingNumber.trim()) return
      this.loading = true
      this.parcel = null
      this.notFound = false

      try {
        const response = await parcelsAPI.getByTracking(this.trackingNumber.trim())
        this.parcel = response.data
      } catch (err) {
        if (err.response?.status === 404) {
          this.notFound = true
        }
      } finally {
        this.loading = false
      }
    },

    formatDate(dateStr) {
      if (!dateStr) return ''
      return new Date(dateStr).toLocaleDateString('ru-RU')
    },

    formatDateTime(dateStr) {
      if (!dateStr) return ''
      return new Date(dateStr).toLocaleString('ru-RU', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
      })
    }
  },

  mounted() {
    const query = this.$route.query.q
    if (query) {
      this.trackingNumber = query
      this.track()
    }
  }
}
</script>
