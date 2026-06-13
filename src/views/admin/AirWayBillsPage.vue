<template>
  <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">
    <!-- AWB List Panel -->
    <div class="xl:col-span-2 space-y-4">
      <div class="flex items-center justify-between">
        <h2 class="section-title">Авианакладные (Рейсы)</h2>
        <button @click="openCreateModal" class="btn btn-primary btn-sm">
          + Создать накладную
        </button>
      </div>

      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>Номер накладной</th>
              <th>Откуда</th>
              <th>Дата вылета</th>
              <th>Статус</th>
              <th>Детали</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading" class="text-center py-6">
              <td colspan="5">
                <div class="inline-block w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              </td>
            </tr>
            <tr v-else-if="awbs.length === 0">
              <td colspan="5" class="text-center py-6 text-gray-400">Накладные не созданы</td>
            </tr>
            <tr v-else v-for="awb in awbs" :key="awb.id"
              class="cursor-pointer" :class="{ 'bg-primary-50 hover:bg-primary-50': selectedAwb && selectedAwb.id === awb.id }"
              @click="selectAwb(awb)">
              <td class="font-mono text-sm font-bold text-gray-900">{{ awb.awb_number }}</td>
              <td class="text-sm">{{ awb.departure_country }}</td>
              <td class="text-xs text-gray-500">{{ formatDate(awb.departure_date) }}</td>
              <td>
                <span class="badge"
                  :class="{
                    'bg-gray-100 text-gray-700': awb.status === 'scheduled',
                    'bg-blue-100 text-blue-700': awb.status === 'departed',
                    'bg-green-100 text-green-700': awb.status === 'arrived'
                  }">
                  {{ awb.status }}
                </span>
              </td>
              <td>
                <div class="flex gap-2">
                  <button @click.stop="openEditModal(awb)" class="text-xs text-primary hover:underline">Изм.</button>
                  <button @click.stop="confirmDelete(awb)" class="text-xs text-danger hover:underline">Удал.</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Details and Parcels Planner Panel -->
    <div class="card space-y-4">
      <div v-if="selectedAwb" class="space-y-4">
        <div class="border-b border-gray-100 pb-3">
          <p class="text-xs text-gray-400">Накладная в работе</p>
          <h3 class="text-lg font-mono font-bold text-gray-900">{{ selectedAwb.awb_number }}</h3>
          <p class="text-xs text-gray-500 mt-1">Отправление: {{ selectedAwb.departure_country }} | Вылет: {{ formatDate(selectedAwb.departure_date) }}</p>
        </div>

        <div>
          <label class="form-label">Статус рейса:</label>
          <div class="flex gap-2">
            <select v-model="statusForm.status" class="input-field py-1 text-xs">
              <option value="scheduled">Запланирован</option>
              <option value="departed">Вылетел</option>
              <option value="arrived">Прибыл в Душанбе</option>
            </select>
            <button @click="updateAwbStatus" class="btn btn-primary btn-sm" :disabled="updatingStatus">
              OK
            </button>
          </div>
        </div>

        <!-- Assigned Parcels -->
        <div>
          <div class="flex justify-between items-center mb-2">
            <h4 class="text-sm font-semibold text-gray-700">Посылки на рейсе ({{ assignedParcels.length }})</h4>
            <button @click="showAssignModal = true" class="text-xs text-primary font-medium hover:underline">
              + Привязать посылку
            </button>
          </div>

          <div class="max-h-60 overflow-y-auto border border-gray-100 rounded-lg divide-y divide-gray-100">
            <div v-if="assignedParcels.length === 0" class="p-4 text-center text-xs text-gray-400">
              Посылки не привязаны к этой накладной
            </div>
            <div v-else v-for="p in assignedParcels" :key="p.id" class="p-3 text-xs flex justify-between items-center hover:bg-gray-50">
              <div>
                <p class="font-mono font-bold text-gray-800">{{ p.tracking_number }}</p>
                <p class="text-[10px] text-gray-500">{{ p.weight || '0' }} кг | {{ p.status }}</p>
              </div>
              <button @click="removeParcel(p.id)" class="text-danger font-semibold hover:underline">
                Убрать
              </button>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="h-64 flex items-center justify-center text-gray-400 text-sm">
        Выберите накладную из списка, чтобы управлять посылками рейса
      </div>
    </div>

    <!-- Edit/Create AWB Dialog -->
    <Teleport to="body">
      <transition name="fade">
        <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
          <div class="modal-content max-w-sm">
            <div class="p-6">
              <h3 class="text-base font-bold mb-4">{{ isEdit ? 'Изменить накладную' : 'Создать накладную' }}</h3>
              <form @submit.prevent="saveAwb" class="space-y-4">
                <div>
                  <label class="form-label">Номер накладной:</label>
                  <input v-model="form.awb_number" type="text" required class="input-field font-mono" placeholder="AWB-000000" />
                </div>
                <div>
                  <label class="form-label">Страна отправления:</label>
                  <select v-model="form.departure_country" required class="input-field">
                    <option value="USA">США</option>
                    <option value="Germany">Германия</option>
                  </select>
                </div>
                <div>
                  <label class="form-label">Дата вылета:</label>
                  <input v-model="form.departure_date" type="date" required class="input-field" />
                </div>
                <div class="flex gap-2 pt-2">
                  <button type="button" @click="showModal = false" class="btn btn-ghost flex-1 border border-gray-200">Отмена</button>
                  <button type="submit" class="btn btn-primary flex-1">Сохранить</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </transition>
    </Teleport>

    <!-- Assign Parcel Dialog -->
    <Teleport to="body">
      <transition name="fade">
        <div v-if="showAssignModal" class="modal-overlay" @click.self="showAssignModal = false">
          <div class="modal-content max-w-md">
            <div class="p-6">
              <h3 class="text-base font-bold mb-4">Привязать посылку к {{ selectedAwb?.awb_number }}</h3>
              <div class="space-y-3">
                <input v-model="searchParcelQuery" type="text" placeholder="Поиск по трек-номеру..." class="input-field mb-2" @input="loadUnassignedParcels" />

                <div class="max-h-60 overflow-y-auto border border-gray-200 rounded-lg divide-y divide-gray-100">
                  <div v-if="unassignedParcels.length === 0" class="p-4 text-center text-xs text-gray-400">
                    Нет свободных посылок для привязки
                  </div>
                  <div v-else v-for="p in unassignedParcels" :key="p.id"
                    class="p-3 text-xs flex justify-between items-center hover:bg-gray-50">
                    <div>
                      <p class="font-mono font-semibold text-gray-800">{{ p.tracking_number }}</p>
                      <p class="text-[10px] text-gray-400">{{ p.weight || '0' }} кг | {{ p.status }}</p>
                    </div>
                    <button @click="assignParcel(p.id)" class="btn btn-outline btn-sm !py-1 !px-2 text-[10px]">
                      Привязать
                    </button>
                  </div>
                </div>
              </div>
              <button @click="showAssignModal = false" class="btn btn-ghost border border-gray-200 w-full mt-4">
                Закрыть
              </button>
            </div>
          </div>
        </div>
      </transition>
    </Teleport>
  </div>
