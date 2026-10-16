<template>
  <div class="max-w-5xl mx-auto space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="page-title">Контент сайта</h1>
        <p class="text-sm text-gray-500 mt-1">
          Контакты, адреса складов, FAQ и тексты «О нас». Всё, что вы измените здесь,
          сразу подтягивается на сайт из базы данных.
        </p>
      </div>
    </div>

    <!-- Status banner -->
    <div v-if="toast" class="p-3 rounded-lg text-sm bg-green-50 border border-green-200 text-green-700">
      {{ toast }}
    </div>
    <div v-if="error" class="p-3 rounded-lg text-sm bg-red-50 border border-red-200 text-red-600">
      {{ error }}
    </div>

    <!-- Tabs -->
    <div class="flex flex-wrap border-b border-gray-200">
      <button v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id"
        class="px-5 py-3 font-semibold text-sm transition-all border-b-2"
        :class="activeTab === tab.id
          ? 'border-primary text-primary'
          : 'border-transparent text-gray-500 hover:text-gray-700'">
        {{ tab.label }}
      </button>
    </div>

    <div v-if="loading" class="card p-12 text-center">
      <div class="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>

    <template v-else>
      <!-- ═══════════════ КОНТАКТЫ ═══════════════ -->
      <div v-show="activeTab === 'contacts'" class="space-y-6">
        <div class="card p-6 space-y-5">
          <h2 class="section-title">Связь в США</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="form-label">Заголовок блока</label>
              <input v-model="contacts.usa.label" type="text" class="input-field" />
            </div>
            <div>
              <label class="form-label">Флаг / иконка</label>
              <input v-model="contacts.usa.flag" type="text" class="input-field" />
            </div>
            <div>
              <label class="form-label">Телефон (как показывать)</label>
              <input v-model="contacts.usa.phone" type="text" class="input-field" />
            </div>
            <div>
              <label class="form-label">Подпись под телефоном</label>
              <input v-model="contacts.usa.note" type="text" class="input-field" />
            </div>
          </div>
        </div>

        <div class="card p-6 space-y-5">
          <h2 class="section-title">Связь в Таджикистане</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="form-label">Заголовок блока</label>
              <input v-model="contacts.tajikistan.label" type="text" class="input-field" />
            </div>
            <div>
              <label class="form-label">Флаг / иконка</label>
              <input v-model="contacts.tajikistan.flag" type="text" class="input-field" />
            </div>
            <div class="md:col-span-2">
              <label class="form-label">Подпись под телефонами</label>
              <input v-model="contacts.tajikistan.note" type="text" class="input-field" />
            </div>
          </div>

          <div class="space-y-3">
            <label class="form-label">Телефоны</label>
            <div v-for="(phone, index) in contacts.tajikistan.phones" :key="index"
              class="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
              <input v-model="phone.display" type="text" class="input-field flex-1" placeholder="+992 929 74 44 99" />
              <button type="button" @click="contacts.tajikistan.phones.splice(index, 1)"
                class="btn btn-ghost btn-sm text-red-500 border border-gray-200">Удалить</button>
            </div>
            <button type="button" @click="contacts.tajikistan.phones.push({ display: '', raw: '' })"
              class="btn btn-ghost btn-sm border border-gray-200">+ Добавить телефон</button>
          </div>
        </div>

        <div class="card p-6 space-y-5">
          <h2 class="section-title">Почта и часы работы</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="form-label">E-mail</label>
              <input v-model="contacts.email" type="email" class="input-field" />
            </div>
            <div>
              <label class="form-label">Часы работы</label>
              <input v-model="contacts.working_hours" type="text" class="input-field" />
            </div>
          </div>
        </div>

        <div class="flex justify-end">
          <button @click="saveContacts" class="btn btn-primary px-8" :disabled="saving">
            Сохранить контакты
          </button>
        </div>
      </div>

      <!-- ═══════════════ АДРЕСА ═══════════════ -->
      <div v-show="activeTab === 'locations'" class="space-y-5">
        <div v-for="(loc, index) in locations" :key="index" class="card p-6 space-y-4">
          <div class="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 class="font-semibold text-gray-800">Адрес №{{ index + 1 }}</h3>
            <div class="flex items-center gap-3">
              <label class="flex items-center gap-1.5 text-xs text-gray-600 cursor-pointer">
                <input type="checkbox" v-model="loc.is_active" class="rounded border-gray-300 text-primary" />
                Показывать
              </label>
              <label class="flex items-center gap-1.5 text-xs text-gray-600 cursor-pointer">
                <input type="checkbox" v-model="loc.highlight" class="rounded border-gray-300 text-primary" />
                Выделить
              </label>
              <button type="button" @click="locations.splice(index, 1)"
                class="text-xs text-red-500 hover:underline">Удалить</button>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="form-label">Иконка</label>
              <input v-model="loc.icon" type="text" class="input-field" placeholder="🗽" />
            </div>
            <div>
              <label class="form-label">Название</label>
              <input v-model="loc.name" type="text" class="input-field" placeholder="New York Office" />
            </div>
            <div class="md:col-span-2">
              <label class="form-label">Адрес</label>
              <input v-model="loc.address" type="text" class="input-field font-mono" />
            </div>
            <div>
              <label class="form-label">Телефон</label>
              <input v-model="loc.phone" type="text" class="input-field" />
            </div>
            <div>
              <label class="form-label">Бейдж (необязательно)</label>
              <input v-model="loc.badge" type="text" class="input-field" />
            </div>
            <div class="md:col-span-2">
              <label class="form-label">Описание</label>
              <textarea v-model="loc.desc" rows="2" class="input-field"></textarea>
            </div>
            <div>
              <label class="form-label">Порядок вывода</label>
              <input v-model.number="loc.sort_order" type="number" class="input-field" />
            </div>
          </div>
        </div>

        <button type="button" @click="addLocation" class="btn btn-ghost border border-gray-200 w-full">
          + Добавить адрес
        </button>

        <div class="flex justify-end">
          <button @click="saveLocations" class="btn btn-primary px-8" :disabled="saving">
            Сохранить адреса
          </button>
        </div>
      </div>

      <!-- ═══════════════ FAQ ═══════════════ -->
      <div v-show="activeTab === 'faq'" class="space-y-5">
        <div v-for="(item, index) in faq" :key="index" class="card p-6 space-y-3">
          <div class="flex items-center justify-between">
            <h3 class="font-semibold text-gray-800">Вопрос №{{ index + 1 }}</h3>
            <div class="flex items-center gap-2">
              <button type="button" @click="move(faq, index, -1)" :disabled="index === 0"
                class="text-xs text-gray-500 hover:text-primary disabled:opacity-30">↑</button>
              <button type="button" @click="move(faq, index, 1)" :disabled="index === faq.length - 1"
                class="text-xs text-gray-500 hover:text-primary disabled:opacity-30">↓</button>
              <button type="button" @click="faq.splice(index, 1)" class="text-xs text-red-500 hover:underline">Удалить</button>
            </div>
          </div>
          <div>
            <label class="form-label">Вопрос</label>
            <input v-model="item.q" type="text" class="input-field" />
          </div>
          <div>
            <label class="form-label">Ответ</label>
            <textarea v-model="item.a" rows="3" class="input-field"></textarea>
          </div>
        </div>

        <button type="button" @click="faq.push({ q: '', a: '' })" class="btn btn-ghost border border-gray-200 w-full">
          + Добавить вопрос
        </button>

        <div class="flex justify-end">
          <button @click="save('site_faq', faq, 'FAQ')" class="btn btn-primary px-8" :disabled="saving">
            Сохранить FAQ
          </button>
        </div>
      </div>

      <!-- ═══════════════ О НАС ═══════════════ -->
      <div v-show="activeTab === 'about'" class="space-y-6">
        <div class="card p-6 space-y-4">
          <h2 class="section-title">Шапка страницы «О нас»</h2>
          <div>
            <label class="form-label">Заголовок</label>
            <input v-model="about.hero_title" type="text" class="input-field" />
          </div>
          <div>
            <label class="form-label">Подзаголовок</label>
            <input v-model="about.hero_subtitle" type="text" class="input-field" />
          </div>
        </div>

        <div class="card p-6 space-y-4">
          <h2 class="section-title">Миссия</h2>
          <div>
            <label class="form-label">Заголовок блока</label>
            <input v-model="about.mission_title" type="text" class="input-field" />
          </div>
          <div>
            <label class="form-label">Текст (страница «О нас»)</label>
            <textarea v-model="about.mission_text" rows="3" class="input-field"></textarea>
          </div>
          <div>
            <label class="form-label">Текст (блок на главной)</label>
            <textarea v-model="about.home_mission_text" rows="3" class="input-field"></textarea>
          </div>
        </div>

        <div class="card p-6 space-y-4">
          <h2 class="section-title">Направления доставки</h2>
          <div>
            <label class="form-label">Заголовок блока</label>
            <input v-model="about.directions_title" type="text" class="input-field" />
          </div>
          <div v-for="(dir, index) in about.directions" :key="index" class="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
            <input v-model="dir.flag" type="text" class="input-field sm:col-span-2" placeholder="🇺🇸" />
            <input v-model="dir.title" type="text" class="input-field sm:col-span-5" placeholder="США → Таджикистан" />
            <input v-model="dir.time" type="text" class="input-field sm:col-span-4" placeholder="6-10 рабочих дней" />
            <button type="button" @click="about.directions.splice(index, 1)"
              class="btn btn-ghost btn-sm text-red-500 border border-gray-200 sm:col-span-1">×</button>
          </div>
          <button type="button" @click="about.directions.push({ flag: '', title: '', time: '' })"
            class="btn btn-ghost btn-sm border border-gray-200">+ Добавить направление</button>
        </div>

        <div class="card p-6 space-y-4">
          <h2 class="section-title">Показатели</h2>
          <div>
            <label class="form-label">Заголовок блока</label>
            <input v-model="about.stats_title" type="text" class="input-field" />
          </div>
          <div v-for="(stat, index) in about.stats" :key="index" class="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
            <input v-model="stat.value" type="text" class="input-field sm:col-span-4" placeholder="10K+" />
            <input v-model="stat.label" type="text" class="input-field sm:col-span-7" placeholder="Клиентов" />
            <button type="button" @click="about.stats.splice(index, 1)"
              class="btn btn-ghost btn-sm text-red-500 border border-gray-200 sm:col-span-1">×</button>
          </div>
          <button type="button" @click="about.stats.push({ value: '', label: '' })"
            class="btn btn-ghost btn-sm border border-gray-200">+ Добавить показатель</button>
        </div>

        <div class="card p-6 space-y-4">
          <h2 class="section-title">Преимущества и склады</h2>
          <div>
            <label class="form-label">Заголовок «Преимущества»</label>
            <input v-model="about.advantages_title" type="text" class="input-field" />
          </div>
          <div>
            <label class="form-label">Преимущества (по одному в строке)</label>
            <textarea v-model="advantagesText" rows="4" class="input-field"></textarea>
          </div>
          <div>
            <label class="form-label">Заголовок «Склады приема»</label>
            <input v-model="about.warehouses_title" type="text" class="input-field" />
          </div>
          <div>
            <label class="form-label">Склады (по одному в строке)</label>
            <textarea v-model="warehousesText" rows="4" class="input-field"></textarea>
          </div>
        </div>

        <div class="card p-6 space-y-4">
          <h2 class="section-title">Надёжность и гарантии</h2>
          <div>
            <label class="form-label">Заголовок блока</label>
            <input v-model="about.reliability_title" type="text" class="input-field" />
          </div>
          <div>
            <label class="form-label">Текст</label>
            <textarea v-model="about.reliability_text" rows="4" class="input-field"></textarea>
          </div>
        </div>

        <div class="flex justify-end">
          <button @click="saveAbout" class="btn btn-primary px-8" :disabled="saving">
            Сохранить «О нас»
          </button>
        </div>
      </div>

      <!-- ═══════════════ ПОДВАЛ ═══════════════ -->
      <div v-show="activeTab === 'footer'" class="space-y-6">
        <div class="card p-6 space-y-4">
          <h2 class="section-title">Подвал сайта</h2>
          <div>
            <label class="form-label">Описание компании</label>
            <textarea v-model="footer.description" rows="3" class="input-field"></textarea>
          </div>
          <div>
            <label class="form-label">Копирайт</label>
            <input v-model="footer.copyright" type="text" class="input-field" />
          </div>
          <div>
            <label class="form-label">Подпись (страны)</label>
            <input v-model="footer.tagline" type="text" class="input-field" />
          </div>
        </div>

        <div class="flex justify-end">
          <button @click="save('site_footer', footer, 'Подвал')" class="btn btn-primary px-8" :disabled="saving">
            Сохранить подвал
          </button>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { settingsAPI } from '@/api/index.js'
