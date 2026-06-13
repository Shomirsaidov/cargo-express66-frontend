<template>
  <div class="p-4 sm:p-6 max-w-2xl mx-auto">
    <h1 class="page-title mb-4">{{ $t('shipments.title') }}</h1>

    <!-- Search and filter -->
    <div class="flex gap-3 mb-4">
      <div class="relative flex-1">
        <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
        <input v-model="searchQuery" type="text" :placeholder="$t('common.search')"
          class="input-field pl-9" />
      </div>
      <select v-model="statusFilter" class="input-field w-36">
        <option value="">{{ $t('common.all') }}</option>
        <option v-for="status in statusOptions" :key="status.value" :value="status.value">
          {{ status.label }}
        </option>
      </select>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-12">
      <div class="inline-block w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>

    <!-- Empty -->
    <div v-else-if="filteredParcels.length === 0" class="card text-center py-12">
      <svg class="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
      </svg>
      <p class="text-gray-400">{{ $t('dashboard.noShipments') }}</p>
    </div>

    <!-- Parcels list -->
    <div v-else class="space-y-3">
      <RouterLink
        v-for="parcel in filteredParcels" :key="parcel.id"
        :to="`/shipments/${parcel.id}`"
        class="card block hover:border-primary hover:shadow-sm transition-all no-underline group">
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0 flex-1">
            <div class="flex items-center gap-2 mb-1">
              <p class="font-bold text-gray-900 group-hover:text-primary truncate">
                {{ parcel.tracking_number }}
              </p>
            </div>
            <div class="flex items-center gap-3 flex-wrap">
              <span v-if="parcel.weight" class="text-xs text-gray-500">
                ⚖️ {{ parcel.weight }} кг
              </span>
              <span v-if="parcel.warehouse_name" class="text-xs text-gray-500">
                🏭 {{ parcel.warehouse_name }}
              </span>
              <span class="text-xs text-gray-400">
                {{ formatDate(parcel.created_at) }}
              </span>
            </div>
          </div>
          <StatusBadge :status="parcel.status" />
        </div>
      </RouterLink>
    </div>
  </div>
</template>

<script>
import { useParcelsStore } from '@/stores/parcels.js'
import StatusBadge from '@/components/common/StatusBadge.vue'

export default {
  name: 'ShipmentsPage',
  components: { StatusBadge },

  data() {
    return {
      searchQuery: '',
      statusFilter: ''
    }
  },

  computed: {
    parcelsStore() { return useParcelsStore() },
    loading() { return this.parcelsStore.loading },
    filteredParcels() {
      let list = this.parcelsStore.parcels
      if (this.statusFilter) {
        list = list.filter(p => p.status === this.statusFilter)
      }
      if (this.searchQuery.trim()) {
        const q = this.searchQuery.toLowerCase()
        list = list.filter(p =>
          p.tracking_number?.toLowerCase().includes(q) ||
          p.warehouse_name?.toLowerCase().includes(q)
        )
      }
      return list
    },
    statusOptions() {
      const statuses = [
        'awaiting_arrival', 'received_at_warehouse', 'processing',
        'assigned_to_flight', 'dispatched', 'in_transit',
        'arrived_in_dushanbe', 'customs_clearance', 'ready_for_pickup',
        'delivered', 'unknown_recipient', 'cancelled'
      ]
      return statuses.map(s => ({ value: s, label: this.$t(`statuses.${s}`) }))
    }
  },

  methods: {
    formatDate(d) {
      if (!d) return ''
      return new Date(d).toLocaleDateString('ru-RU', { day: '2-digit', month: 'short', year: 'numeric' })
    }
  },

  mounted() {
    this.parcelsStore.fetchParcels()
  }
}
</script>
