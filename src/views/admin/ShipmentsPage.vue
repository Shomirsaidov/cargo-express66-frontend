<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="page-title">{{ $t('admin.shipments') }}</h1>
      <div class="flex gap-2">
        <button @click="openCreateModal(false)" class="btn btn-primary">
          + Создать отправление
        </button>
        <button @click="openCreateModal(true)" class="btn btn-outline hover:bg-primary hover:text-white transition-all">
          ⚡ Без трек-кода
        </button>
      </div>
    </div>

    <!-- Filters -->
    <div class="flex flex-wrap gap-3 mb-4">
      <div class="relative">
        <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
        <input v-model="search" type="text" placeholder="Поиск по трек-номеру..."
          class="input-field pl-9 w-64" @keyup.enter="loadParcels" />
      </div>

      <select v-model="statusFilter" class="input-field w-40" @change="loadParcels">
        <option value="">Все статусы</option>
        <option v-for="(label, key) in statuses" :key="key" :value="key">
          {{ label }}
        </option>
      </select>

      <select v-model="warehouseFilter" class="input-field w-44" @change="loadParcels">
        <option value="">Все склады</option>
        <option v-for="w in warehouses" :key="w.id" :value="w.id">
          {{ w.name }} ({{ w.country }})
        </option>
      </select>

      <button @click="loadParcels" class="btn btn-ghost border border-gray-200">
        Применить 🔄
      </button>
    </div>

    <!-- Table -->
    <div class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th>Трек-номер</th>
            <th>Клиент</th>
            <th>Склад</th>
            <th>Вес (кг)</th>
            <th>Стоимость ($)</th>
            <th>Статус</th>
            <th>Создано</th>
            <th>{{ $t('common.actions') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading">
            <td colspan="8" class="text-center py-8">
              <div class="inline-block w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            </td>
          </tr>
          <tr v-else-if="parcels.length === 0">
            <td colspan="8" class="text-center py-8 text-gray-400">Отправления не найдены</td>
          </tr>
          <tr v-else v-for="p in parcels" :key="p.id">
            <td class="font-mono text-sm font-semibold text-gray-900">
              <div>{{ p.tracking_number }}</div>
              <div v-if="p.parcel_services && p.parcel_services.length > 0" class="flex flex-wrap gap-1 mt-1">
                <span v-for="ps in p.parcel_services" :key="ps.id"
                  class="text-[9px] bg-primary-50 text-primary-700 px-1.5 py-0.5 rounded border border-primary-100 font-sans"
                  :title="ps.additional_services?.description || ''">
                  {{ getServiceNameRu(ps.additional_services?.name) }} (${{ ps.cost }})
                </span>
              </div>
            </td>
            <td>
              <div v-if="p.customers">
                <p class="font-medium text-gray-800 text-xs">{{ p.customers.last_name }} {{ p.customers.first_name }}</p>
                <p class="text-[10px] font-mono text-primary font-semibold">{{ p.customers.customer_code }}</p>
              </div>
              <span v-else class="text-xs text-red-500 font-medium italic">Unknown Recipient</span>
            </td>
            <td class="text-xs text-gray-600">
              {{ p.warehouses ? `${p.warehouses.name} (${p.warehouses.country})` : '—' }}
            </td>
            <td class="font-semibold text-gray-700 text-xs">{{ p.weight || '—' }}</td>
            <td class="font-semibold text-gray-900 text-xs">${{ p.total_cost || '0.00' }}</td>
            <td>
              <StatusBadge :status="p.status" />
            </td>
            <td class="text-gray-500 text-[10px]">{{ formatDate(p.created_at) }}</td>
            <td>
              <div class="flex items-center gap-1">
                <button @click="openPrintLabel(p)"
                  class="p-1.5 text-gray-400 hover:text-primary hover:bg-primary-50 rounded-lg transition-all text-xs"
                  title="Печать этикетки">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/>
                  </svg>
                </button>
                <button @click="openEditModal(p)"
                  class="p-1.5 text-gray-400 hover:text-primary hover:bg-primary-50 rounded-lg transition-all text-xs"
                  title="Редактировать">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
                  </svg>
                </button>
                <button @click="confirmDelete(p)"
                  class="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                  title="Удалить">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div v-if="pagination.total > pagination.limit" class="flex justify-between items-center mt-4">
      <span class="text-xs text-gray-500">Показано {{ parcels.length }} из {{ pagination.total }}</span>
      <div class="flex gap-2">
        <button @click="changePage(pagination.page - 1)" :disabled="pagination.page === 1" class="btn btn-ghost border border-gray-200 btn-sm">
          Назад
        </button>
        <button @click="changePage(pagination.page + 1)" :disabled="parcels.length < pagination.limit" class="btn btn-ghost border border-gray-200 btn-sm">
          Вперед
        </button>
      </div>
    </div>

    <!-- Edit/Create Modal -->
    <Teleport to="body">
      <transition name="fade">
        <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
          <div class="modal-content max-w-lg">
            <div class="p-6">
              <h3 class="text-lg font-bold mb-4">{{ isEdit ? 'Редактировать отправление' : 'Создать отправление' }}</h3>

              <form @submit.prevent="saveParcel" class="space-y-4">
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="form-label">Трек-номер:</label>
                    <input v-if="isNoTrack" type="text" disabled class="input-field bg-gray-50 text-gray-400 font-mono" value="RND (Автогенерация)" />
                    <input v-else v-model="form.tracking_number" type="text" required class="input-field" :disabled="isEdit" @change="lookupTrackingNumber" />
                  </div>

                  <div>
                    <label class="form-label">Склад:</label>
                    <select v-model="form.warehouse_id" required class="input-field">
                      <option v-for="w in warehouses" :key="w.id" :value="w.id">
                        {{ w.name }} ({{ w.country }})
                      </option>
                    </select>
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="form-label">Вес (кг):</label>
                    <input v-model="form.weight" type="number" step="0.01" class="input-field" />
                  </div>

                  <div>
                    <label class="form-label">Объявленная ценность ($):</label>
                    <input v-model="form.declared_value" type="number" step="0.1" class="input-field" />
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="form-label">Размеры (ДхШхВ):</label>
                    <input v-model="form.dimensions" type="text" placeholder="30x20x10" class="input-field" />
                  </div>

                  <div>
                    <label class="form-label">Статус:</label>
                    <select v-model="form.status" class="input-field">
                      <option v-for="(label, key) in statuses" :key="key" :value="key">
                        {{ label }}
                      </option>
                    </select>
                  </div>
                </div>

                <!-- Client Search Selector -->
                <div>
                  <label class="form-label">Назначить клиента:</label>
                  <div v-if="selectedCustomer" class="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg">
                    <div>
                      <p class="text-sm font-semibold text-gray-800">{{ selectedCustomer.last_name }} {{ selectedCustomer.first_name }}</p>
                      <p class="text-xs font-mono text-primary">{{ selectedCustomer.customer_code }}</p>
                    </div>
                    <button type="button" @click="clearCustomer" class="text-xs text-red-500 hover:underline">
                      Отвязать
                    </button>
                  </div>
                  <div v-else class="space-y-2">
                    <input v-model="customerQuery" type="text" placeholder="Поиск клиента..." class="input-field" @input="searchCustomers" @focus="searchCustomers" />
                    <div v-if="customerResults.length > 0" class="max-h-32 overflow-y-auto border border-gray-200 rounded-lg bg-white divide-y divide-gray-100">
                      <div v-for="c in customerResults" :key="c.id" @click="selectCustomer(c)"
                        class="p-2 text-xs hover:bg-primary-50 cursor-pointer flex justify-between">
                        <span>{{ c.last_name }} {{ c.first_name }} ({{ c.customer_code }})</span>
                        <span class="text-primary">Выбрать</span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Additional Services (Admin-Side) -->
                <div class="form-group" v-if="availableServices.length > 0">
                  <label class="form-label font-bold text-gray-700">Дополнительные услуги:</label>
                  <div class="space-y-2 mt-2 bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <div v-for="service in availableServices" :key="service.id" class="flex items-start">
                      <input type="checkbox" :id="'admin_service_' + service.id" :value="service.id" v-model="form.additional_services"
                        class="rounded border-gray-300 text-primary focus:ring-primary w-4 h-4 mr-2 mt-0.5 cursor-pointer" />
                      <label :for="'admin_service_' + service.id" class="text-sm text-gray-700 cursor-pointer select-none flex-1">
                        <span class="font-medium text-gray-900">{{ getServiceNameRu(service.name) }}</span>
                        <span class="text-gray-400 font-medium ml-1">
                          ({{ service.price_type === 'percentage' ? service.percentage + '%' : '+$' + service.price }})
                        </span>
                      </label>
                    </div>
                  </div>
                </div>

                <!-- Declared value input (if Insurance is selected) -->
                <div v-if="isInsuranceSelected" class="form-group bg-blue-50 border border-blue-100 p-3 rounded-lg">
                  <label class="form-label text-blue-900">Стоимость товара ($) *</label>
                  <input v-model.number="form.declared_value" type="number" step="0.1" min="0" required class="input-field border-blue-200 focus:border-primary"
                    placeholder="Введите стоимость для страховки..." />
                </div>

                <!-- Cost Breakdown for Admin -->
                <div class="bg-gray-50 rounded-xl p-4 space-y-2 border border-gray-100">
                  <h4 class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Расчет стоимости</h4>
                  <div class="flex justify-between text-sm">
                    <span class="text-gray-600">Доставка:</span>
                    <span class="font-semibold text-gray-900">
                      ${{ deliveryCost.toFixed(2) }}
                    </span>
                  </div>
                  <div class="flex justify-between text-sm">
                    <span class="text-gray-600">Дополнительные услуги:</span>
                    <span class="font-semibold text-gray-900">${{ additionalServicesCost.toFixed(2) }}</span>
                  </div>
                  <div v-if="isInsuranceSelected" class="flex justify-between text-sm">
                    <span class="text-gray-600">Страхование:</span>
                    <span class="font-semibold text-gray-900">${{ insuranceCost.toFixed(2) }}</span>
                  </div>
                  <div class="flex justify-between text-base font-bold pt-2 border-t border-gray-200">
                    <span class="text-gray-800">Итого:</span>
                    <span class="text-primary">${{ totalCost.toFixed(2) }}</span>
                  </div>
                </div>

                <div>
                  <label class="form-label">Заметки:</label>
                  <textarea v-model="form.notes" rows="2" class="input-field"></textarea>
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
    <!-- Print Label Modal -->
    <Teleport to="body">
      <transition name="fade">
        <div v-if="showPrintLabelModal" class="modal-overlay animate-fade-in" @click.self="showPrintLabelModal = false">
          <div class="modal-content max-w-sm overflow-hidden bg-white rounded-2xl shadow-xl border border-gray-100">
            <div class="p-6">
              <h3 class="text-lg font-bold mb-4 flex items-center gap-2 text-gray-900 border-b border-gray-100 pb-3">
                <span>🏷️ Печать этикетки</span>
              </h3>

              <!-- The Printable Area -->
              <div id="printable-label" class="border-2 border-black p-4 rounded-xl bg-white text-black font-sans my-4">
                <!-- Header -->
                <div class="border-b-2 border-black pb-2 flex justify-between items-center">
                  <span class="text-sm font-black uppercase tracking-wider">Cargo Express 66</span>
                  <span class="text-[10px] border border-black px-1.5 py-0.5 rounded font-bold">EXPRESS</span>
                </div>

                <!-- From / To info -->
                <div class="border-b border-black py-2.5 text-xs">
                  <div class="text-[9px] font-bold text-gray-500 uppercase tracking-wide">Откуда / From:</div>
                  <div class="font-bold text-gray-800">{{ printLabelData.warehouse_name || 'Main Warehouse' }}</div>
                </div>

                <div class="border-b border-black py-2.5 text-xs">
                  <div class="text-[9px] font-bold text-gray-500 uppercase tracking-wide">Куда / To:</div>
                  <div v-if="printLabelData.customer" class="space-y-0.5">
                    <div class="font-extrabold text-sm text-gray-900">
                      {{ printLabelData.customer.last_name }} {{ printLabelData.customer.first_name }}
                    </div>
                    <div class="font-mono font-bold text-primary text-xs">{{ printLabelData.customer.customer_code }}</div>
                    <div class="text-gray-600" v-if="printLabelData.customer.phone">{{ printLabelData.customer.phone }}</div>
                  </div>
                  <div v-else class="text-red-500 font-bold italic">Unknown Recipient</div>
                </div>

                <!-- Weight / Date -->
                <div class="border-b border-black py-2.5 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span class="text-[9px] font-bold text-gray-500 uppercase tracking-wide block">Вес / Weight:</span>
                    <span class="font-extrabold text-gray-900">{{ printLabelData.weight ? printLabelData.weight + ' кг' : '—' }}</span>
                  </div>
                  <div>
                    <span class="text-[9px] font-bold text-gray-500 uppercase tracking-wide block">Дата / Date:</span>
                    <span class="font-extrabold text-gray-900">{{ formatDate(printLabelData.created_at) }}</span>
                  </div>
                </div>

                <!-- Barcode area -->
                <div class="py-4 text-center">
                  <svg id="barcode-svg" class="mx-auto"></svg>
                  <div class="text-lg font-black font-mono tracking-widest text-black mt-2">
                    {{ printLabelData.tracking_number }}
                  </div>
                </div>

                <!-- Footer info -->
                <div class="border-t border-black pt-2 text-[9px] text-center font-bold text-gray-500 uppercase">
                  Cargo Express 66 · Быстрая доставка
                </div>
              </div>

              <!-- Action buttons -->
              <div class="flex gap-3 mt-5">
                <button type="button" @click="showPrintLabelModal = false" class="btn btn-ghost flex-1 border border-gray-200">
                  Закрыть
                </button>
                <button type="button" @click="printLabel" class="btn btn-primary flex-1 flex items-center justify-center gap-1">
                  <span>🖨️ Печать</span>
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
import { parcelsAPI, warehousesAPI, scannerAPI, tariffsAPI, servicesAPI } from '@/api/index.js'
import StatusBadge from '@/components/common/StatusBadge.vue'
import JsBarcode from 'jsbarcode'

export default {
  name: 'AdminShipmentsPage',

  components: { StatusBadge },

  data() {
    return {
      parcels: [],
      warehouses: [],
      loading: false,
      saving: false,
      showModal: false,
      isEdit: false,
      editingId: null,

      isNoTrack: false,
      showPrintLabelModal: false,
      printLabelData: {
        tracking_number: '',
        weight: null,
        created_at: '',
        warehouse_name: '',
        customer: null
      },

      search: '',
      statusFilter: '',
      warehouseFilter: '',

      pagination: {
        page: 1,
        limit: 20,
        total: 0
      },

      statuses: {
        awaiting_arrival: 'Ожидает прибытия',
        received_at_warehouse: 'Принято на склад',
        processing: 'Обработка',
        assigned_to_flight: 'Назначен на рейс',
        dispatched: 'Отправлен',
        in_transit: 'В пути',
        arrived_in_dushanbe: 'Прибыл в Душанбе',
        customs_clearance: 'Таможенное оформление',
        ready_for_pickup: 'Готово к выдаче',
        delivered: 'Доставлено',
        unknown_recipient: 'Неизвестный получатель',
        cancelled: 'Отменено'
      },

      selectedCustomer: null,
      customerQuery: '',
      customerResults: [],

      availableServices: [
        { id: 'f8b65003-8d46-4ab5-8e46-db4e4e1b6789', name: 'Inspection', description: 'Проверить товар (+$5)', price: 5, price_type: 'fixed', is_active: true },
        { id: '11111111-2222-3333-4444-555555555555', name: 'Photo', description: 'Сделать фото (+$2)', price: 2, price_type: 'fixed', is_active: true },
        { id: 'fa976004-9e57-4c06-8f57-eb5e5e2c7890', name: 'Functionality Check', description: 'Проверить работоспособность (+$10)', price: 10, price_type: 'fixed', is_active: true },
        { id: '22222222-3333-4444-5555-666666666666', name: 'Additional Packaging', description: 'Дополнительная упаковка (+$2)', price: 2, price_type: 'fixed', is_active: true },
        { id: 'e7a54f02-7c35-49a4-ad35-cf3f3f0a5678', name: 'Insurance', description: 'Страхование груза (2%)', price: 0, price_type: 'percentage', percentage: 2, is_active: true }
      ],
      tariffs: [],

      form: {
        tracking_number: '',
        warehouse_id: '',
        weight: '',
        dimensions: '',
        declared_value: '',
        status: 'awaiting_arrival',
        notes: '',
        additional_services: []
      }
    }
  },

  computed: {
    isInsuranceSelected() {
      const insuranceService = this.availableServices.find(s => s.name.toLowerCase().includes('insurance'));
      return insuranceService && this.form.additional_services.includes(insuranceService.id);
    },
    insuranceCost() {
      if (!this.isInsuranceSelected) return 0;
      const insuranceService = this.availableServices.find(s => s.name.toLowerCase().includes('insurance'));
      if (!insuranceService) return 0;
      const value = parseFloat(this.form.declared_value) || 0;
      return (value * parseFloat(insuranceService.percentage)) / 100;
    },
    additionalServicesCost() {
      let sum = 0;
      this.form.additional_services.forEach(id => {
        const service = this.availableServices.find(s => s.id === id);
        if (service && service.price_type === 'fixed') {
          sum += parseFloat(service.price) || 0;
        }
      });
      return sum;
    },
    deliveryCost() {
      const weight = parseFloat(this.form.weight) || 0;
      if (!weight) return 0;
      const wh = this.warehouses.find(w => w.id === this.form.warehouse_id);
      if (!wh || !wh.country) return 0;
      const tariff = this.tariffs.find(t => t.country.toLowerCase() === wh.country.toLowerCase() && t.is_active);
      if (!tariff) return 0;
      return Math.max(weight * parseFloat(tariff.price_per_kg), parseFloat(tariff.minimum_charge));
    },
    totalCost() {
      return this.deliveryCost + this.additionalServicesCost + this.insuranceCost;
    }
  },

  methods: {
    getServiceNameRu(name) {
      if (!name) return '';
      const lower = name.toLowerCase();
      if (lower.includes('insurance')) return 'Страхование';
      if (lower.includes('inspection')) return 'Проверка';
      if (lower.includes('photo')) return 'Фото';
      if (lower.includes('functionality')) return 'Проверка раб.';
      if (lower.includes('packaging') || lower.includes('repackaging')) return 'Упаковка';
      return name;
    },

    formatDate(d) {
      if (!d) return '—'
      return new Date(d).toLocaleDateString('ru-RU')
    },

    async loadParcels() {
      this.loading = true
      try {
        const params = {
          page: this.pagination.page,
          limit: this.pagination.limit
        }
        if (this.search.trim()) params.search = this.search.trim()
        if (this.statusFilter) params.status = this.statusFilter
        if (this.warehouseFilter) params.warehouse_id = this.warehouseFilter

        const r = await parcelsAPI.getAll(params)
        this.parcels = r.data.data || []
        this.pagination.total = r.data.pagination?.total || this.parcels.length
      } catch (e) {
        this.parcels = []
      } finally {
        this.loading = false
      }
    },

    async loadWarehouses() {
      try {
        const r = await warehousesAPI.getAll()
        this.warehouses = r.data.data || []
      } catch (e) {
        console.error(e)
      }
    },

    changePage(p) {
      this.pagination.page = p
      this.loadParcels()
    },

    openCreateModal(isNoTrack = false) {
      this.isEdit = false
      this.isNoTrack = isNoTrack
      this.editingId = null
      this.selectedCustomer = null
      this.customerQuery = ''
      this.customerResults = []
      this.form = {
        tracking_number: '',
        warehouse_id: this.warehouses[0]?.id || '',
        weight: '',
        dimensions: '',
        declared_value: '',
        status: 'awaiting_arrival',
        notes: '',
        additional_services: []
      }
      this.showModal = true
    },

    openEditModal(p) {
      this.isEdit = true
      this.isNoTrack = false
      this.editingId = p.id
      this.selectedCustomer = p.customers || null
      this.customerQuery = ''
      this.customerResults = []
      
      const selectedServices = p.parcel_services ? p.parcel_services.map(ps => ps.service_id) : [];

      this.form = {
        tracking_number: p.tracking_number,
        warehouse_id: p.warehouse_id,
        weight: p.weight || '',
        dimensions: p.dimensions || '',
        declared_value: p.declared_value || '',
        status: p.status,
        notes: p.notes || '',
        additional_services: selectedServices
      }
      this.showModal = true
    },

    openPrintLabel(parcel) {
      // Find the warehouse in state
      const wh = this.warehouses.find(w => w.id === parcel.warehouse_id)
      const whName = wh ? `${wh.name} (${wh.country})` : 'Main Warehouse'
      
      this.printLabelData = {
        tracking_number: parcel.tracking_number,
        weight: parcel.weight,
        created_at: parcel.created_at || new Date().toISOString(),
        warehouse_name: whName,
        customer: parcel.customers || this.selectedCustomer || null
      }
      
      this.showPrintLabelModal = true
      
      this.$nextTick(() => {
        JsBarcode("#barcode-svg", parcel.tracking_number, {
          format: "CODE128",
          width: 2,
          height: 60,
          displayValue: false,
          margin: 0
        })
      })
    },

    printLabel() {
      const printContent = document.getElementById('printable-label').innerHTML;
      const win = window.open('', '_blank');
      win.document.write(`
        <html>
          <head>
            <title>Печать этикетки - ${this.printLabelData.tracking_number}</title>
            <style>
              @page { size: 100mm 150mm; margin: 0; }
              body {
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                margin: 0;
                padding: 10px;
                box-sizing: border-box;
                display: flex;
                justify-content: center;
                align-items: center;
              }
              #printable-label {
                border: 2px solid #000;
                padding: 15px;
                border-radius: 8px;
                width: 90mm;
                height: 140mm;
                box-sizing: border-box;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
              }
              .border-b-2 { border-bottom: 2px solid #000; }
              .border-b { border-bottom: 1px solid #000; }
              .border-t { border-top: 1px solid #000; }
              .pb-2 { padding-bottom: 8px; }
              .py-2\\.5 { padding-top: 10px; padding-bottom: 10px; }
              .py-4 { padding-top: 16px; padding-bottom: 16px; }
              .pt-2 { padding-top: 8px; }
              .text-sm { font-size: 14px; }
              .text-xs { font-size: 12px; }
              .text-\[9px\] { font-size: 9px; }
              .text-\[10px\] { font-size: 10px; }
              .text-lg { font-size: 18px; }
              .font-black { font-weight: 900; }
              .font-extrabold { font-weight: 800; }
              .font-bold { font-weight: 700; }
              .font-semibold { font-weight: 600; }
              .font-medium { font-weight: 500; }
              .uppercase { text-transform: uppercase; }
              .tracking-wider { letter-spacing: 0.05em; }
              .tracking-widest { letter-spacing: 0.1em; }
              .text-gray-500 { color: #6b7280; }
              .text-gray-600 { color: #4b5563; }
              .text-gray-800 { color: #1f2937; }
              .text-gray-900 { color: #111827; }
              .text-primary-700 { color: #1d4ed8; }
              .text-red-500 { color: #ef4444; }
              .font-mono { font-family: monospace; }
              .mx-auto { margin-left: auto; margin-right: auto; }
              .text-center { text-align: center; }
              .flex { display: flex; }
              .justify-between { justify-content: space-between; }
              .items-center { align-items: center; }
              .grid { display: grid; }
              .grid-cols-2 { grid-template-cols: repeat(2, minmax(0, 1fr)); }
              .gap-2 { gap: 8px; }
              .space-y-0\.5 > * + * { margin-top: 2px; }
              svg { display: block; margin: 0 auto; max-width: 100%; }
            </style>
          </head>
          <body onload="window.print(); window.close();">
            <div id="printable-label">
              ${printContent}
            </div>
          </body>
        </html>
      `);
      win.document.close();
    },

    async searchCustomers() {
      const q = this.customerQuery.trim()
      try {
        const r = await scannerAPI.searchCustomers(q)
        this.customerResults = r.data.data?.users || r.data.data || []
      } catch (e) {
        this.customerResults = []
      }
    },

    async lookupTrackingNumber() {
      if (this.isEdit) return
      const trackNum = this.form.tracking_number.trim()
      if (!trackNum) return
      
      try {
        const r = await scannerAPI.scanParcel(trackNum)
        if (r.data?.data?.customer) {
          this.selectedCustomer = r.data.data.customer
        } else if (r.data?.data?.parcel?.customers) {
          this.selectedCustomer = r.data.data.parcel.customers
        }
      } catch (e) {
        console.error('Failed to lookup tracking number:', e)
      }
    },

    selectCustomer(c) {
      this.selectedCustomer = c
      this.customerResults = []
    },

    clearCustomer() {
      this.selectedCustomer = null
    },

    async saveParcel() {
      this.saving = true
      try {
        // Auto generate tracking number if in isNoTrack mode
        if (this.isNoTrack && !this.isEdit) {
          const randomDigits = Array.from({ length: 12 }, () => Math.floor(Math.random() * 10)).join('');
          this.form.tracking_number = 'RND' + randomDigits;
        }

        // If a customer is selected, status cannot be unknown_recipient
        if (this.selectedCustomer && this.form.status === 'unknown_recipient') {
          this.form.status = 'received_at_warehouse'
        }

        const payload = {
          tracking_number: this.form.tracking_number,
          warehouse_id: this.form.warehouse_id,
          customer_id: this.selectedCustomer?.id || null,
          weight: this.form.weight ? parseFloat(this.form.weight) : null,
          dimensions: this.form.dimensions,
          declared_value: this.form.declared_value ? parseFloat(this.form.declared_value) : null,
          notes: this.form.notes,
          status: this.form.status,
          service_ids: this.form.additional_services
        }

        let savedParcel = null;

        if (this.isEdit) {
          // General fields update
          await parcelsAPI.update(this.editingId, payload)
          // Status update
          await parcelsAPI.updateStatus(this.editingId, this.form.status)
        } else {
          const r = await parcelsAPI.create(payload)
          savedParcel = r.data.data || r.data
        }

        alert('Успешно сохранено!')
        this.showModal = false
        this.loadParcels()

        if (savedParcel) {
          this.openPrintLabel(savedParcel)
        }
      } catch (e) {
        alert(e.response?.data?.error || 'Ошибка при сохранении')
      } finally {
        this.saving = false
      }
    },

    async confirmDelete(p) {
      if (confirm(`Удалить отправление ${p.tracking_number}?`)) {
        try {
          await parcelsAPI.delete(p.id)
          alert('Отправление удалено')
          this.loadParcels()
        } catch (e) {
          alert('Ошибка удаления')
        }
      }
    }
  },

  async mounted() {
    await this.loadWarehouses()
    this.loadParcels()
    try {
      const t = await tariffsAPI.getAll()
      this.tariffs = (t.data.data || t.data || []).filter(trf => trf.is_active)
    } catch (e) {
      this.tariffs = []
    }
    try {
      const s = await servicesAPI.getAll()
      const fetched = (s.data.data || s.data || []).filter(srv => srv.is_active)
      if (fetched.length > 0) {
        this.availableServices = fetched
      }
    } catch (e) {
      console.error('Failed to load services, using fallback:', e)
    }
  }
}
</script>
