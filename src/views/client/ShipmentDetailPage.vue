<template>
  <div class="p-4 sm:p-6 max-w-2xl mx-auto">
    <!-- Back button -->
    <button @click="$router.back()" class="flex items-center gap-2 text-gray-600 hover:text-primary mb-5 text-sm">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
      </svg>
      Назад
    </button>

    <div v-if="loading" class="text-center py-12">
      <div class="inline-block w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>

    <div v-else-if="!parcel" class="card text-center py-10">
      <p class="text-gray-500">Отправление не найдено</p>
    </div>

    <div v-else>
      <!-- Header card -->
      <div class="card mb-4">
        <div class="flex items-start justify-between mb-4">
          <div>
            <p class="text-xs text-gray-500 mb-1">{{ $t('shipments.trackingNumber') }}</p>
            <p class="text-xl font-bold text-gray-900">{{ parcel.tracking_number }}</p>
          </div>
          <StatusBadge :status="parcel.status" />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div v-for="field in infoFields" :key="field.label">
            <p class="text-xs text-gray-500">{{ field.label }}</p>
            <p class="text-sm font-medium text-gray-800 mt-0.5">{{ field.value || '—' }}</p>
          </div>
        </div>
      </div>

      <!-- Costs card -->
      <div v-if="parcel.total_cost" class="card mb-4">
        <h3 class="section-title mb-4">Стоимость</h3>
        <div class="space-y-2">
          <div v-if="parcel.declared_value" class="flex justify-between text-sm">
            <span class="text-gray-600">{{ $t('shipments.declaredValue') }}</span>
            <span class="font-medium">${{ parcel.declared_value }}</span>
          </div>
          <div v-if="parcel.insurance_cost" class="flex justify-between text-sm">
            <span class="text-gray-600">{{ $t('shipments.insuranceCost') }}</span>
            <span class="font-medium">${{ parcel.insurance_cost }}</span>
          </div>
          <div v-if="parcel.additional_services_cost" class="flex justify-between text-sm">
            <span class="text-gray-600">{{ $t('shipments.additionalCost') }}</span>
            <span class="font-medium">${{ parcel.additional_services_cost }}</span>
          </div>
          <div class="flex justify-between py-2 border-t border-gray-100">
            <span class="font-bold">{{ $t('shipments.totalCost') }}</span>
            <span class="font-bold text-primary text-lg">${{ parcel.total_cost }}</span>
          </div>
        </div>
      </div>

      <!-- Photos -->
      <div class="card mb-4">
        <h3 class="section-title mb-4">{{ $t('shipments.photos') }}</h3>
        <div v-if="parcel.photos && parcel.photos.length > 0"
          class="grid grid-cols-3 gap-2">
          <div v-for="(photo, index) in parcel.photos" :key="index"
            class="aspect-square rounded-xl overflow-hidden cursor-pointer"
            @click="openPhoto(photo)">
            <img :src="photo.url || photo" :alt="`Фото ${index + 1}`"
              class="w-full h-full object-cover hover:opacity-90 transition-opacity" />
          </div>
        </div>
        <div v-else class="text-center py-6 text-gray-400 text-sm">
          {{ $t('shipments.noPhotos') }}
        </div>
      </div>

      <!-- Additional services -->
      <div v-if="parcel.additional_services && parcel.additional_services.length > 0" class="card mb-4">
        <h3 class="section-title mb-4">{{ $t('shipments.additionalServices') }}</h3>
        <div class="space-y-2">
          <div v-for="service in parcel.additional_services" :key="service.id"
            class="flex items-center gap-2 text-sm">
            <svg class="w-4 h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
            <span class="text-gray-700">{{ service.name }}</span>
            <span class="ml-auto text-primary font-medium">${{ service.price }}</span>
          </div>
        </div>
      </div>

      <!-- Status history -->
      <div class="card">
        <h3 class="section-title mb-5">{{ $t('shipments.history') }}</h3>
        <div v-if="parcel.status_history && parcel.status_history.length > 0">
          <div v-for="(item, index) in parcel.status_history" :key="index" class="relative flex gap-4">
            <div class="flex flex-col items-center">
              <div class="w-3 h-3 rounded-full mt-0.5 flex-shrink-0"
                :class="index === 0 ? 'bg-primary ring-4 ring-primary-100' : 'bg-gray-300'"></div>
              <div v-if="index < parcel.status_history.length - 1"
                class="w-0.5 flex-1 bg-gray-200 my-1 min-h-[1.5rem]"></div>
            </div>
            <div class="pb-4 min-w-0">
              <p class="text-sm font-medium text-gray-900">{{ $t(`statuses.${item.status}`) }}</p>
              <p v-if="item.note" class="text-xs text-gray-500 mt-0.5">{{ item.note }}</p>
              <p class="text-xs text-gray-400 mt-0.5">{{ formatDateTime(item.created_at) }}</p>
            </div>
          </div>
        </div>
        <div v-else class="text-center py-4 text-gray-400 text-sm">
          {{ $t('shipments.noHistory') }}
        </div>
      </div>
    </div>

    <!-- Photo lightbox -->
    <Teleport to="body">
      <transition name="fade">
        <div v-if="lightboxPhoto" class="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          @click="lightboxPhoto = null">
          <img :src="lightboxPhoto" alt="Photo" class="max-w-full max-h-full rounded-lg" />
        </div>
      </transition>
    </Teleport>
  </div>
</template>

<script>
import { useParcelsStore } from '@/stores/parcels.js'
import StatusBadge from '@/components/common/StatusBadge.vue'

export default {
  name: 'ShipmentDetailPage',
  components: { StatusBadge },

  data() {
    return {
      lightboxPhoto: null
    }
  },

  computed: {
    parcelsStore() { return useParcelsStore() },
    loading() { return this.parcelsStore.loading },
    parcel() { return this.parcelsStore.currentParcel },
    infoFields() {
      if (!this.parcel) return []
      return [
        { label: this.$t('shipments.weight'), value: this.parcel.weight ? `${this.parcel.weight} кг` : null },
        { label: this.$t('shipments.warehouse'), value: this.parcel.warehouse_name },
        { label: this.$t('shipments.arrivalDate'), value: this.formatDate(this.parcel.arrival_date) },
        { label: this.$t('shipments.shipmentDate'), value: this.formatDate(this.parcel.shipment_date) },
        { label: this.$t('shipments.deliveryDate'), value: this.formatDate(this.parcel.delivery_date) },
        { label: this.$t('shipments.createdAt'), value: this.formatDate(this.parcel.created_at) }
      ].filter(f => f.value)
    }
  },

  methods: {
    formatDate(d) {
      if (!d) return null
      return new Date(d).toLocaleDateString('ru-RU', { day: '2-digit', month: 'long', year: 'numeric' })
    },
    formatDateTime(d) {
      if (!d) return ''
      return new Date(d).toLocaleString('ru-RU', {
        day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
      })
    },
    openPhoto(photo) {
      this.lightboxPhoto = photo.url || photo
    }
  },

  mounted() {
    this.parcelsStore.fetchParcel(this.$route.params.id)
  },

  unmounted() {
    this.parcelsStore.clearCurrentParcel()
  }
}
</script>
