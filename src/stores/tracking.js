import { defineStore } from 'pinia'
import { trackingAPI } from '@/api/index.js'

export const useTrackingStore = defineStore('tracking', {
  state: () => ({
    trackingNumbers: [],
    loading: false,
    error: null
  }),

  actions: {
    async fetchTrackingNumbers() {
      this.loading = true
      this.error = null
      try {
        const response = await trackingAPI.getAll()
        const data = response.data?.data || response.data
        this.trackingNumbers = Array.isArray(data) ? data : []
        return this.trackingNumbers
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to load tracking numbers'
        return []
      } finally {
        this.loading = false
      }
    },

    async addTrackingNumber(data) {
      this.loading = true
      try {
        const response = await trackingAPI.create(data)
        const newTrack = response.data.data || response.data
        this.trackingNumbers.push(newTrack)
        return { success: true, data: newTrack }
      } catch (err) {
        return { success: false, error: err.response?.data?.message }
      } finally {
        this.loading = false
      }
    },

    async updateTrackingNumber(id, data) {
      try {
        const response = await trackingAPI.update(id, data)
        const updatedTrack = response.data.data || response.data
        const idx = this.trackingNumbers.findIndex(t => t.id === id)
        if (idx !== -1) {
          this.trackingNumbers[idx] = updatedTrack
        }
        return { success: true }
      } catch (err) {
        return { success: false, error: err.response?.data?.message }
      }
    },

    async deleteTrackingNumber(id) {
      try {
        await trackingAPI.delete(id)
        this.trackingNumbers = this.trackingNumbers.filter(t => t.id !== id)
        return { success: true }
      } catch (err) {
        return { success: false, error: err.response?.data?.message }
      }
    }
  }
})
