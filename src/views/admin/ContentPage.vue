<template>
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <!-- Pages list -->
    <div class="lg:col-span-1 space-y-4">
      <h2 class="section-title">Страницы CMS</h2>
      <div class="card p-0 overflow-hidden">
        <div class="divide-y divide-gray-100">
          <div v-for="p in pages" :key="p.slug" @click="selectPage(p)"
            class="p-4 cursor-pointer hover:bg-primary-50 transition-colors flex justify-between items-center"
            :class="{ 'bg-primary-50 border-l-4 border-primary pl-3': selectedPageSlug === p.slug }">
            <div>
              <p class="font-semibold text-gray-800 text-sm">{{ p.title_ru || p.slug }}</p>
              <p class="text-[10px] font-mono text-gray-400 mt-0.5">{{ p.slug }}</p>
            </div>
            <span class="badge" :class="p.is_published !== false ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'">
              {{ p.is_published !== false ? 'Публичный' : 'Черновик' }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Page Editor -->
    <div class="lg:col-span-2 card p-6">
      <div v-if="loadingDetail" class="text-center py-12">
        <div class="inline-block w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
      <div v-else-if="form.slug" class="space-y-4">
        <div class="flex items-center justify-between border-b border-gray-100 pb-3">
          <div>
            <span class="text-xs text-gray-400">Редактирование страницы</span>
            <h3 class="text-lg font-bold text-gray-900">{{ form.slug }}</h3>
          </div>
          <div class="flex items-center gap-2">
            <input v-model="form.is_published" type="checkbox" id="p_published" class="rounded border-gray-300 text-primary" />
            <label for="p_published" class="text-xs text-gray-700 font-medium">Опубликовать</label>
          </div>
        </div>

        <!-- Translation Tabs -->
        <div class="flex border-b border-gray-100 gap-4 mb-2">
          <button @click="tab = 'ru'" class="pb-2 text-sm font-semibold border-b-2 transition-all"
            :class="tab === 'ru' ? 'border-primary text-primary' : 'border-transparent text-gray-400'">
            Русский (RU)
          </button>
          <button @click="tab = 'en'" class="pb-2 text-sm font-semibold border-b-2 transition-all"
            :class="tab === 'en' ? 'border-primary text-primary' : 'border-transparent text-gray-400'">
            English (EN)
          </button>
        </div>

        <!-- Russian Tab fields -->
        <div v-show="tab === 'ru'" class="space-y-4">
          <div>
            <label class="form-label">Заголовок страницы (RU):</label>
            <input v-model="form.title_ru" type="text" class="input-field" required />
          </div>
          <div>
            <label class="form-label">Содержимое страницы (HTML / Текст):</label>
            <textarea v-model="form.content_ru" rows="12" class="input-field font-mono text-xs"></textarea>
          </div>
        </div>

        <!-- English Tab fields -->
        <div v-show="tab === 'en'" class="space-y-4">
          <div>
            <label class="form-label">Заголовок страницы (EN):</label>
            <input v-model="form.title_en" type="text" class="input-field" required />
          </div>
          <div>
            <label class="form-label">Содержимое страницы (HTML / Текст):</label>
            <textarea v-model="form.content_en" rows="12" class="input-field font-mono text-xs"></textarea>
          </div>
        </div>

        <div class="flex gap-3 pt-4 border-t border-gray-100 justify-end">
          <button @click="savePage" class="btn btn-primary px-8" :disabled="saving">
            Сохранить изменения
          </button>
        </div>
      </div>
      <div v-else class="h-64 flex items-center justify-center text-gray-400 text-sm">
        Выберите страницу слева, чтобы начать редактирование контента
      </div>
    </div>
  </div>
</template>

<script>
import { cmsAPI } from '@/api/index.js'

export default {
  name: 'AdminContentPage',

  data() {
    return {
      pages: [],
      selectedPageSlug: null,
      loadingDetail: false,
      saving: false,
      tab: 'ru',

      form: {
        slug: '',
        title_ru: '',
        title_en: '',
        content_ru: '',
        content_en: '',
        is_published: true
      }
    }
  },

  methods: {
    async loadPages() {
      try {
        const r = await cmsAPI.getPages()
        this.pages = r.data.data || []
        if (this.pages.length > 0 && !this.selectedPageSlug) {
          this.selectPage(this.pages[0])
        }
      } catch (e) {
        console.error(e)
      }
    },

    async selectPage(p) {
      this.selectedPageSlug = p.slug
      this.loadingDetail = true
      try {
        const r = await cmsAPI.getPage(p.slug)
        const d = r.data.data || r.data
        this.form = {
          slug: d.slug,
          title_ru: d.title_ru || '',
          title_en: d.title_en || '',
          content_ru: d.content_ru || '',
          content_en: d.content_en || '',
          is_published: d.is_published !== false
        }
      } catch (e) {
        alert('Не удалось загрузить данные страницы')
      } finally {
        this.loadingDetail = false
      }
    },

    async savePage() {
      this.saving = true
      try {
        await cmsAPI.updatePage(this.form.slug, this.form)
        alert('Контент сохранен успешно!')
        this.loadPages()
      } catch (e) {
        alert('Ошибка при сохранении контента')
      } finally {
        this.saving = false
      }
    }
  },

  mounted() {
    this.loadPages()
  }
}
</script>
