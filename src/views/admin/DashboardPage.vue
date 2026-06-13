<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="page-title">{{ $t('admin.dashboard') }}</h1>
      <span class="text-sm text-gray-500">Обновлено: {{ now }}</span>
    </div>

    <!-- Stats grid -->
    <div class="grid grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
      <div v-for="stat in stats" :key="stat.key" class="stat-card">
        <div class="stat-icon flex items-center justify-center" :style="{ backgroundColor: stat.bg }">
          <svg v-if="stat.key === 'customers'" class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
          </svg>
          <svg v-else-if="stat.key === 'active'" class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
          </svg>
          <svg v-else-if="stat.key === 'delivered'" class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <svg v-else-if="stat.key === 'unknown'" class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <svg v-else-if="stat.key === 'revenue'" class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <svg v-else-if="stat.key === 'weekly'" class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
          </svg>
        </div>
        <div>
          <p class="text-2xl font-bold text-gray-900">{{ stat.value }}</p>
          <p class="text-sm text-gray-500">{{ stat.label }}</p>
        </div>
      </div>
    </div>

    <!-- Charts row -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <!-- Shipments per week bar chart -->
      <div class="card">
        <h3 class="section-title mb-4">Отправления по дням</h3>
        <div class="flex items-end gap-2 h-32">
          <div v-for="(bar, i) in weeklyBars" :key="i" class="flex-1 flex flex-col items-center gap-1">
            <span class="text-xs text-gray-500 font-medium">{{ bar.count }}</span>
            <div class="w-full rounded-t-md transition-all hover:opacity-80"
              :style="{ height: `${barHeight(bar.count)}%`, backgroundColor: '#6997CF' }"></div>
            <span class="text-xs text-gray-400">{{ bar.day }}</span>
          </div>
        </div>
      </div>

      <!-- Revenue per month -->
      <div class="card">
        <h3 class="section-title mb-4">Выручка по месяцам ($)</h3>
        <div class="flex items-end gap-2 h-32">
          <div v-for="(bar, i) in monthlyRevenue" :key="i" class="flex-1 flex flex-col items-center gap-1">
            <span class="text-xs text-gray-500 font-medium">{{ bar.amount }}</span>
            <div class="w-full rounded-t-md transition-all hover:opacity-80"
              :style="{ height: `${revenueBarHeight(bar.amount)}%`, backgroundColor: bar.amount > 0 ? '#22c55e' : '#e5e7eb' }"></div>
            <span class="text-xs text-gray-400">{{ bar.month }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom row -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Status breakdown -->
      <div class="card">
        <h3 class="section-title mb-4">Распределение по статусам</h3>
        <div class="space-y-3">
          <div v-for="item in statusBreakdown" :key="item.status">
            <div class="flex items-center justify-between text-sm mb-1">
              <span class="text-gray-700">{{ $t(`statuses.${item.status}`) }}</span>
              <span class="font-semibold">{{ item.count }}</span>
            </div>
            <div class="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div class="h-full rounded-full transition-all"
                :style="{ width: `${item.pct}%`, backgroundColor: item.color }"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent activity -->
      <div class="card">
        <h3 class="section-title mb-4">Последние действия</h3>
        <div class="space-y-3">
          <div v-for="activity in recentActivity" :key="activity.id"
            class="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50">
            <div class="w-8 h-8 rounded-full bg-primary-50 flex items-center justify-center flex-shrink-0 text-sm text-primary">
              <svg v-if="['📦', 'package'].includes(activity.icon)" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
              </svg>
              <svg v-else-if="['👤', 'user'].includes(activity.icon)" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
              <svg v-else-if="['✅', 'check'].includes(activity.icon)" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <svg v-else-if="['📥', 'download'].includes(activity.icon)" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
              </svg>
              <svg v-else-if="['✈️', 'airplane'].includes(activity.icon)" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
              </svg>
              <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div class="min-w-0">
              <p class="text-sm text-gray-800 truncate">{{ activity.text }}</p>
              <p class="text-xs text-gray-400">{{ activity.time }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { adminAPI } from '@/api/index.js'

export default {
  name: 'AdminDashboard',

  data() {
    return {
      dashData: null,
      loading: false
    }
  },

  computed: {
    now() {
      return new Date().toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })
    },
    stats() {
      const d = this.dashData || {}
      return [
        { key: 'customers', icon: 'users', label: this.$t('admin.totalCustomers'), value: d.total_customers || 0, bg: '#EFF4FB' },
        { key: 'active', icon: 'package', label: this.$t('admin.activeShipments'), value: d.active_shipments || 0, bg: '#EFF4FB' },
        { key: 'delivered', icon: 'check', label: this.$t('admin.deliveredShipments'), value: d.delivered_shipments || 0, bg: '#F0FFF4' },
        { key: 'unknown', icon: 'help', label: this.$t('admin.unknownRecipients'), value: d.unknown_recipients || 0, bg: '#FFF0F0' },
        { key: 'revenue', icon: 'revenue', label: this.$t('admin.revenue'), value: `$${d.revenue || 0}`, bg: '#FFFBEB' },
        { key: 'weekly', icon: 'weekly', label: this.$t('admin.weeklyVolume'), value: d.weekly_volume || 0, bg: '#F3F4F6' }
      ]
    },
    weeklyBars() {
      const days = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
      const data = this.dashData?.weekly_shipments || [12, 19, 8, 15, 22, 5, 3]
      return days.map((day, i) => ({ day, count: data[i] || 0 }))
    },
    monthlyRevenue() {
      const months = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн']
      const data = this.dashData?.monthly_revenue || [1200, 1800, 1500, 2200, 1900, 2500]
      return months.map((month, i) => ({ month, amount: data[i] || 0 }))
    },
    statusBreakdown() {
      const d = this.dashData?.status_breakdown || {}
      const total = Object.values(d).reduce((s, v) => s + v, 0) || 1
      const colors = {
        awaiting_arrival: '#9CA3AF', received_at_warehouse: '#3B82F6',
        in_transit: '#6997CF', delivered: '#22c55e', cancelled: '#EF4444'
      }
      return Object.entries(d).map(([status, count]) => ({
        status, count, pct: Math.round((count / total) * 100),
        color: colors[status] || '#6997CF'
      })).slice(0, 5)
    },
    recentActivity() {
      return this.dashData?.recent_activity || [
        { id: 1, icon: 'package', text: 'Новая посылка: 1Z999AA10...', time: '5 мин назад' },
        { id: 2, icon: 'user', text: 'Новый клиент: Иван И.', time: '12 мин назад' },
        { id: 3, icon: 'check', text: 'Статус обновлён: Доставлено', time: '23 мин назад' },
        { id: 4, icon: 'airplane', text: 'AWB-001 отправлен', time: '1 ч назад' }
      ]
    }
  },

  methods: {
    barHeight(count) {
      const max = Math.max(...this.weeklyBars.map(b => b.count)) || 1
      return Math.max(5, (count / max) * 90)
    },
    revenueBarHeight(amount) {
      const max = Math.max(...this.monthlyRevenue.map(b => b.amount)) || 1
      return Math.max(5, (amount / max) * 90)
    }
  },

  async mounted() {
    this.loading = true
    try {
      const r = await adminAPI.getDashboard()
      this.dashData = r.data
    } catch (e) {
      // Use mock data
    } finally {
      this.loading = false
    }
  }
}
</script>
