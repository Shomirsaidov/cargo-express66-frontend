<template>
  <div class="max-w-3xl mx-auto px-4 py-12">
    <div class="text-center mb-12">
      <h1 class="text-3xl font-bold text-gray-900 mb-3">{{ $t('nav.faq') }}</h1>
      <p class="text-gray-500">Ответы на часто задаваемые вопросы</p>
    </div>

    <div class="space-y-3">
      <div v-for="(item, index) in faqs" :key="index"
        class="card cursor-pointer"
        @click="toggle(index)">
        <div class="flex items-center justify-between">
          <h3 class="font-semibold text-gray-900 pr-4">{{ item.q }}</h3>
          <svg class="w-5 h-5 text-gray-400 flex-shrink-0 transition-transform"
            :class="{ 'rotate-180': openIndex === index }"
            fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
          </svg>
        </div>
        <transition name="slide-up">
          <p v-if="openIndex === index" class="mt-3 text-gray-600 text-sm leading-relaxed border-t border-gray-100 pt-3">
            {{ item.a }}
          </p>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import { useSiteContentStore } from '@/stores/siteContent.js'

export default {
  name: 'FaqPage',
  data() {
    return {
      openIndex: null
    }
  },
  computed: {
    // FAQ is editable in the admin panel (Контент сайта → FAQ) and stored in Supabase.
    faqs() {
      return useSiteContentStore().faq
    }
  },
  methods: {
    toggle(index) {
      this.openIndex = this.openIndex === index ? null : index
    }
  },
  mounted() {
    useSiteContentStore().load()
  }
}
</script>
