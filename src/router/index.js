import { createRouter, createWebHashHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth.js'

// Public views
const HomePage = () => import('@/views/public/HomePage.vue')
const AboutPage = () => import('@/views/public/AboutPage.vue')
const HowItWorksPage = () => import('@/views/public/HowItWorksPage.vue')
const PricingPage = () => import('@/views/public/PricingPage.vue')
const TrackingPage = () => import('@/views/public/TrackingPage.vue')
const CalculatorPage = () => import('@/views/public/CalculatorPage.vue')
const ContactsPage = () => import('@/views/public/ContactsPage.vue')
const FaqPage = () => import('@/views/public/FaqPage.vue')
const TermsPage = () => import('@/views/public/TermsPage.vue')
const PrivacyPage = () => import('@/views/public/PrivacyPage.vue')
const LoginPage = () => import('@/views/public/LoginPage.vue')
const RegisterPage = () => import('@/views/public/RegisterPage.vue')
const ServicesPage = () => import('@/views/public/ServicesPage.vue')
const ShopsUsaPage = () => import('@/views/public/ShopsUsaPage.vue')
const ShopsGermanyPage = () => import('@/views/public/ShopsGermanyPage.vue')

// Client views
const ClientDashboard = () => import('@/views/client/DashboardPage.vue')
const ClientProfile = () => import('@/views/client/ProfilePage.vue')
const ClientTrackingNumbers = () => import('@/views/client/TrackingNumbersPage.vue')
const ClientShipments = () => import('@/views/client/ShipmentsPage.vue')
const ClientShipmentDetail = () => import('@/views/client/ShipmentDetailPage.vue')
const ClientNotifications = () => import('@/views/client/NotificationsPage.vue')
const ClientSettings = () => import('@/views/client/SettingsPage.vue')

// Admin views
const AdminDashboard = () => import('@/views/admin/DashboardPage.vue')
const AdminUsers = () => import('@/views/admin/UsersPage.vue')
const AdminShipments = () => import('@/views/admin/ShipmentsPage.vue')
const AdminAirWayBills = () => import('@/views/admin/AirWayBillsPage.vue')
const AdminWarehouses = () => import('@/views/admin/WarehousesPage.vue')
const AdminTariffs = () => import('@/views/admin/TariffsPage.vue')
const AdminServices = () => import('@/views/admin/ServicesPage.vue')
const AdminReports = () => import('@/views/admin/ReportsPage.vue')
const AdminSettings = () => import('@/views/admin/AdminSettingsPage.vue')
const AdminContent = () => import('@/views/admin/ContentPage.vue')

// Warehouse views
const WarehouseScanner = () => import('@/views/warehouse/ScannerPage.vue')
const WarehouseParcels = () => import('@/views/warehouse/ParcelsPage.vue')

// Layouts
const PublicLayout = () => import('@/layouts/PublicLayout.vue')
const ClientLayout = () => import('@/layouts/ClientLayout.vue')
const AdminLayout = () => import('@/layouts/AdminLayout.vue')
const WarehouseLayout = () => import('@/layouts/WarehouseLayout.vue')

const routes = [
  // Public routes
  {
    path: '/',
    component: PublicLayout,
    children: [
      { path: '', name: 'home', component: HomePage },
      { path: 'about', name: 'about', component: AboutPage },
      { path: 'how-it-works', name: 'how-it-works', component: HowItWorksPage },
      { path: 'pricing', name: 'pricing', component: PricingPage },
      { path: 'services', name: 'services', component: ServicesPage },
      { path: 'shops-usa', name: 'shops-usa', component: ShopsUsaPage },
      { path: 'shops-germany', name: 'shops-germany', component: ShopsGermanyPage },
      { path: 'tracking', name: 'tracking', component: TrackingPage },
      { path: 'calculator', name: 'calculator', component: CalculatorPage },
      { path: 'contacts', name: 'contacts', component: ContactsPage },
      { path: 'faq', name: 'faq', component: FaqPage },
      { path: 'terms', name: 'terms', component: TermsPage },
      { path: 'privacy', name: 'privacy', component: PrivacyPage },
      { path: 'login', name: 'login', component: LoginPage, meta: { guestOnly: true } },
      { path: 'register', name: 'register', component: RegisterPage, meta: { guestOnly: true } }
    ]
  },

  // Client routes
  {
    path: '/dashboard',
    component: ClientLayout,
    meta: { requiresAuth: true, role: 'customer' },
    children: [
      { path: '', name: 'client-dashboard', component: ClientDashboard },
      { path: '/profile', name: 'client-profile', component: ClientProfile },
      { path: '/tracking-numbers', name: 'client-tracking', component: ClientTrackingNumbers },
      { path: '/shipments', name: 'client-shipments', component: ClientShipments },
      { path: '/shipments/:id', name: 'client-shipment-detail', component: ClientShipmentDetail },
      { path: '/notifications', name: 'client-notifications', component: ClientNotifications },
      { path: '/settings', name: 'client-settings', component: ClientSettings }
    ]
  },

  // Admin routes
  {
    path: '/admin',
    component: AdminLayout,
    meta: { requiresAuth: true, role: 'admin' },
    children: [
      { path: '', redirect: '/admin/dashboard' },
      { path: 'dashboard', name: 'admin-dashboard', component: AdminDashboard },
      { path: 'users', name: 'admin-users', component: AdminUsers },
      { path: 'shipments', name: 'admin-shipments', component: AdminShipments },
      { path: 'airwaybills', name: 'admin-awb', component: AdminAirWayBills },
      { path: 'warehouses', name: 'admin-warehouses', component: AdminWarehouses },
      { path: 'tariffs', name: 'admin-tariffs', component: AdminTariffs },
      { path: 'services', name: 'admin-services', component: AdminServices },
      { path: 'reports', name: 'admin-reports', component: AdminReports },
      { path: 'settings', name: 'admin-settings', component: AdminSettings },
      { path: 'content', name: 'admin-content', component: AdminContent }
    ]
  },

  // Warehouse routes
  {
    path: '/warehouse',
    component: WarehouseLayout,
    meta: { requiresAuth: true, role: 'warehouse_employee' },
    children: [
      { path: '', redirect: '/warehouse/scanner' },
      { path: 'scanner', name: 'warehouse-scanner', component: WarehouseScanner },
      { path: 'parcels', name: 'warehouse-parcels', component: WarehouseParcels }
    ]
  },

  // 404
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    return { top: 0 }
  }
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  // Guest-only routes (login, register)
  if (to.meta.guestOnly && authStore.isLoggedIn) {
    const role = authStore.user?.role
    if (role === 'admin') return next('/admin/dashboard')
    if (role === 'warehouse_employee') return next('/warehouse/scanner')
    return next('/dashboard')
  }

  // Auth required routes
  if (to.meta.requiresAuth) {
    if (!authStore.isLoggedIn) {
      return next({ name: 'login', query: { redirect: to.fullPath } })
    }

    // Role-based access
    if (to.meta.role && authStore.user?.role !== to.meta.role && authStore.user?.role !== 'admin') {
      const role = authStore.user?.role
      if (role === 'admin') return next('/admin/dashboard')
      if (role === 'warehouse_employee') return next('/warehouse/scanner')
      if (role === 'customer') return next('/dashboard')
      
      // Fallback for invalid/missing role: clear session and send to login
      authStore.logout()
      return next('/login')
    }
  }

  next()
})

export default router
