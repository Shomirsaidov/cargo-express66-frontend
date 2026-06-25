import axios from 'axios'

const api = axios.create({
  baseURL: 'https://cargo-express66-backend.onrender.com/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor - attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor - handle 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api

// Auth endpoints
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  me: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/me', data),
  changePassword: (data) => api.put('/auth/change-password', data)
}

// Parcels endpoints
export const parcelsAPI = {
  getAll: (params) => api.get('/parcels', { params }),
  getOne: (id) => api.get(`/parcels/${id}`),
  getByTracking: (trackingNumber) => api.get(`/parcels/track/${trackingNumber}`),
  update: (id, data) => api.put(`/parcels/${id}`, data),
  create: (data) => api.post('/parcels', data),
  delete: (id) => api.delete(`/parcels/${id}`),
  updateStatus: (id, status) => api.put(`/parcels/${id}/status`, { status }),
  addPhoto: (id, data) => api.post(`/parcels/${id}/photos`, data)
}

// Tracking numbers endpoints
export const trackingAPI = {
  getAll: () => api.get('/tracking'),
  create: (data) => api.post('/tracking', data),
  update: (id, data) => api.put(`/tracking/${id}`, data),
  delete: (id) => api.delete(`/tracking/${id}`)
}

// Notifications endpoints
export const notificationsAPI = {
  getAll: (params) => api.get('/notifications', { params }),
  markRead: (id) => api.put(`/notifications/${id}/read`),
  markAllRead: () => api.put('/notifications/read-all'),
  getUnreadCount: () => api.get('/notifications/unread-count')
}

// Admin users endpoints
export const usersAPI = {
  getAll: (params) => api.get('/customers', { params }),
  getOne: (id) => api.get(`/customers/${id}`),
  update: (id, data) => api.put(`/customers/${id}`, data),
  updateRole: (id, role) => api.put(`/customers/${id}`, { role }),
  toggleActive: (id, isActive) => api.put(`/customers/${id}`, { is_active: isActive })
}

// Warehouses endpoints
export const warehousesAPI = {
  getAll: () => api.get('/warehouses'),
  getOne: (id) => api.get(`/warehouses/${id}`),
  create: (data) => api.post('/warehouses', data),
  update: (id, data) => api.put(`/warehouses/${id}`, data),
  delete: (id) => api.delete(`/warehouses/${id}`)
}

// Tariffs endpoints
export const tariffsAPI = {
  getAll: () => api.get('/tariffs'),
  create: (data) => api.post('/tariffs', data),
  update: (id, data) => api.put(`/tariffs/${id}`, data),
  delete: (id) => api.delete(`/tariffs/${id}`)
}

// Services endpoints
export const servicesAPI = {
  getAll: () => api.get('/services'),
  create: (data) => api.post('/services', data),
  update: (id, data) => api.put(`/services/${id}`, data),
  delete: (id) => api.delete(`/services/${id}`)
}

// AWB endpoints
export const awbAPI = {
  getAll: (params) => api.get('/airwaybills', { params }),
  getOne: (id) => api.get(`/airwaybills/${id}`),
  create: (data) => api.post('/airwaybills', data),
  update: (id, data) => api.put(`/airwaybills/${id}`, data),
  updateStatus: (id, status) => api.put(`/airwaybills/${id}/status`, { status }),
  assignParcel: (awbId, parcelId) => api.post(`/airwaybills/${awbId}/parcels`, { parcel_id: parcelId }),
  removeParcel: (awbId, parcelId) => api.delete(`/airwaybills/${awbId}/parcels/${parcelId}`)
}

// Reports endpoints
export const reportsAPI = {
  generate: (params) => api.get('/reports/weekly', { params, responseType: 'blob' }),
  getStats: (params) => api.get('/reports/weekly', { params }) // Weekly report has stats metadata
}

// CMS endpoints
export const cmsAPI = {
  getPages: () => api.get('/cms'),
  getPage: (slug) => api.get(`/cms/${slug}`),
  updatePage: (slug, data) => api.put(`/cms/${slug}`, data)
}

// Settings endpoints
export const settingsAPI = {
  getAll: () => api.get('/settings'),
  getOne: (key) => api.get(`/settings/${key}`),
  update: (key, data) => api.put(`/settings/${key}`, data)
}

// Admin dashboard
export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  getStats: () => api.get('/admin/stats')
}

// Warehouse scanner endpoints
export const scannerAPI = {
  scanParcel: (trackingNumber) => api.get(`/parcels/scan/${trackingNumber}`),
  receiveParcel: (data) => api.post('/parcels', data),
  getParcels: (params) => api.get('/parcels', { params }),
  assignCustomer: (parcelId, customerId) => api.put(`/parcels/${parcelId}`, { customer_id: customerId }),
  searchCustomers: (query) => api.get('/customers', { params: { search: query, role: 'customer' } })
}

// Calculator
export const calculatorAPI = {
  calculate: (data) => api.post('/calculator/calculate', data)
}
