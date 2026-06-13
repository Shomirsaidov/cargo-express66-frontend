<template>
  <div class="p-4 sm:p-6 max-w-2xl mx-auto">
    <!-- Greeting -->
    <div class="mb-6">
      <h1 class="text-xl font-bold text-gray-900">
        Добро пожаловать, {{ firstName }}!
      </h1>
      <p class="text-sm text-gray-500 mt-0.5">{{ $t('dashboard.title') }}</p>
    </div>

    <!-- Stats cards -->
    <div class="grid grid-cols-3 gap-3 mb-6">
      <div class="card p-4 text-center !p-4">
        <p class="text-2xl font-bold text-primary">{{ stats.active }}</p>
        <p class="text-xs text-gray-500 mt-1">{{ $t('dashboard.activeShipments') }}</p>
      </div>
      <div class="card p-4 text-center !p-4">
        <p class="text-2xl font-bold text-green-500">{{ stats.delivered }}</p>
        <p class="text-xs text-gray-500 mt-1">{{ $t('dashboard.deliveredShipments') }}</p>
      </div>
      <div class="card p-4 text-center !p-4">
        <p class="text-2xl font-bold text-yellow-500">{{ stats.pending }}</p>
        <p class="text-xs text-gray-500 mt-1">{{ $t('dashboard.pendingShipments') }}</p>
      </div>
    </div>

    <!-- Customer ID card -->
    <div class="bg-gradient-to-r from-primary-600 to-primary rounded-2xl p-5 mb-6 text-white">
      <p class="text-xs text-blue-200 mb-1">ID клиента</p>
      <p class="text-2xl font-bold tracking-wider">{{ customerCode }}</p>
      <p class="text-xs text-blue-200 mt-2">Укажите этот ID при оформлении посылок</p>
    </div>

    <!-- Recent notifications -->
    <div class="card mb-4">
      <div class="flex items-center justify-between mb-4">
        <h2 class="section-title">{{ $t('dashboard.recentNotifications') }}</h2>
        <RouterLink to="/notifications" class="text-sm text-primary hover:underline">Все</RouterLink>
      </div>

      <div v-if="loading" class="text-center py-6">
        <div class="inline-block w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>

      <div v-else-if="recentNotifications.length === 0" class="text-center py-6 text-gray-400 text-sm">
        {{ $t('dashboard.noNotifications') }}
      </div>

      <div v-else class="space-y-3">
        <div v-for="notif in recentNotifications" :key="notif.id"
          class="flex items-start gap-3 p-3 rounded-lg"
          :class="notif.is_read ? 'bg-gray-50' : 'bg-primary-50 border border-primary-100'">
          <div class="w-2 h-2 rounded-full mt-2 flex-shrink-0"
            :class="notif.is_read ? 'bg-gray-300' : 'bg-primary'"></div>
          <div class="min-w-0">
            <p class="text-sm font-medium text-gray-800">{{ notif.title }}</p>
            <p class="text-xs text-gray-500 mt-0.5">{{ formatDate(notif.created_at) }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent shipments -->
    <div class="card">
      <div class="flex items-center justify-between mb-4">
        <h2 class="section-title">{{ $t('dashboard.recentShipments') }}</h2>
        <RouterLink to="/shipments" class="text-sm text-primary hover:underline">Все</RouterLink>
      </div>

      <div v-if="recentShipments.length === 0" class="text-center py-6 text-gray-400 text-sm">
        {{ $t('dashboard.noShipments') }}
      </div>

      <div v-else class="space-y-3">
        <RouterLink
          v-for="parcel in recentShipments"
          :key="parcel.id"
          :to="`/shipments/${parcel.id}`"
          class="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-primary-50 transition-colors no-underline group">
          <div class="min-w-0">
            <p class="text-sm font-medium text-gray-800 group-hover:text-primary truncate">
              {{ parcel.tracking_number }}
            </p>
            <p class="text-xs text-gray-500">{{ formatDate(parcel.created_at) }}</p>
          </div>
          <StatusBadge :status="parcel.status" />
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '@/stores/auth.js'
import { useParcelsStore } from '@/stores/parcels.js'
import { useNotificationsStore } from '@/stores/notifications.js'
import StatusBadge from '@/components/common/StatusBadge.vue'

export default {
  name: 'ClientDashboard',

  components: { StatusBadge },

  data() {
    return {
      loading: false
    }
  },

  computed: {
    authStore() { return useAuthStore() },
    parcelsStore() { return useParcelsStore() },
    notifStore() { return useNotificationsStore() },

    firstName() {
      return this.authStore.user?.first_name || 'Клиент'
    },
    customerCode() {
      return this.authStore.user?.customer_code || this.authStore.user?.id || 'CX66-000000'
    },
    stats() {
      const parcels = this.parcelsStore.parcels
      return {
        active: parcels.filter(p => !['delivered', 'cancelled'].includes(p.status)).length,
        delivered: parcels.filter(p => p.status === 'delivered').length,
        pending: parcels.filter(p => p.status === 'awaiting_arrival').length
      }
    },
    recentNotifications() {
      return this.notifStore.notifications.slice(0, 3)
    },
    recentShipments() {
      return this.parcelsStore.parcels.slice(0, 5)
    }
  },

  methods: {
    formatDate(dateStr) {
      if (!dateStr) return ''
      return new Date(dateStr).toLocaleDateString('ru-RU', {
        day: '2-digit', month: 'short'
      })
    }
  },

  async mounted() {
    this.loading = true
    try {
      await Promise.all([
        this.parcelsStore.fetchParcels(),
        this.notifStore.fetchNotifications()
      ])
    } finally {
      this.loading = false
    }
  }
}
</script>