</template>

<script>
import { awbAPI, parcelsAPI } from '@/api/index.js'

export default {
  name: 'AdminAirWayBillsPage',

  data() {
    return {
      awbs: [],
      selectedAwb: null,
      assignedParcels: [],
      unassignedParcels: [],
      loading: false,
      updatingStatus: false,
      showModal: false,
      showAssignModal: false,
      isEdit: false,
      editingId: null,
      searchParcelQuery: '',

      form: {
        awb_number: '',
        departure_country: 'USA',
        departure_date: ''
      },

      statusForm: {
        status: 'scheduled'
      }
    }
  },

  methods: {
    formatDate(d) {
      if (!d) return '—'
      return new Date(d).toLocaleDateString('ru-RU')
    },

    async loadAwbs() {
      this.loading = true
      try {
        const r = await awbAPI.getAll()
        this.awbs = r.data.data || []
        if (this.awbs.length > 0 && !this.selectedAwb) {
          this.selectAwb(this.awbs[0])
        }
      } catch (e) {
        console.error(e)
      } finally {
        this.loading = false
      }
    },

    async selectAwb(awb) {
      this.selectedAwb = awb
      this.statusForm.status = awb.status
      this.loadAssignedParcels()
      this.loadUnassignedParcels()
    },

    async loadAssignedParcels() {
      if (!this.selectedAwb) return
      try {
        const r = await awbAPI.getOne(this.selectedAwb.id)
        // Check if backend format returns parcels on detail
        this.assignedParcels = r.data.data?.parcels || r.data.data?.airway_bill_parcels || []
      } catch (e) {
        this.assignedParcels = []
      }
    },

    async loadUnassignedParcels() {
      try {
        // Fetch parcels with received_at_warehouse/processing status
        const r = await parcelsAPI.getAll({ limit: 100 })
        const list = r.data.data || []
        // Filter out parcels that are already assigned to an AWB
        this.unassignedParcels = list.filter(p => !p.airway_bill_id && ['received_at_warehouse', 'processing'].includes(p.status))
        if (this.searchParcelQuery.trim()) {
          const q = this.searchParcelQuery.toLowerCase()
          this.unassignedParcels = this.unassignedParcels.filter(p => p.tracking_number.toLowerCase().includes(q))
        }
      } catch (e) {
        this.unassignedParcels = []
      }
    },

    openCreateModal() {
      this.isEdit = false
      this.editingId = null
      this.form = {
        awb_number: '',
        departure_country: 'USA',
        departure_date: new Date().toISOString().split('T')[0]
      }
      this.showModal = true
    },

    openEditModal(awb) {
      this.isEdit = true
      this.editingId = awb.id
      this.form = {
        awb_number: awb.awb_number,
        departure_country: awb.departure_country,
        departure_date: awb.departure_date ? awb.departure_date.split('T')[0] : ''
      }
      this.showModal = true
    },

    async saveAwb() {
      try {
        if (this.isEdit) {
          await awbAPI.update(this.editingId, this.form)
        } else {
          await awbAPI.create(this.form)
        }
        alert('Накладная сохранена!')
        this.showModal = false
        this.loadAwbs()
      } catch (e) {
        alert('Ошибка при сохранении')
      }
    },

    async updateAwbStatus() {
      if (!this.selectedAwb) return
      this.updatingStatus = true
      try {
        await awbAPI.updateStatus(this.selectedAwb.id, this.statusForm.status)
        alert('Статус обновлен')
        this.selectedAwb.status = this.statusForm.status
        this.loadAwbs()
      } catch (e) {
        alert('Ошибка обновления статуса')
      } finally {
        this.updatingStatus = false
      }
    },

    async assignParcel(parcelId) {
      try {
        await awbAPI.assignParcel(this.selectedAwb.id, parcelId)
        this.loadAssignedParcels()
        this.loadUnassignedParcels()
      } catch (e) {
        alert('Ошибка привязки')
      }
    },

    async removeParcel(parcelId) {
      try {
        await awbAPI.removeParcel(this.selectedAwb.id, parcelId)
        this.loadAssignedParcels()
        this.loadUnassignedParcels()
      } catch (e) {
        alert('Ошибка удаления привязки')
      }
    },

    async confirmDelete(awb) {
      if (confirm(`Удалить накладную ${awb.awb_number}?`)) {
        try {
          await awbAPI.delete(awb.id)
          alert('Удалено')
          if (this.selectedAwb?.id === awb.id) this.selectedAwb = null
          this.loadAwbs()
        } catch (e) {
          alert('Ошибка удаления')
        }
      }
    }
  },

  async mounted() {
    this.loadAwbs()
  }
}
</script>
