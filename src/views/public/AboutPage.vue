<template>
  <div class="max-w-4xl mx-auto px-4 py-12">
    <div class="text-center mb-12">
      <h1 class="text-3xl font-bold text-gray-900 mb-3">{{ about.hero_title }}</h1>
      <p class="text-gray-500 text-lg max-w-2xl mx-auto">{{ about.hero_subtitle }}</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
      <div class="card">
        <div class="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center mb-4">
          <span class="text-2xl">🎯</span>
        </div>
        <h2 class="text-xl font-bold mb-3">{{ about.mission_title }}</h2>
        <p class="text-gray-600 leading-relaxed whitespace-pre-line">
          {{ about.mission_text }}
        </p>
      </div>

      <div class="card">
        <div class="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center mb-4">
          <span class="text-2xl">🌍</span>
        </div>
        <h2 class="text-xl font-bold mb-3">{{ about.directions_title }}</h2>
        <div class="space-y-3">
          <div v-for="dir in about.directions" :key="dir.title"
            class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <span class="text-2xl">{{ dir.flag }}</span>
            <div>
              <p class="font-medium">{{ dir.title }}</p>
              <p class="text-sm text-gray-500">{{ dir.time }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="card text-center py-10">
      <h2 class="text-2xl font-bold mb-6">{{ about.stats_title }}</h2>
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-6">
        <div v-for="stat in about.stats" :key="stat.label">
          <p class="text-3xl font-bold text-primary">{{ stat.value }}</p>
          <p class="text-gray-500 text-sm mt-1">{{ stat.label }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useSiteContentStore } from '@/stores/siteContent.js'

export default {
  name: 'AboutPage',

  computed: {
    // Texts and figures are managed in the admin panel (Контент сайта → О нас).
    about() {
      return useSiteContentStore().about
    }
  },

  mounted() {
    useSiteContentStore().load()
  }
}
</script>
