import { defineStore } from 'pinia'
import { parcelsAPI } from '@/api/index.js'

export const useParcelsStore = defineStore('parcels', {
  state: () => ({
    parcels: [],
    currentParcel: null,
    loading: false,
    error: null,
    total: 0,
    page: 1,
    perPage: 20,
    filters: {
      status: '',
      warehouse_id: '',
      search: ''
    }
  }),

  getters: {
    activeCount: (state) => state.parcels.filter(p =>
      !['delivered', 'cancelled'].includes(p.status)
    ).length,
    deliveredCount: (state) => state.parcels.filter(p => p.status === 'delivered').length,
    pendingCount: (state) => state.parcels.filter(p => p.status === 'awaiting_arrival').length
  },

  actions: {
    async fetchParcels(params = {}) {
      this.loading = true
      this.error = null
      try {
        const response = await parcelsAPI.getAll({
          page: this.page,
          per_page: this.perPage,
          ...this.filters,
          ...params
        })
        const data = response.data?.data || response.data
        this.parcels = Array.isArray(data) ? data : []
        this.total = response.data?.pagination?.total || this.parcels.length
        return this.parcels
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to load parcels'
        return []
      } finally {
        this.loading = false
      }
    },

    async fetchParcel(id) {
      this.loading = true
      this.error = null
      try {
        const response = await parcelsAPI.getOne(id)
        const parcel = response.data.data || response.data
        this.currentParcel = parcel
        return parcel
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to load parcel'
        return null
      } finally {
        this.loading = false
      }
    },

    async trackParcel(trackingNumber) {
      this.loading = true
      try {
        const response = await parcelsAPI.getByTracking(trackingNumber)
        const parcel = response.data.data || response.data
        this.currentParcel = parcel
        return parcel
      } catch (err) {
        this.error = err.response?.data?.message || 'Parcel not found'
        return null
      } finally {
        this.loading = false
      }
    },

    async updateParcelStatus(id, status) {
      try {
        const response = await parcelsAPI.updateStatus(id, status)
        const idx = this.parcels.findIndex(p => p.id === id)
        if (idx !== -1) {
          this.parcels[idx] = { ...this.parcels[idx], status }
        }
        if (this.currentParcel?.id === id) {
          this.currentParcel.status = status
        }
        return { success: true }
      } catch (err) {
        return { success: false, error: err.response?.data?.message }
      }
    },

    setFilters(filters) {
      this.filters = { ...this.filters, ...filters }
      this.page = 1
    },

    clearCurrentParcel() {
      this.currentParcel = null
    }
  }
})
