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
            <th>Адрес доставки</th>
            <th>Роль</th>
            <th>Статус</th>
            <th>Регистрация</th>
            <th>{{ $t('common.actions') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading">
            <td colspan="9" class="text-center py-8">
              <div class="inline-block w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            </td>
          </tr>
          <tr v-else-if="filtered.length === 0">
            <td colspan="9" class="text-center py-8 text-gray-400">Пользователи не найдены</td>
          </tr>
          <tr v-else v-for="user in filtered" :key="user.id">
            <td class="font-mono text-xs text-gray-600">{{ user.customer_code || 'CX-AAAAAA' }}</td>
            <td>
              <div>
                <p class="font-medium text-gray-900">{{ user.last_name }} {{ user.first_name }}</p>
                <p v-if="user.middle_name" class="text-xs text-gray-400">{{ user.middle_name }}</p>
              </div>
            </td>
            <td class="text-gray-600">{{ user.email }}</td>
            <td class="text-gray-600">{{ user.phone || '—' }}</td>
            <td class="text-gray-600 text-sm">{{ user.delivery_address || '—' }}</td>
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
                <button @click="openEditUser(user)"
                  class="p-1.5 text-gray-400 hover:text-primary hover:bg-primary-50 rounded-lg transition-all text-xs"
                  title="Редактировать данные (ФИО, адрес, роль)">
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
                <button @click="deleteUser(user)"
                  class="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                  title="Удалить пользователя">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Edit User Modal -->
    <Teleport to="body">
      <transition name="fade">
        <div v-if="editingUser" class="modal-overlay" @click.self="editingUser = null">
          <div class="modal-content max-w-lg">
            <div class="p-6">
              <div class="flex items-center justify-between pb-3 mb-4 border-b border-gray-100">
                <div>
                  <h3 class="text-lg font-bold text-gray-900">Редактирование данных клиента</h3>
                  <div class="flex items-center gap-2 mt-1">
                    <span class="font-mono text-xs font-bold text-primary bg-primary-50 px-2 py-0.5 rounded">
                      {{ editingUser.customer_code || 'CX-AAAAAA' }}
                    </span>
                    <span class="text-xs text-gray-500">{{ editingUser.email }}</span>
                  </div>
                </div>
                <button @click="editingUser = null" class="text-gray-400 hover:text-gray-600 p-1">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>

              <form @submit.prevent="saveUser" class="space-y-4">
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="form-label font-semibold text-gray-700">Фамилия *</label>
                    <input v-model="editForm.last_name" type="text" required class="input-field"
                      placeholder="Например: Иванов" />
                  </div>
                  <div>
                    <label class="form-label font-semibold text-gray-700">Имя *</label>
                    <input v-model="editForm.first_name" type="text" required class="input-field"
                      placeholder="Например: Иван" />
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="form-label font-semibold text-gray-700">Отчество</label>
                    <input v-model="editForm.middle_name" type="text" class="input-field"
                      placeholder="Например: Иванович" />
                  </div>
                  <div>
                    <label class="form-label font-semibold text-gray-700">Телефон</label>
                    <input v-model="editForm.phone" type="text" class="input-field"
                      placeholder="+992 90 000 0000" />
                  </div>
                </div>

                <div>
                  <label class="form-label font-semibold text-gray-700">Адрес доставки</label>
                  <textarea v-model="editForm.delivery_address" rows="2" class="input-field"
                    placeholder="г. Душанбе, ул. Рудаки 10, кв. 5..."></textarea>
                  <p class="text-[11px] text-gray-400 mt-1">
                    Укажите корректный адрес для доставки посылок клиенту.
                  </p>
                </div>

                <div>
                  <label class="form-label font-semibold text-gray-700">Роль в системе</label>
                  <select v-model="editForm.role" class="input-field">
                    <option value="customer">Клиент</option>
                    <option value="warehouse_employee">Сотрудник склада</option>
                    <option value="admin">Администратор</option>
                  </select>
                </div>

                <div class="flex gap-3 pt-3 border-t border-gray-100">
                  <button type="button" @click="editingUser = null" class="btn btn-ghost flex-1 border border-gray-200">
                    Отмена
                  </button>
                  <button type="submit" :disabled="saving" class="btn btn-primary flex-1">
                    <svg v-if="saving" class="animate-spin w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    {{ saving ? 'Сохранение...' : 'Сохранить изменения' }}
                  </button>
                </div>
              </form>
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
      saving: false,
      search: '',
      roleFilter: '',
      activeFilter: '',
      editingUser: null,
      editForm: {
        first_name: '',
        last_name: '',
        middle_name: '',
        phone: '',
        delivery_address: '',
        role: 'customer'
      }
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
          `${u.first_name} ${u.last_name} ${u.middle_name || ''}`.toLowerCase().includes(q) ||
          u.email?.toLowerCase().includes(q) ||
          u.customer_code?.toLowerCase().includes(q) ||
          u.phone?.toLowerCase().includes(q) ||
          u.delivery_address?.toLowerCase().includes(q)
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
    openEditUser(user) {
      this.editingUser = user
      this.editForm = {
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        middle_name: user.middle_name || '',
        phone: user.phone || '',
        delivery_address: user.delivery_address || '',
        role: user.role || 'customer'
      }
    },
    async saveUser() {
      if (!this.editingUser) return
      if (!this.editForm.first_name.trim() || !this.editForm.last_name.trim()) {
        alert('Имя и фамилия обязательны для заполнения')
        return
      }
      this.saving = true
      try {
        const payload = {
          first_name: this.editForm.first_name.trim(),
          last_name: this.editForm.last_name.trim(),
          middle_name: this.editForm.middle_name.trim(),
          phone: this.editForm.phone.trim(),
          delivery_address: this.editForm.delivery_address.trim(),
          role: this.editForm.role
        }
        const res = await usersAPI.update(this.editingUser.id, payload)
        const updated = res.data?.data || res.data
        if (updated) {
          Object.assign(this.editingUser, updated)
        } else {
          Object.assign(this.editingUser, payload)
        }
        this.editingUser = null
      } catch (e) {
        alert('Ошибка при сохранении: ' + (e.response?.data?.error || e.message))
      } finally {
        this.saving = false
      }
    },
    async deleteUser(user) {
      if (!user || !user.id) return
      const ok = window.confirm(`Удалить пользователя ${user.first_name || ''} ${user.last_name || ''}? Это удалит все данные.`)
      if (!ok) return
      try {
        await usersAPI.delete(user.id)
        this.users = this.users.filter(u => u.id !== user.id)
      } catch (e) {
        alert('Ошибка при удалении пользователя')
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
      this.users = r.data?.data || (Array.isArray(r.data) ? r.data : [])
    } catch (e) {
      this.users = []
    } finally {
      this.loading = false
    }
  }
}
</script>
