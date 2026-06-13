<template>
  <div>
    <!-- Hero Section -->
    <section class="relative bg-gradient-to-br from-primary-700 via-primary to-primary-400 text-white overflow-hidden">
      <div class="absolute inset-0 opacity-10">
        <div class="absolute top-10 left-10 w-64 h-64 rounded-full bg-white"></div>
        <div class="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-white"></div>
      </div>
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div class="max-w-3xl">
          <div class="inline-flex items-center gap-2 bg-white bg-opacity-20 rounded-full px-4 py-2 text-sm font-medium mb-6">
            <span class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            USA → Tajikistan &amp; Germany → Tajikistan
          </div>
          <h1 class="text-4xl lg:text-6xl font-bold mb-4 leading-tight">
            {{ $t('home.heroTitle') }}<br>
            <span class="text-yellow-300">{{ $t('home.heroSubtitle') }}</span>
          </h1>
          <p class="text-lg lg:text-xl text-blue-100 mb-8 max-w-2xl leading-relaxed">
            {{ $t('home.heroDesc') }}
          </p>
          <div class="flex flex-wrap gap-4">
            <RouterLink to="/tracking"
              class="btn btn-lg bg-white text-primary hover:bg-blue-50 font-semibold no-underline shadow-lg">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
              {{ $t('home.trackBtn') }}
            </RouterLink>
            <RouterLink to="/calculator"
              class="btn btn-lg border-2 border-white text-white hover:bg-white hover:text-primary font-semibold no-underline transition-all">
              {{ $t('home.calculateBtn') }}
            </RouterLink>
          </div>
        </div>
      </div>

      <!-- Wave -->
      <div class="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 80L1440 80L1440 40C1200 80 960 0 720 40C480 80 240 0 0 40L0 80Z" fill="white"/>
        </svg>
      </div>
    </section>

    <!-- Stats bar -->
    <section class="bg-white py-8 border-b border-gray-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div v-for="stat in stats" :key="stat.label" class="text-center">
            <p class="text-2xl lg:text-3xl font-bold text-primary">{{ stat.value }}</p>
            <p class="text-sm text-gray-500 mt-1">{{ stat.label }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Features -->
    <section class="py-16 lg:py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-900 mb-3">{{ $t('nav.about') }}</h2>
          <p class="text-gray-500 max-w-xl mx-auto">Мы обеспечиваем надежную доставку грузов с 2015 года</p>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div v-for="feature in features" :key="feature.title"
            class="group p-6 rounded-2xl border border-gray-100 hover:border-primary hover:shadow-md transition-all">
            <div class="w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-2xl"
              :style="{ backgroundColor: feature.bg }">
              {{ feature.emoji }}
            </div>
            <h3 class="font-semibold text-gray-900 mb-2">{{ feature.title }}</h3>
            <p class="text-sm text-gray-500 leading-relaxed">{{ feature.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- How it works -->
    <section class="py-16 lg:py-20 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-900 mb-3">{{ $t('home.howItWorksTitle') }}</h2>
        </div>
        <div class="relative">
          <!-- Connector line -->
          <div class="hidden lg:block absolute top-8 left-0 right-0 h-0.5 bg-primary-200 mx-16"></div>
          <div class="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-6 lg:gap-4">
            <div v-for="(step, index) in steps" :key="index" class="flex flex-col items-center text-center relative">
              <div class="w-16 h-16 rounded-full bg-primary text-white font-bold text-xl flex items-center justify-center shadow-lg relative z-10 mb-4">
                {{ index + 1 }}
              </div>
              <p class="text-sm font-medium text-gray-700 leading-snug">{{ step }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Quick Track -->
    <section class="py-16 bg-white">
      <div class="max-w-2xl mx-auto px-4 text-center">
        <h2 class="text-2xl font-bold text-gray-900 mb-3">{{ $t('publicTracking.title') }}</h2>
        <p class="text-gray-500 mb-6">{{ $t('publicTracking.subtitle') }}</p>
        <div class="flex gap-3">
          <input
            v-model="trackingInput"
            type="text"
            :placeholder="$t('publicTracking.placeholder')"
            class="input-field flex-1 text-base"
            @keyup.enter="goToTracking"
          />
          <button @click="goToTracking"
            class="btn btn-primary btn-lg flex-shrink-0">
            {{ $t('publicTracking.trackBtn') }}
          </button>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="py-16 lg:py-24 bg-gradient-to-r from-primary-600 to-primary text-white">
      <div class="max-w-4xl mx-auto px-4 text-center">
        <h2 class="text-3xl lg:text-4xl font-bold mb-4">{{ $t('home.ctaTitle') }}</h2>
        <p class="text-blue-100 text-lg mb-8">{{ $t('home.ctaDesc') }}</p>
        <RouterLink to="/register"
          class="btn btn-lg bg-white text-primary hover:bg-blue-50 font-semibold no-underline shadow-lg inline-flex">
          {{ $t('home.ctaBtn') }}
        </RouterLink>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'HomePage',

  data() {
    return {
      trackingInput: ''
    }
  },

  computed: {
    stats() {
      return [
        { value: '10,000+', label: 'Довольных клиентов' },
        { value: '50,000+', label: 'Доставленных посылок' },
        { value: '99.5%', label: 'Своевременная доставка' },
        { value: '24/7', label: 'Поддержка клиентов' }
      ]
    },
    features() {
      return [
        { emoji: '⚡', bg: '#EFF4FB', title: this.$t('home.feature1Title'), desc: this.$t('home.feature1Desc') },
        { emoji: '🛡️', bg: '#FFF0F0', title: this.$t('home.feature2Title'), desc: this.$t('home.feature2Desc') },
        { emoji: '📍', bg: '#F0FFF4', title: this.$t('home.feature3Title'), desc: this.$t('home.feature3Desc') },
        { emoji: '💬', bg: '#FFFBEB', title: this.$t('home.feature4Title'), desc: this.$t('home.feature4Desc') }
      ]
    },
    steps() {
      return [
        this.$t('home.step1'),
        this.$t('home.step2'),
        this.$t('home.step3'),
        this.$t('home.step4'),
        this.$t('home.step5')
      ]
    }
  },

  methods: {
    goToTracking() {
      if (this.trackingInput.trim()) {
        this.$router.push({ name: 'tracking', query: { q: this.trackingInput.trim() } })
      } else {
        this.$router.push({ name: 'tracking' })
      }
    }
  }
}
</script>
