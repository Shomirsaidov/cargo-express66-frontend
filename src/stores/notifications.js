import { defineStore } from 'pinia'
import { notificationsAPI } from '@/api/index.js'

export const useNotificationsStore = defineStore('notifications', {
  state: () => ({
    notifications: [],
    unreadCount: 0,
    loading: false,
    error: null,
    filter: 'all'
  }),

  getters: {
    filteredNotifications: (state) => {
      if (state.filter === 'unread') {
        return state.notifications.filter(n => !n.is_read)
      }
      return state.notifications
    }
  },

  actions: {
    async fetchNotifications(params = {}) {
      this.loading = true
      try {
        const response = await notificationsAPI.getAll(params)
        const data = response.data?.data || response.data
        this.notifications = Array.isArray(data) ? data : []
        return this.notifications
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to load notifications'
        return []
      } finally {
        this.loading = false
      }
    },

    async fetchUnreadCount() {
      try {
        const response = await notificationsAPI.getUnreadCount()
        this.unreadCount = response.data.count || 0
        return this.unreadCount
      } catch (err) {
        return 0
      }
    },

    async markRead(id) {
      try {
        await notificationsAPI.markRead(id)
        const n = this.notifications.find(n => n.id === id)
        if (n && !n.is_read) {
          n.is_read = true
          this.unreadCount = Math.max(0, this.unreadCount - 1)
        }
      } catch (err) {
        console.error('Failed to mark notification as read', err)
      }
    },

    async markAllRead() {
      try {
        await notificationsAPI.markAllRead()
        this.notifications.forEach(n => { n.is_read = true })
        this.unreadCount = 0
      } catch (err) {
        console.error('Failed to mark all as read', err)
      }
    },

    setFilter(filter) {
      this.filter = filter
    }
  }
})