import {
  useSiteContentStore,
  DEFAULT_CONTACTS,
  DEFAULT_LOCATIONS,
  DEFAULT_FAQ,
  DEFAULT_ABOUT,
  DEFAULT_FOOTER,
  mergeDefaults
} from '@/stores/siteContent.js'

const clone = (value) => JSON.parse(JSON.stringify(value))
/** Build a dialable value for `tel:` links, e.g. "+1 (518) 528-4810" -> "+15185284810". */
const toRawPhone = (phone) => String(phone || '').replace(/[^\d+]/g, '')

export default {
  name: 'AdminSiteContentPage',

  data() {
    return {
      activeTab: 'contacts',
      loading: true,
      saving: false,
      toast: '',
      error: '',
      toastTimer: null,

      contacts: clone(DEFAULT_CONTACTS),
      locations: clone(DEFAULT_LOCATIONS),
      faq: clone(DEFAULT_FAQ),
      about: clone(DEFAULT_ABOUT),
      footer: clone(DEFAULT_FOOTER)
    }
  },

  computed: {
    tabs() {
      return [
        { id: 'contacts', label: 'Контакты' },
        { id: 'locations', label: 'Адреса складов' },
        { id: 'faq', label: 'FAQ' },
        { id: 'about', label: 'О нас' },
        { id: 'footer', label: 'Подвал' }
      ]
    },

    advantagesText: {
      get() {
        return (this.about.advantages || []).join('\n')
      },
      set(value) {
        this.about.advantages = value.split('\n').map((line) => line.trim()).filter(Boolean)
      }
    },

    warehousesText: {
      get() {
        return (this.about.warehouses || []).join('\n')
      },
      set(value) {
        this.about.warehouses = value.split('\n').map((line) => line.trim()).filter(Boolean)
      }
    }
  },

  methods: {
    notify(message) {
      this.toast = message
      this.error = ''
      clearTimeout(this.toastTimer)
      this.toastTimer = setTimeout(() => { this.toast = '' }, 2500)
    },

    async load() {
      this.loading = true
      this.error = ''
      try {
        const response = await settingsAPI.getPublic()
        const data = response.data?.data || {}

        this.contacts = mergeDefaults(clone(DEFAULT_CONTACTS), data.site_contacts)
        this.locations = (Array.isArray(data.site_locations) && data.site_locations.length
          ? clone(data.site_locations)
          : clone(DEFAULT_LOCATIONS))
        this.faq = (Array.isArray(data.site_faq) && data.site_faq.length
          ? clone(data.site_faq)
          : clone(DEFAULT_FAQ))
        this.about = mergeDefaults(clone(DEFAULT_ABOUT), data.site_about)
        this.footer = mergeDefaults(clone(DEFAULT_FOOTER), data.site_footer)
      } catch (err) {
        this.error = 'Не удалось загрузить контент сайта'
      } finally {
        this.loading = false
      }
    },

    /** Persist one JSON content block and refresh the public cache. */
    async save(key, value, label) {
      this.saving = true
      this.error = ''
      try {
        await settingsAPI.update(key, { value })
        await useSiteContentStore().refresh()
        this.notify(`${label}: сохранено`)
      } catch (err) {
        this.error = err.response?.data?.error || `Ошибка сохранения (${label})`
      } finally {
        this.saving = false
      }
    },

    async saveAbout() {
      const payload = clone(this.about)
      payload.advantages = this.advantagesText.split('\n').map((l) => l.trim()).filter(Boolean)
      payload.warehouses = this.warehousesText.split('\n').map((l) => l.trim()).filter(Boolean)
      await this.save('site_about', payload, 'О нас')
    },

    /** Normalize phone numbers into `tel:`-friendly form before saving. */
    saveContacts() {
      const payload = clone(this.contacts)
      payload.usa.phone_raw = toRawPhone(payload.usa.phone)
      payload.tajikistan.phones = (payload.tajikistan.phones || [])
        .filter((p) => p && p.display)
        .map((p) => ({ display: p.display, raw: toRawPhone(p.display) }))
      return this.save('site_contacts', payload, 'Контакты')
    },

    saveLocations() {
      const payload = this.locations.map((loc, index) => ({
        ...loc,
        sort_order: Number.isFinite(Number(loc.sort_order)) ? Number(loc.sort_order) : index + 1,
        phone_raw: toRawPhone(loc.phone)
      }))
      return this.save('site_locations', payload, 'Адреса')
    },

    addLocation() {
      this.locations.push({
        icon: '📍',
        name: '',
        address: '',
        phone: '',
        phone_raw: '',
        desc: '',
        badge: '',
        highlight: false,
        is_active: true,
        sort_order: this.locations.length + 1
      })
    },

    move(list, index, direction) {
      const target = index + direction
      if (target < 0 || target >= list.length) return
      const [item] = list.splice(index, 1)
      list.splice(target, 0, item)
    }
  },

  beforeUnmount() {
    clearTimeout(this.toastTimer)
  },

  mounted() {
    this.load()
  }
}
</script>
