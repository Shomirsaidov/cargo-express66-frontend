<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="page-title">{{ $t('admin.users') }}</h1>
      <span class="text-sm text-gray-500">Всего: {{ users.length }}</span>
    </div>

    <!-- Filters -->
    <div class="flex flex-wrap gap-3 mb-4">
      <div class="relative">
        <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
        <input v-model="search" type="text" placeholder="Поиск по имени, email, ID..."
          class="input-field pl-9 w-72" />
      </div>
      <select v-model="roleFilter" class="input-field w-36">
        <option value="">Все роли</option>
        <option value="customer">Клиент</option>
        <option value="warehouse_employee">Склад</option>
        <option value="admin">Admin</option>
      </select>
      <select v-model="activeFilter" class="input-field w-32">
        <option value="">Все</option>
        <option value="true">Активные</option>
        <option value="false">Заблокированные</option>
      </select>
    </div>

    <!-- Table -->
    <div class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th>ID клиента</th>
            <th>Имя</th>
            <th>Email</th>
            <th>Телефон</th>
            <th>Роль</th>
            <th>Статус</th>
            <th>Регистрация</th>
            <th>{{ $t('common.actions') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading">
            <td colspan="8" class="text-center py-8">
              <div class="inline-block w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            </td>
          </tr>
          <tr v-else-if="filtered.length === 0">
            <td colspan="8" class="text-center py-8 text-gray-400">Пользователи не найдены</td>
          </tr>
          <tr v-else v-for="user in filtered" :key="user.id">
            <td class="font-mono text-xs text-gray-600">{{ user.customer_code || `CX66-${String(user.id).padStart(6,'0')}` }}</td>
            <td>
              <div>
                <p class="font-medium text-gray-900">{{ user.last_name }} {{ user.first_name }}</p>
                <p v-if="user.middle_name" class="text-xs text-gray-400">{{ user.middle_name }}</p>
              </div>
            </td>
            <td class="text-gray-600">{{ user.email }}</td>
            <td class="text-gray-600">{{ user.phone || '—' }}</td>
            <td>
              <span class="badge"
                :class="{
                  'bg-purple-100 text-purple-700': user.role === 'admin',
                  'bg-blue-100 text-blue-700': user.role === 'warehouse_employee',
                  'bg-gray-100 text-gray-600': user.role === 'customer'
                }">
                {{ user.role }}
              </span>
            </td>
            <td>
              <span class="badge"
                :class="user.is_active !== false ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'">
                {{ user.is_active !== false ? 'Активный' : 'Заблокирован' }}
              </span>
            </td>
            <td class="text-gray-500 text-xs">{{ formatDate(user.created_at) }}</td>
            <td>
              <div class="flex items-center gap-1">
                <button @click="openEditRole(user)"
                  class="p-1.5 text-gray-400 hover:text-primary hover:bg-primary-50 rounded-lg transition-all text-xs"
                  title="Изменить роль">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                  </svg>
                </button>
                <button @click="toggleUserActive(user)"
                  class="p-1.5 rounded-lg transition-all"
                  :class="user.is_active !== false ? 'text-gray-400 hover:text-red-500 hover:bg-red-50' : 'text-gray-400 hover:text-green-500 hover:bg-green-50'"
                  :title="user.is_active !== false ? 'Заблокировать' : 'Активировать'">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Edit Role Modal -->
    <Teleport to="body">
      <transition name="fade">
        <div v-if="editingUser" class="modal-overlay" @click.self="editingUser = null">
          <div class="modal-content max-w-sm">
            <div class="p-6">
              <h3 class="text-lg font-bold mb-4">Изменить роль пользователя</h3>
              <p class="text-sm text-gray-600 mb-4">
                {{ editingUser.last_name }} {{ editingUser.first_name }}
              </p>
              <select v-model="newRole" class="input-field mb-4">
                <option value="customer">Клиент</option>
                <option value="warehouse_employee">Сотрудник склада</option>
                <option value="admin">Администратор</option>
              </select>
              <div class="flex gap-3">
                <button @click="editingUser = null" class="btn btn-ghost flex-1 border border-gray-200">
                  Отмена
                </button>
                <button @click="saveRole" class="btn btn-primary flex-1">
                  Сохранить
                </button>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </Teleport>
  </div>
</template>

<script>
import { usersAPI } from '@/api/index.js'

export default {
  name: 'AdminUsersPage',

  data() {
    return {
      users: [],
      loading: false,
      search: '',
      roleFilter: '',
      activeFilter: '',
      editingUser: null,
      newRole: 'customer'
    }
  },

  computed: {
    filtered() {
      let list = this.users
      if (this.roleFilter) list = list.filter(u => u.role === this.roleFilter)
      if (this.activeFilter !== '') list = list.filter(u => String(u.is_active !== false) === this.activeFilter)
      if (this.search.trim()) {
        const q = this.search.toLowerCase()
        list = list.filter(u =>
          `${u.first_name} ${u.last_name}`.toLowerCase().includes(q) ||
          u.email?.toLowerCase().includes(q) ||
          u.customer_code?.toLowerCase().includes(q)
        )
      }
      return list
    }
  },

  methods: {
    formatDate(d) {
      if (!d) return '—'
      return new Date(d).toLocaleDateString('ru-RU')
    },
    openEditRole(user) {
      this.editingUser = user
      this.newRole = user.role
    },
    async saveRole() {
      if (!this.editingUser) return
      try {
        await usersAPI.updateRole(this.editingUser.id, this.newRole)
        this.editingUser.role = this.newRole
        this.editingUser = null
      } catch (e) {
        alert('Ошибка обновления роли')
      }
    },
    async toggleUserActive(user) {
      try {
        await usersAPI.toggleActive(user.id)
        user.is_active = user.is_active === false ? true : false
      } catch (e) {
        alert('Ошибка')
      }
    }
  },

  async mounted() {
    this.loading = true
    try {
      const r = await usersAPI.getAll()
      this.users = r.data?.users || r.data || []
    } catch (e) {
      this.users = []
    } finally {
      this.loading = false
    }
  }
}
</script>
