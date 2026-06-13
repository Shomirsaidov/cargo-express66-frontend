<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="page-title">{{ $t('admin.warehouses') }}</h1>
        <p class="text-sm text-gray-500 mt-1">Управление международными складами отправки</p>
      </div>
      <button @click="openCreateModal" class="btn btn-primary">
        + Добавить склад
      </button>
    </div>

    <!-- Table -->
    <div class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th>Название склада</th>
            <th>Страна</th>
            <th>Город</th>
            <th>Адрес</th>
            <th>Статус</th>
            <th>{{ $t('common.actions') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading" class="text-center py-6">
            <td colspan="6">
              <div class="inline-block w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            </td>
          </tr>
          <tr v-else-if="warehouses.length === 0">
            <td colspan="6" class="text-center py-6 text-gray-400">Склады не найдены</td>
          </tr>
          <tr v-else v-for="w in warehouses" :key="w.id">
            <td class="font-semibold text-gray-900 text-sm">{{ w.name }}</td>
            <td class="text-sm">{{ w.country }}</td>
            <td class="text-sm">{{ w.city }}</td>
            <td class="text-xs text-gray-600 font-mono">{{ w.address }}</td>
            <td>
              <span class="badge"
                :class="w.is_active !== false ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'">
                {{ w.is_active !== false ? 'Активен' : 'Неактивен' }}
              </span>
            </td>
            <td>
              <div class="flex items-center gap-2">
                <button @click="openEditModal(w)" class="text-xs text-primary hover:underline">Изм.</button>
                <button @click="confirmDelete(w)" class="text-xs text-danger hover:underline">Удал.</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Edit/Create Modal -->
    <Teleport to="body">
      <transition name="fade">
        <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
          <div class="modal-content max-w-md">
            <div class="p-6">
              <h3 class="text-lg font-bold mb-4">{{ isEdit ? 'Редактировать склад' : 'Добавить склад' }}</h3>

              <form @submit.prevent="saveWarehouse" class="space-y-4">
                <div>
                  <label class="form-label">Название склада:</label>
                  <input v-model="form.name" type="text" required class="input-field" placeholder="USA Warehouse / Germany Frankfurt" />
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="form-label">Страна:</label>
                    <input v-model="form.country" type="text" required class="input-field" placeholder="USA" />
                  </div>
                  <div>
                    <label class="form-label">Город:</label>
                    <input v-model="form.city" type="text" required class="input-field" placeholder="New York" />
                  </div>
                </div>

                <div>
                  <label class="form-label">Адрес:</label>
                  <textarea v-model="form.address" required rows="2" class="input-field font-mono text-xs" placeholder="123 Logistics St, Suite 100..."></textarea>
                </div>

                <div class="flex items-center gap-2">
                  <input v-model="form.is_active" type="checkbox" id="w_active" class="rounded border-gray-300 text-primary focus:ring-primary" />
                  <label for="w_active" class="text-sm text-gray-700 font-medium">Склад активен для приема отправлений</label>
                </div>

                <div class="flex gap-3 pt-4 border-t border-gray-100">
                  <button type="button" @click="showModal = false" class="btn btn-ghost flex-1 border border-gray-200">
                    Отмена
                  </button>
                  <button type="submit" class="btn btn-primary flex-1" :disabled="saving">
                    Сохранить
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
import { warehousesAPI } from '@/api/index.js'

export default {
  name: 'AdminWarehousesPage',

  data() {
    return {
      warehouses: [],
      loading: false,
      saving: false,
      showModal: false,
      isEdit: false,
      editingId: null,

      form: {
        name: '',
        country: '',
        city: '',
        address: '',
        is_active: true
      }
    }
  },

  methods: {
    async loadWarehouses() {
      this.loading = true
      try {
        const r = await warehousesAPI.getAll()
        this.warehouses = r.data.data || []
      } catch (e) {
        console.error(e)
      } finally {
        this.loading = false
      }
    },

    openCreateModal() {
      this.isEdit = false
      this.editingId = null
      this.form = {
        name: '',
        country: '',
        city: '',
        address: '',
        is_active: true
      }
      this.showModal = true
    },

    openEditModal(w) {
      this.isEdit = true
      this.editingId = w.id
      this.form = {
        name: w.name,
        country: w.country,
        city: w.city,
        address: w.address,
        is_active: w.is_active !== false
      }
      this.showModal = true
    },

    async saveWarehouse() {
      this.saving = true
      try {
        if (this.isEdit) {
          await warehousesAPI.update(this.editingId, this.form)
        } else {
          await warehousesAPI.create(this.form)
        }
        alert('Склад сохранен!')
        this.showModal = false
        this.loadWarehouses()
      } catch (e) {
        alert('Ошибка при сохранении')
      } finally {
        this.saving = false
      }
    },

    async confirmDelete(w) {
      if (confirm(`Удалить склад ${w.name}?`)) {
        try {
          await warehousesAPI.delete(w.id)
          alert('Склад удален')
          this.loadWarehouses()
        } catch (e) {
          alert('Ошибка удаления')
        }
      }
    }
  },

  mounted() {
    this.loadWarehouses()
  }
}
</script>
