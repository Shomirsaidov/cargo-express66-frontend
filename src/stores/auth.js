import { defineStore } from 'pinia'
import { authAPI } from '@/api/index.js'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user') || 'null'),
    token: localStorage.getItem('token') || null,
    loading: false,
    error: null
  }),

  getters: {
    isLoggedIn: (state) => !!state.token && !!state.user,
    isAdmin: (state) => state.user?.role === 'admin',
    isWarehouse: (state) => state.user?.role === 'warehouse_employee',
    isClient: (state) => state.user?.role === 'customer',
    currentUser: (state) => state.user
  },

  actions: {
    async login(credentials) {
      this.loading = true
      this.error = null
      try {
        const response = await authAPI.login(credentials)
        const { access_token, customer } = response.data.data
        this.token = access_token
        this.user = customer
        localStorage.setItem('token', access_token)
        localStorage.setItem('user', JSON.stringify(customer))
        return { success: true, user: customer }
      } catch (err) {
        this.error = err.response?.data?.error || err.response?.data?.message || 'Login failed'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    async register(userData) {
      this.loading = true
      this.error = null
      try {
        const response = await authAPI.register(userData)
        const { access_token, customer } = response.data.data
        this.token = access_token
        this.user = customer
        localStorage.setItem('token', access_token)
        localStorage.setItem('user', JSON.stringify(customer))
        return { success: true, user: customer }
      } catch (err) {
        this.error = err.response?.data?.error || err.response?.data?.message || 'Registration failed'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    async fetchProfile() {
      try {
        const response = await authAPI.me()
        const profile = response.data.data || response.data
        this.user = profile
        localStorage.setItem('user', JSON.stringify(profile))
        return profile
      } catch (err) {
        if (err.response?.status === 401) {
          this.logout()
        }
        throw err
      }
    },

    async updateProfile(data) {
      this.loading = true
      try {
        const response = await authAPI.updateProfile(data)
        const updated = response.data.data || response.data
        this.user = { ...this.user, ...updated }
        localStorage.setItem('user', JSON.stringify(this.user))
        return { success: true }
      } catch (err) {
        this.error = err.response?.data?.message || 'Update failed'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    logout() {
      this.user = null
      this.token = null
      this.error = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }
  }
})
