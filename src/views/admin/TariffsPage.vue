<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="page-title">{{ $t('admin.tariffs') }}</h1>
        <p class="text-sm text-gray-500 mt-1">Настройка стоимости доставки за килограмм по странам</p>
      </div>
      <button @click="openCreateModal" class="btn btn-primary">
        + Создать тариф
      </button>
    </div>

    <!-- Table -->
    <div class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th>Страна</th>
            <th>Цена за КГ ($)</th>
            <th>Минимальная стоимость ($)</th>
            <th>Срок доставки</th>
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
          <tr v-else-if="tariffs.length === 0">
            <td colspan="6" class="text-center py-6 text-gray-400">Тарифы не настроены</td>
          </tr>
          <tr v-else v-for="t in tariffs" :key="t.id">
            <td class="font-semibold text-gray-900 text-sm">{{ t.country }}</td>
            <td class="font-semibold text-gray-700 text-sm">${{ t.price_per_kg }}</td>
            <td class="text-sm">${{ t.minimum_charge }}</td>
            <td class="text-sm text-gray-600">{{ t.delivery_time }}</td>
            <td>
              <span class="badge"
                :class="t.is_active !== false ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'">
                {{ t.is_active !== false ? 'Активен' : 'Неактивен' }}
              </span>
            </td>
            <td>
              <div class="flex items-center gap-2">
                <button @click="openEditModal(t)" class="text-xs text-primary hover:underline">Изм.</button>
                <button @click="confirmDelete(t)" class="text-xs text-danger hover:underline">Удал.</button>
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
          <div class="modal-content max-w-sm">
            <div class="p-6">
              <h3 class="text-lg font-bold mb-4">{{ isEdit ? 'Редактировать тариф' : 'Создать тариф' }}</h3>

              <form @submit.prevent="saveTariff" class="space-y-4">
                <div>
                  <label class="form-label">Страна отправления:</label>
                  <input v-model="form.country" type="text" required class="input-field" placeholder="USA / Germany" />
                </div>

                <div class="grid grid-cols-2 gap-3">
                  <div>
                    <label class="form-label">Цена за кг ($):</label>
                    <input v-model="form.price_per_kg" type="number" step="0.01" required class="input-field" placeholder="10.00" />
                  </div>
                  <div>
                    <label class="form-label">Мин. плата ($):</label>
                    <input v-model="form.minimum_charge" type="number" step="0.01" required class="input-field" placeholder="5.00" />
                  </div>
                </div>

                <div>
                  <label class="form-label">Срок доставки (дней):</label>
                  <input v-model="form.delivery_time" type="text" required class="input-field" placeholder="6-10 дней" />
                </div>

                <div class="flex items-center gap-2">
                  <input v-model="form.is_active" type="checkbox" id="t_active" class="rounded border-gray-300 text-primary focus:ring-primary" />
                  <label for="t_active" class="text-sm text-gray-700 font-medium">Тариф активен</label>
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
import { tariffsAPI } from '@/api/index.js'

export default {
  name: 'AdminTariffsPage',

  data() {
    return {
      tariffs: [],
      loading: false,
      saving: false,
      showModal: false,
      isEdit: false,
      editingId: null,

      form: {
        country: '',
        price_per_kg: '',
        minimum_charge: '',
        delivery_time: '',
        is_active: true
      }
    }
  },

  methods: {
    async loadTariffs() {
      this.loading = true
      try {
        const r = await tariffsAPI.getAll()
        this.tariffs = r.data.data || []
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
        country: '',
        price_per_kg: '',
        minimum_charge: '',
        delivery_time: '',
        is_active: true
      }
      this.showModal = true
    },

    openEditModal(t) {
      this.isEdit = true
      this.editingId = t.id
      this.form = {
        country: t.country,
        price_per_kg: t.price_per_kg,
        minimum_charge: t.minimum_charge,
        delivery_time: t.delivery_time,
        is_active: t.is_active !== false
      }
      this.showModal = true
    },

    async saveTariff() {
      this.saving = true
      try {
        const payload = {
          country: this.form.country,
          price_per_kg: parseFloat(this.form.price_per_kg),
          minimum_charge: parseFloat(this.form.minimum_charge),
          delivery_time: this.form.delivery_time,
          is_active: this.form.is_active
        }

        if (this.isEdit) {
          await tariffsAPI.update(this.editingId, payload)
        } else {
          await tariffsAPI.create(payload)
        }
        alert('Тариф сохранен!')
        this.showModal = false
        this.loadTariffs()
      } catch (e) {
        alert('Ошибка при сохранении')
      } finally {
        this.saving = false
      }
    },

    async confirmDelete(t) {
      if (confirm(`Удалить тариф для ${t.country}?`)) {
        try {
          await tariffsAPI.delete(t.id)
          alert('Тариф удален')
          this.loadTariffs()
        } catch (e) {
          alert('Ошибка удаления')
        }
      }
    }
  },

  mounted() {
    this.loadTariffs()
  }
}
</script>
