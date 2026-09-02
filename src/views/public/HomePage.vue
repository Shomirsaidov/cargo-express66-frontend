<template>
  <div class="space-y-20 pb-20">
    <!-- Hero Section -->
    <section class="relative bg-gradient-to-br from-primary-800 via-primary to-primary-500 text-white overflow-hidden">
      <div class="absolute inset-0 opacity-10">
        <div class="absolute top-10 left-10 w-64 h-64 rounded-full bg-white"></div>
        <div class="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-white"></div>
      </div>
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div class="max-w-3xl">
          <div class="inline-flex items-center gap-2 bg-white bg-opacity-20 rounded-full px-4 py-2 text-sm font-medium mb-6">
            <span class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            USA → Tajikistan &amp; Europe → Tajikistan (Германия, Испания, Италия)
          </div>
          <h1 class="text-4xl lg:text-6xl font-extrabold mb-6 leading-tight">
            {{ $t('home.heroTitle') }}<br>
            <span class="text-yellow-300">{{ $t('home.heroSubtitle') }}</span>
          </h1>
          <p class="text-lg lg:text-xl text-blue-100 mb-8 max-w-2xl leading-relaxed">
            Мы доставляем товары из любых интернет-магазинов США и Европы (Германии, Испании, Италии) напрямую в Таджикистан (Душанбе и Худжанд). Быстро, надежно и по самым выгодным ценам.
          </p>
          <div class="flex flex-wrap gap-4">
            <a href="#tracking"
              class="btn btn-lg bg-white text-primary hover:bg-blue-50 font-semibold no-underline shadow-lg">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
              {{ $t('home.trackBtn') }}
            </a>
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
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="card py-8 border border-gray-100 shadow-sm rounded-2xl">
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div v-for="stat in stats" :key="stat.label" class="text-center border-r last:border-0 border-gray-100">
            <p class="text-3xl lg:text-4xl font-black text-primary">{{ stat.value }}</p>
            <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide mt-1">{{ stat.label }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- About & Destinations Section -->
    <section id="about" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-12">
        <span class="bg-primary-50 text-primary border border-primary-200 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
          О компании
        </span>
        <h2 class="text-3xl font-extrabold text-gray-900 mt-3 mb-2">Кто мы такие и куда доставляем</h2>
        <p class="text-gray-500 max-w-xl mx-auto">Надёжный партнёр для международной доставки грузов с 2024 года</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div class="card p-8 flex flex-col justify-between border border-gray-100 shadow-sm rounded-3xl">
          <div>
            <div class="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center mb-4 text-2xl">
              🎯
            </div>
            <h3 class="text-2xl font-bold text-gray-900 mb-4">Наша миссия</h3>
            <p class="text-gray-600 leading-relaxed mb-6">
              Сделать международные покупки доступными и простыми для каждого жителя Таджикистана.
              Мы берем на себя все заботы по логистике, оформлению документов и надежной транспортировке ваших посылок из США и Европы. Вы просто покупаете — мы бережно доставляем.
            </p>
          </div>
          <div class="border-t border-gray-100 pt-6">
            <h4 class="font-bold text-gray-900 mb-2">Наши преимущества</h4>
            <div class="grid grid-cols-2 gap-4 text-sm text-gray-600">
              <div class="flex items-center gap-2">🔹 Фото посылки на складе</div>
              <div class="flex items-center gap-2">🔹 Страхование грузов</div>
              <div class="flex items-center gap-2">🔹 Личный кабинет 24/7</div>
              <div class="flex items-center gap-2">🔹 Оплата при получении</div>
            </div>
          </div>
        </div>

        <div class="card p-8 border border-gray-100 shadow-sm rounded-3xl flex flex-col justify-between">
          <div>
            <div class="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center mb-4 text-2xl">
              🛡️
            </div>
            <h3 class="text-2xl font-bold text-gray-900 mb-4">Надежность и гарантии</h3>
            <p class="text-gray-600 leading-relaxed mb-6">
              Мы гарантируем 100% сохранность ваших посылок. Каждое отправление отслеживается на всех этапах пути: от прибытия на наш склад в США или Европе до момента выдачи в Таджикистане. Все грузы застрахованы, а наша служба поддержки всегда готова ответить на любые вопросы.
            </p>
          </div>
          <div class="border-t border-gray-100 pt-6">
            <h4 class="font-bold text-gray-900 mb-2">Наши склады приема</h4>
            <div class="grid grid-cols-2 gap-4 text-sm text-gray-600">
              <div class="flex items-center gap-2">📍 Нью-Йорк, США</div>
              <div class="flex items-center gap-2">📍 Делавэр, США</div>
              <div class="flex items-center gap-2">📍 Мюнхен, Германия</div>
              <div class="flex items-center gap-2">📍 Мадрид, Испания</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Dynamic pricing summary -->
      <div class="mt-16">
        <div class="mb-8">
          <h3 class="text-2xl font-bold text-gray-900">🌍 Тарифы по направлениям доставки</h3>
          <p class="text-sm text-gray-500 mt-1">Цены за авиадоставку посылок в Таджикистан (Душанбе, Худжанд)</p>
        </div>

        <!-- Grid container (stacked on mobile, grid on desktop) -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div v-for="d in directionsPricing" :key="d.country"
            class="w-full bg-white rounded-2xl border border-gray-150 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow group relative">
            
            <!-- Top Section -->
            <div class="p-5">
              <div class="flex items-center justify-between">
                <span class="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <span>{{ d.flag }}</span> {{ d.country }}
                </span>
                <span v-if="d.note" :title="d.note"
                  class="w-6 h-6 rounded-full bg-cyan-50 text-cyan-500 hover:bg-cyan-100 flex items-center justify-center text-xs font-serif font-bold cursor-help transition-all">
                  i
                </span>
              </div>
              <div class="text-xs text-gray-400 mt-2 flex items-center gap-1.5 font-medium">
                <span>⚖️</span> за 1 кг
              </div>
            </div>

            <!-- Bottom Section (Dark Navy) -->
            <div class="bg-[#1b2537] p-4 text-white flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white/80 group-hover:scale-105 transition-all">
                  ✈
                </div>
                <div>
                  <p class="text-[9px] text-gray-400 uppercase tracking-widest font-black leading-tight">Авиа</p>
                  <p class="text-xs font-bold text-white flex items-center gap-1 mt-0.5">
                    ⏱ ≈{{ d.time }}
                  </p>
                </div>
              </div>
              <div class="text-lg font-black tracking-tight text-white">
                {{ d.price }}
              </div>
            </div>

          </div>
        </div>

        <!-- Standalone Highlighted Direction for Kazakhstan -->
        <div v-if="kazakhstanTariff" class="border-t border-gray-150 mt-6 pt-6">
          <div class="bg-gradient-to-r from-primary to-blue-600 rounded-2xl p-6 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md border border-primary/20 relative overflow-hidden group">
            <!-- Glow background effect -->
            <div class="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div class="flex items-center gap-4 text-center sm:text-left flex-col sm:flex-row relative z-10">
              <span class="text-4xl bg-white/20 w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0">🇰🇿</span>
              <div>
                <div class="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                  <span class="bg-white/20 text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full">Спецнаправление</span>
                  <span class="bg-white/20 text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full">Из США</span>
                </div>
                <h4 class="text-xl font-bold mt-1.5 flex items-center justify-center sm:justify-start gap-2 text-white">
                  США <span class="text-white/60">→</span> Казахстан
                </h4>
                <p class="text-xs text-white/95 mt-1 leading-relaxed">
                  Авиадоставка сборных грузов и посылок из США по направлению Казахстан.
                </p>
              </div>
            </div>
            
            <div class="flex items-center gap-6 relative z-10 w-full sm:w-auto justify-center">
              <div class="text-center sm:text-right">
                <span class="text-[9px] text-white/70 uppercase tracking-widest block font-bold">Сроки</span>
                <span class="text-xs sm:text-sm font-bold flex items-center justify-center sm:justify-end gap-1 mt-0.5 text-white">
                  ⏱ ≈{{ kazakhstanTariff.delivery_time || '5-10 раб. дней' }}
                </span>
              </div>
              <div class="h-8 w-px bg-white/30"></div>
              <div class="text-center">
                <span class="text-[9px] text-white/70 uppercase tracking-widest block font-bold">Тариф за 1 кг</span>
                <span class="text-xl sm:text-2xl font-black text-white">${{ kazakhstanTariff.price_per_kg }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- How it works -->
    <section id="how-it-works" class="py-16 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <span class="bg-primary-50 text-primary border border-primary-200 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
            Процесс доставки
          </span>
          <h2 class="text-3xl font-extrabold text-gray-900 mt-3 mb-2">{{ $t('home.howItWorksTitle') }}</h2>
          <p class="text-gray-500">Всего 5 простых шагов от покупки до получения</p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-5 gap-6">
          <div v-for="(step, index) in stepsDetailed" :key="index"
            class="card p-6 bg-white border border-gray-100 shadow-sm rounded-2xl flex flex-col justify-between hover:shadow-md transition-all">
            <div>
              <div class="w-12 h-12 rounded-2xl bg-primary text-white font-black text-lg flex items-center justify-center shadow-md mb-4">
                {{ index + 1 }}
              </div>
              <h3 class="font-bold text-gray-900 mb-2">{{ step.title }}</h3>
              <p class="text-xs text-gray-500 leading-relaxed">{{ step.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Interactive Calculator -->
    <section id="calculator" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-12">
        <span class="bg-primary-50 text-primary border border-primary-200 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
          Калькулятор
        </span>
        <h2 class="text-3xl font-extrabold text-gray-900 mt-3 mb-2">Рассчитать стоимость посылки</h2>
        <p class="text-gray-500 max-w-xl mx-auto">Узнайте стоимость доставки обычного груза или фиксированные тарифы на электронику онлайн</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Form -->
        <div class="card p-8 border border-gray-100 shadow-sm rounded-3xl lg:col-span-2">
          <form @submit.prevent="calculate" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="form-group">
                <label class="form-label font-bold text-gray-800 mb-1.5">Страна отправления</label>
                <select v-model="calcForm.country" class="input-field" required>
                  <option value="">-- Выберите страну --</option>
                  <option v-for="tariff in tariffsList" :key="tariff.id" :value="tariff.country.toLowerCase()">
                    {{ tariff.country }} ({{ tariff.delivery_time || 'срок уточняется' }})
                  </option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label font-bold text-gray-800 mb-1.5">Тип груза</label>
                <select v-model="calcForm.cargo_type" class="input-field" required>
                  <option value="regular">Обычный груз (расчет по весу)</option>
                  <option value="tech">Электроника / Техника (фикс. тариф)</option>
                </select>
              </div>
            </div>

            <!-- Tech Device Selection -->
            <div class="form-group" v-if="calcForm.cargo_type === 'tech'">
              <label class="form-label font-bold text-gray-800 mb-1.5">Выберите устройство</label>
              <select v-model="calcForm.tech_type" class="input-field" required>
                <option value="">-- Выберите тип электроники --</option>
                <option v-for="tech in techTariffs" :key="tech.type" :value="tech.type">
                  {{ tech.name }}{{ tech.sub ? ` (${tech.sub})` : '' }} — {{ tech.price }}
                </option>
              </select>
            </div>

            <!-- Weight -->
            <div class="form-group" v-if="calcForm.cargo_type === 'regular' || calcForm.tech_type === 'ps5_xbox'">
              <label class="form-label font-bold text-gray-800 mb-1.5">Вес посылки (кг)</label>
              <div class="relative">
                <input v-model.number="calcForm.weight" type="number" min="0.1" step="0.1" required
                  class="input-field pr-12" placeholder="0.0" />
                <span class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-semibold">кг</span>
              </div>
            </div>

            <!-- Declared value -->
            <div class="form-group">
              <label class="form-label font-bold text-gray-800 mb-1.5">Объявленная стоимость (USD)</label>
              <div class="relative">
                <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                <input v-model.number="calcForm.declared_value" type="number" min="0" step="0.01"
                  class="input-field pl-7" placeholder="0.00" />
              </div>
            </div>

            <!-- Additional services -->
            <div class="form-group">
              <label class="form-label font-bold text-gray-800 mb-3">Дополнительные услуги</label>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <label v-for="service in availableServices" :key="service.id"
                  class="flex items-center gap-3 p-3 border border-gray-150 rounded-2xl cursor-pointer hover:border-primary hover:bg-primary-50 transition-all"
                  :class="{ 'border-primary bg-primary-50': isServiceSelected(service.id) }">
                  <input type="checkbox" :value="service.id" v-model="calcForm.services"
                    class="rounded border-gray-300 text-primary" />
                  <div class="flex-1">
                    <p class="text-xs font-bold text-gray-800 leading-tight">{{ service.name }}</p>
                    <p class="text-[10px] text-gray-400 mt-0.5 leading-tight">{{ service.description }}</p>
                  </div>
                  <span class="text-xs font-bold text-primary">
                    {{ service.price_type === 'percentage' ? service.percentage + '%' : '$' + service.price }}
                  </span>
                </label>
              </div>
            </div>

            <button type="submit" :disabled="!calcForm.country || (calcForm.cargo_type === 'regular' && !calcForm.weight) || calcLoading"
              class="btn btn-primary w-full btn-lg font-bold">
              <svg v-if="calcLoading" class="animate-spin w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              Рассчитать стоимость
            </button>
          </form>
        </div>

        <!-- Results panel -->
        <div class="space-y-6">
          <div v-if="calcResult" class="card p-8 border border-primary-100 bg-primary-50 bg-opacity-20 rounded-3xl">
            <h3 class="text-xl font-bold text-gray-900 mb-6">Результат расчёта</h3>
            
            <div class="flex items-center gap-2 mb-6 p-3 bg-white rounded-2xl border border-primary-50">
              <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <div>
                <p class="text-[10px] text-gray-400">Срок доставки авиа</p>
                <p class="font-bold text-primary text-sm">{{ calcResult.delivery_time }}</p>
              </div>
            </div>

            <div v-if="calcForm.cargo_type === 'tech' && calcForm.tech_type === 'ps5_xbox'" class="mb-4 p-3 bg-yellow-50 text-yellow-800 text-[10px] rounded-xl border border-yellow-100">
              Тариф на игровые консоли PlayStation 5 / Xbox Series X рассчитывается по весу либо отдельно согласуется с менеджером.
            </div>

            <div class="space-y-3 mb-6">
              <div class="flex justify-between items-center py-2 border-b border-gray-100">
                <span class="text-xs text-gray-600">Стоимость доставки</span>
                <span class="font-bold text-gray-900">${{ calcResult.delivery_cost?.toFixed(2) }}</span>
              </div>
              <div v-if="calcResult.insurance_cost > 0"
                class="flex justify-between items-center py-2 border-b border-gray-100">
                <span class="text-xs text-gray-600">Страхование груза (2%)</span>
                <span class="font-bold text-gray-900">${{ calcResult.insurance_cost?.toFixed(2) }}</span>
              </div>
              <div v-if="calcResult.services_cost > 0"
                class="flex justify-between items-center py-2 border-b border-gray-100">
                <span class="text-xs text-gray-600">Выбранные доп. услуги</span>
                <span class="font-bold text-gray-900">${{ calcResult.services_cost?.toFixed(2) }}</span>
              </div>
              <div class="flex justify-between items-center py-3 bg-white border border-primary-100 rounded-2xl px-4 mt-2">
                <span class="font-bold text-gray-900">Итого к оплате</span>
                <span class="font-black text-2xl text-primary">${{ calcResult.total?.toFixed(2) }}</span>
              </div>
            </div>

            <RouterLink to="/register" class="btn btn-primary w-full justify-center text-center no-underline font-bold">
              Оформить посылку
            </RouterLink>
          </div>

          <div v-else class="card p-8 border border-gray-100 shadow-sm rounded-3xl text-center py-12 flex flex-col justify-center items-center h-64">
            <span class="text-4xl block mb-3">🧮</span>
            <p class="text-gray-500 text-sm">Заполните параметры посылки слева и нажмите «Рассчитать стоимость»</p>
          </div>

          <!-- Weight tariff set summary -->
          <div class="card p-6 border border-gray-100 shadow-sm rounded-3xl">
            <h3 class="font-bold text-gray-900 mb-4 text-sm">Сетка тарифов (за 1 кг)</h3>
            <div class="space-y-2 text-xs">
              <div class="flex items-center justify-between p-2.5 bg-gray-50 rounded-xl">
                <span class="font-semibold text-gray-800">До 100 кг</span>
                <span class="font-bold text-primary">${{ selectedCalcTariff?.price_per_kg || '—' }}/кг</span>
              </div>
              <div class="flex items-center justify-between p-2.5 bg-gray-50 rounded-xl">
                <span class="font-semibold text-gray-800">От 100 кг</span>
                <span class="font-bold text-primary">${{ selectedCalcTariff ? Math.max(1, selectedCalcTariff.price_per_kg - 1) : '—' }}/кг</span>
              </div>
              <div class="flex items-center justify-between p-2.5 bg-gray-50 rounded-xl">
                <span class="font-semibold text-gray-800">От 1000 кг</span>
                <span class="font-bold text-primary">${{ selectedCalcTariff ? Math.max(1, selectedCalcTariff.price_per_kg - 5) : '—' }}/кг</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Detailed Pricing Section -->
    <section id="pricing" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-12">
        <span class="bg-primary-50 text-primary border border-primary-200 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
          Цены и оплата с 16 апреля 2026
        </span>
        <h2 class="text-3xl font-extrabold text-gray-900 mt-3 mb-2">Наши тарифы на технику и правила карго</h2>
        <p class="text-gray-500 max-w-xl mx-auto">Фиксированные ставки на доставку электроники и правила замера веса</p>
      </div>

      <!-- Tech fixed tariffs -->
      <div class="mb-12">
        <h3 class="text-lg font-extrabold text-gray-900 mb-6">📱 Фиксированная стоимость на электронику и гаджеты</h3>
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <div v-for="tech in techTariffs" :key="tech.name" 
            class="bg-white p-5 rounded-2xl border border-gray-100 hover:border-primary-300 hover:shadow-sm transition-all flex flex-col justify-between text-center">
            <div>
              <span class="text-3xl block mb-2">{{ tech.icon }}</span>
              <h4 class="font-bold text-gray-800 text-xs leading-tight mb-1">{{ tech.name }}</h4>
              <p class="text-[10px] text-gray-400 leading-tight" v-if="tech.sub">{{ tech.sub }}</p>
            </div>
            <div class="mt-4">
              <span class="text-lg font-black text-primary">{{ tech.price }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Rules and payment method cards -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="card p-6 border border-gray-100 rounded-3xl shadow-sm">
          <div class="flex items-center gap-3 mb-4">
            <span class="text-3xl">⚖️</span>
            <h4 class="font-bold text-gray-900">Округление веса</h4>
          </div>
          <p class="text-xs text-gray-500 leading-relaxed mb-2">
            • Вес <strong>до 1 кг</strong> округляется в большую сторону до 1 кг (например, 0.3 кг считается как 1 кг — ${{ activeBaseRate }}/кг).
          </p>
          <p class="text-xs text-gray-500 leading-relaxed">
            • Для посылок весом <strong>от 1 кг и более</strong> расчет ведется по точному фактическому весу (например, 1.3 кг или 2.7 кг).
          </p>
        </div>

        <div class="card p-6 border border-gray-100 rounded-3xl shadow-sm">
          <div class="flex items-center gap-3 mb-4">
            <span class="text-3xl">📦</span>
            <h4 class="font-bold text-gray-900">Объемный вес</h4>
          </div>
          <p class="text-xs text-gray-500 leading-relaxed mb-3">
            Крупногабаритные посылки, у которых объем превышает фактический вес, рассчитываются по объему. К ним относятся:
          </p>
          <div class="grid grid-cols-2 gap-2 text-[10px] text-gray-600 font-semibold">
            <div>📺 Телевизоры</div>
            <div>🧼 Стиральные машины</div>
            <div>🎹 Пианино и муз. хабы</div>
            <div>🏋️ Большие тренажеры</div>
          </div>
        </div>

        <div class="card p-6 border border-gray-100 rounded-3xl shadow-sm bg-gray-50 border-dashed">
          <div class="flex items-center gap-3 mb-4">
            <span class="text-3xl">💳</span>
            <h4 class="font-bold text-gray-900">Способы оплаты</h4>
          </div>
          <ul class="space-y-2 text-xs text-gray-600">
            <li class="flex items-center gap-2">
              <span class="text-primary font-bold">✔</span> Наличными при получении (в Душанбе)
            </li>
            <li class="flex items-center gap-2">
              <span class="text-primary font-bold">✔</span> Банковский перевод (по согласованию)
            </li>
            <li class="flex items-center gap-2">
              <span class="text-primary font-bold">✔</span> Zelle / CashApp (для клиентов из США)
            </li>
          </ul>
        </div>
      </div>
    </section>

    <!-- FAQ Section -->
    <section id="faq" class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-12">
        <span class="bg-primary-50 text-primary border border-primary-200 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
          Частые вопросы
        </span>
        <h2 class="text-3xl font-extrabold text-gray-900 mt-3 mb-2">{{ $t('nav.faq') }}</h2>
        <p class="text-gray-500">Ответы на популярные вопросы о доставке и тарифах</p>
      </div>

      <div class="space-y-3">
        <div v-for="(item, index) in faqs" :key="index"
          class="card border border-gray-100 hover:border-primary-100 transition-all cursor-pointer p-5 rounded-2xl shadow-sm"
          @click="toggleFaq(index)">
          <div class="flex items-center justify-between">
            <h3 class="font-bold text-gray-900 text-base pr-4">{{ item.q }}</h3>
            <svg class="w-5 h-5 text-gray-400 flex-shrink-0 transition-transform"
              :class="{ 'rotate-180': faqOpenIndex === index }"
              fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
            </svg>
          </div>
          <transition name="slide-up">
            <p v-if="faqOpenIndex === index" class="mt-3 text-gray-600 text-sm leading-relaxed border-t border-gray-100 pt-3">
              {{ item.a }}
            </p>
          </transition>
        </div>
      </div>
    </section>

    <!-- Quick Track -->
    <section id="tracking" class="py-16 bg-gray-50">
      <div class="max-w-2xl mx-auto px-4 text-center">
        <span class="bg-primary-50 text-primary border border-primary-200 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
          Проверить статус
        </span>
        <h2 class="text-2xl font-bold text-gray-900 mt-3 mb-3">{{ $t('publicTracking.title') }}</h2>
        <p class="text-gray-500 mb-6">{{ $t('publicTracking.subtitle') }}</p>
        <div class="flex gap-3">
          <input
            v-model="trackingInput"
            type="text"
            :placeholder="$t('publicTracking.placeholder')"
            class="input-field flex-1 text-base shadow-sm"
            @keyup.enter="goToTracking"
          />
          <button @click="goToTracking"
            class="btn btn-primary btn-lg flex-shrink-0 font-bold shadow-md">
            {{ $t('publicTracking.trackBtn') }}
          </button>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="py-16 lg:py-24 bg-gradient-to-r from-primary-700 to-primary text-white">
      <div class="max-w-4xl mx-auto px-4 text-center">
        <h2 class="text-3xl lg:text-4xl font-bold mb-4">{{ $t('home.ctaTitle') }}</h2>
        <p class="text-blue-100 text-lg mb-8">{{ $t('home.ctaDesc') }}</p>
        <RouterLink to="/register"
          class="btn btn-lg bg-white text-primary hover:bg-blue-50 font-bold no-underline shadow-lg inline-flex">
          {{ $t('home.ctaBtn') }}
        </RouterLink>
      </div>
    </section>
  </div>
</template>

<script>
import { tariffsAPI } from '@/api/index.js'

export default {
  name: 'HomePage',

  data() {
    return {
      trackingInput: '',
      tariffsList: [],
      faqOpenIndex: null,
      faqs: [
        { q: 'Как узнать адрес склада в США?', a: 'Адреса наших складов приема в США указаны в личном кабинете. Для интернет-покупок используйте безналоговый склад в штате Делавэр: 1680 Porter Rd, Suite A-3, Bear, DE 19701, указав свой ID клиента.' },
        { q: 'Как долго идёт посылка?', a: 'Доставка из США занимает 6-10 рабочих дней, из Германии, Испании и Италии — 7-14 рабочих дней. Сроки зависят от расписания авиарейсов и скорости таможенного оформления.' },
        { q: 'Как отследить посылку?', a: 'Вы можете ввести трек-номер на странице отслеживания или отслеживать все свои посылки в личном кабинете после регистрации.' },
        { q: 'Что нельзя отправлять?', a: 'Запрещены оружие, боеприпасы, лекарства без рецепта, опасные жидкости, литиевые аккумуляторы отдельно от приборов, алкоголь и табачные изделия. Полный список смотрите на странице Условий.' },
        { q: 'Есть ли страхование?', a: 'Да, ваши посылки можно застраховать. Подробности уточняйте у службы поддержки.' }
      ]
    }
  },

  computed: {
    directionsPricing() {
      return this.tariffsList.map((tariff) => {
        const basePrice = parseFloat(tariff.price_per_kg) || 0
        return {
          country: tariff.country,
          flag: this.countryFlag(tariff.country),
          time: tariff.delivery_time || '5-10 раб. дней',
          price: `$${basePrice}`,
          note: `Минимальная стоимость — $${tariff.minimum_charge || 0}.`
        }
      })
    },
    techTariffs() {
      const tariff = this.tariffsList.find((item) => {
        const country = item.country.toLowerCase()
        return country.includes('usa') || country.includes('сша')
      }) || this.tariffsList[0]
      const defaults = {
        macbook: 100,
        laptop: 100,
        iphone: 100,
        watch: 30,
        ipad: 70,
        airpods: 20,
        meta_glasses: 20,
        airpods_max: 25,
        ebook: 15
      }
      const rates = tariff?.tech_rates && typeof tariff.tech_rates === 'object'
        ? { ...defaults, ...tariff.tech_rates }
        : defaults
      return [
        { icon: '💻', name: 'MacBook', sub: 'меньше 3кг', price: `$${rates.macbook}` },
        { icon: '💻', name: 'Ноутбук', sub: 'меньше 3кг', price: `$${rates.laptop}` },
        { icon: '📱', name: 'iPhone', price: `$${rates.iphone}` },
        { icon: '⌚', name: 'Apple / Smart Watch', price: `$${rates.watch}` },
        { icon: '📟', name: 'iPad', price: `$${rates.ipad}` },
        { icon: '🎧', name: 'AirPods', price: `$${rates.airpods}` },
        { icon: '🕶️', name: 'Meta Очки', price: `$${rates.meta_glasses}` },
        { icon: '🎧', name: 'AirPods Max', price: `$${rates.airpods_max}` },
        { icon: '📖', name: 'E-book', price: `$${rates.ebook}` },
        { icon: '🎮', name: 'PlayStation 5 / Xbox', sub: 'по согласованию', price: 'по весу' }
      ]
    },
    activeBaseRate() {
      const tariff = this.tariffsList.find((item) => {
        const country = item.country.toLowerCase()
        return country.includes('usa') || country.includes('сша')
      }) || this.tariffsList[0]
      return tariff ? parseFloat(tariff.price_per_kg) : 16
    },
    kazakhstanTariff() {
      return this.tariffsList.find((item) => {
        const country = item.country.toLowerCase()
        return country.includes('kazakhstan') || country.includes('казахстан')
      })
    },
    stats() {
      return [
        { value: '10,000+', label: 'Довольных клиентов' },
        { value: '50,000+', label: 'Доставленных посылок' },
        { value: '99.5%', label: 'Своевременная доставка' },
        { value: '2 года', label: 'Опыта работы' }
      ]
    },
    stepsDetailed() {
      return [
        { title: 'Регистрация', desc: 'Создайте бесплатный аккаунт и получите персональный ID клиента и адреса складов в США, Германии, Испании и Италии.' },
        { title: 'Покупка товаров', desc: 'Делайте заказы в любых магазинах. При заказе указывайте адрес нашего склада как адрес доставки.' },
        { title: 'Добавление трека', desc: 'После отгрузки добавьте трек-код в личном кабинете. Укажите получателя, описание товара и ссылку.' },
        { title: 'Прием посылки', desc: 'Наши сотрудники взвешивают, фотографируют и упаковывают груз на зарубежных складах.' },
        { title: 'Получение', desc: 'Груз отправляется авиарейсом. Вы получаете уведомление о прибытии и забираете посылку.' }
      ]
    }
  },

  methods: {
    countryFlag(country) {
      const value = country.toLowerCase()
      if (value.includes('usa') || value.includes('сша')) return '🇺🇸'
      if (value.includes('germany') || value.includes('германи')) return '🇩🇪'
      if (value.includes('uk') || value.includes('англия') || value.includes('великобрита')) return '🇬🇧'
      if (value.includes('spain') || value.includes('испани')) return '🇪🇸'
      if (value.includes('italy') || value.includes('итали')) return '🇮🇹'
      if (value.includes('kazakhstan') || value.includes('казахстан')) return '🇰🇿'
      return '🌍'
    },
    scrollDirections(dir) {
      const container = this.$refs.directionsScroll;
      if (!container) return;
      const scrollAmount = 300;
      if (dir === 'left') {
        container.scrollLeft -= scrollAmount;
      } else {
        container.scrollLeft += scrollAmount;
      }
    },
    goToTracking() {
      if (this.trackingInput.trim()) {
        this.$router.push({ name: 'tracking', query: { q: this.trackingInput.trim() } })
      } else {
        this.$router.push({ name: 'tracking' })
      }
    },
    toggleFaq(index) {
      this.faqOpenIndex = this.faqOpenIndex === index ? null : index
    }
  },

  async mounted() {
    try {
      const response = await tariffsAPI.getPublic()
      this.tariffsList = response.data?.data || response.data || []
    } catch (error) {
      console.error('Failed to load tariffs on homepage:', error)
    }
  }
}
</script>
