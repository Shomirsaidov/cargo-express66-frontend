<template>
  <div class="max-w-3xl mx-auto space-y-6">
    <div class="card p-6">
      <h2 class="section-title mb-4">📊 Экспорт отчетов</h2>
      <p class="text-xs text-gray-500 mb-6">
        Сгенерируйте еженедельный отчет в удобном формате. Отчет содержит сводные данные по посылкам, весу, клиентам и начисленной стоимости.
      </p>

      <form @submit.prevent="downloadReport" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="form-label">Начало периода (Дата):</label>
            <input v-model="startDate" type="date" required class="input-field" />
          </div>
          <div>
            <label class="form-label">Конец периода (Дата):</label>
            <input v-model="endDate" type="date" required class="input-field" />
          </div>
        </div>

        <div>
          <label class="form-label">Формат файла:</label>
          <div class="grid grid-cols-3 gap-3">
            <label class="border rounded-xl p-3 flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-gray-50"
              :class="format === 'excel' ? 'border-primary bg-primary-50/20 text-primary' : 'border-gray-200 text-gray-700'">
              <input type="radio" v-model="format" value="excel" class="hidden" />
              <span class="text-2xl mb-1">🟢</span>
              <span class="text-xs font-semibold">MS Excel (.xlsx)</span>
            </label>

            <label class="border rounded-xl p-3 flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-gray-50"
              :class="format === 'pdf' ? 'border-primary bg-primary-50/20 text-primary' : 'border-gray-200 text-gray-700'">
              <input type="radio" v-model="format" value="pdf" class="hidden" />
              <span class="text-2xl mb-1">🔴</span>
              <span class="text-xs font-semibold">Adobe PDF (.pdf)</span>
            </label>

            <label class="border rounded-xl p-3 flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-gray-50"
              :class="format === 'csv' ? 'border-primary bg-primary-50/20 text-primary' : 'border-gray-200 text-gray-700'">
              <input type="radio" v-model="format" value="csv" class="hidden" />
              <span class="text-2xl mb-1">🔵</span>
              <span class="text-xs font-semibold">CSV Text (.csv)</span>
            </label>
          </div>
        </div>

        <div class="pt-4">
          <button type="submit" class="btn btn-primary w-full py-3 text-base flex justify-center items-center" :disabled="downloading">
            <span v-if="downloading" class="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
            📥 Скачать отчет
          </button>
        </div>
      </form>
    </div>

    <!-- Quick Stats Summary Card -->
    <div class="card p-6">
      <h3 class="font-bold text-sm text-gray-800 mb-3">📈 Краткий аудит (за выбранный период)</h3>
      <div class="grid grid-cols-3 gap-4 text-center">
        <div class="p-3 bg-gray-50 rounded-xl">
          <p class="text-2xl font-bold text-primary">{{ previewStats.totalParcels }}</p>
          <p class="text-[10px] text-gray-500 mt-1">Оприходовано посылок</p>
        </div>
        <div class="p-3 bg-gray-50 rounded-xl">
          <p class="text-2xl font-bold text-gray-700">{{ previewStats.totalWeight.toFixed(1) }} кг</p>
          <p class="text-[10px] text-gray-500 mt-1">Общий вес</p>
        </div>
        <div class="p-3 bg-gray-50 rounded-xl">
          <p class="text-2xl font-bold text-green-500">${{ previewStats.totalRevenue.toFixed(2) }}</p>
          <p class="text-[10px] text-gray-500 mt-1">Обороты по тарифам</p>
        </div>
      </div>
      <button @click="loadPreviewStats" class="btn btn-ghost btn-sm border border-gray-200 mt-4 mx-auto block">
        Рассчитать предварительные показатели
      </button>
    </div>
  </div>
</template>

<script>
import { reportsAPI } from '@/api/index.js'

export default {
  name: 'AdminReportsPage',

  data() {
    return {
      startDate: '',
      endDate: '',
      format: 'excel',
      downloading: false,

      previewStats: {
        totalParcels: 0,
        totalWeight: 0,
        totalRevenue: 0
      }
    }
  },

  methods: {
    async loadPreviewStats() {
      if (!this.startDate || !this.endDate) {
        alert('Пожалуйста, выберите диапазон дат!')
        return
      }
      try {
        // We can query weekly report to get summary stats
        const r = await reportsAPI.getStats({
          start_date: this.startDate,
          end_date: this.endDate,
          format: 'csv' // Light query format just to get header meta
        })
        // If csv response, parse header lines
        if (typeof r.data === 'string') {
          const lines = r.data.split('\n')
          const metaLine = lines.find(l => l.includes('Total Parcels:'))
          if (metaLine) {
            // Parse "# Total Parcels: X | Total Weight: Y kg | Total Revenue: $Z"
            const parts = metaLine.split('|')
            const parcels = parseInt(parts[0].match(/\d+/)?.[0] || '0')
            const weight = parseFloat(parts[1].match(/[\d\.]+/)?.[0] || '0')
            const revenue = parseFloat(parts[2].match(/[\d\.]+/)?.[0] || '0')
            this.previewStats = {
              totalParcels: parcels,
              totalWeight: weight,
              totalRevenue: revenue
            }
          }
        }
      } catch (e) {
        alert('Ошибка при подсчете статистики')
      }
    },

    async downloadReport() {
      this.downloading = true
      try {
        const response = await reportsAPI.generate({
          format: this.format,
          start_date: this.startDate,
          end_date: this.endDate
        })

        const blob = new Blob([response.data], { type: response.headers['content-type'] })
        const link = document.createElement('a')
        link.href = window.URL.createObjectURL(blob)

        const disposition = response.headers['content-disposition']
        let filename = `weekly-report-${this.startDate}-to-${this.endDate}`
        if (disposition && disposition.indexOf('filename=') !== -1) {
          filename = disposition.split('filename=')[1].replace(/"/g, '')
        } else {
          const ext = this.format === 'excel' ? 'xlsx' : this.format === 'pdf' ? 'pdf' : 'csv'
          filename = `${filename}.${ext}`
        }

        link.download = filename
        link.click()
        window.URL.revokeObjectURL(link.href)
      } catch (e) {
        alert('Не удалось сгенерировать файл отчета')
      } finally {
        this.downloading = false
      }
    },

    setInitialDates() {
      const now = new Date()
      const dayOfWeek = now.getDay()
      const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
      const monday = new Date(now)
      monday.setDate(now.getDate() + diffToMonday)
      const sunday = new Date(monday)
      sunday.setDate(monday.getDate() + 6)

      this.startDate = monday.toISOString().split('T')[0]
      this.endDate = sunday.toISOString().split('T')[0]
    }
  },

  mounted() {
    this.setInitialDates()
  }
}
</script>
