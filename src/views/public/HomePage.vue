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
            <a href="#calculator"
              class="btn btn-lg border-2 border-white text-white hover:bg-white hover:text-primary font-semibold no-underline transition-all">
              {{ $t('home.calculateBtn') }}
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
        <p class="text-gray-500 max-w-xl mx-auto">Надёжный партнёр для международной доставки грузов с 2015 года</p>
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

        <div class="card p-8 border border-gray-100 shadow-sm rounded-3xl">
          <div class="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center mb-4 text-2xl">
            🌍
          </div>
          <h3 class="text-2xl font-bold text-gray-900 mb-4">Наши направления</h3>
          <p class="text-gray-600 mb-6">Мы летаем еженедельно из крупнейших сортировочных хабов США и Европы напрямую в Душанбе и Худжанд:</p>
          <div class="space-y-4">
            <div class="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-all">
              <div class="flex items-center gap-3">
                <span class="text-3xl">🇺🇸</span>
                <div>
                  <p class="font-bold text-gray-900 text-base">США → Таджикистан</p>
                  <p class="text-xs text-gray-500">Доставка самолетом из Нью-Йорка, Делавэра и Филадельфии</p>
                </div>
              </div>
              <span class="bg-blue-100 text-primary text-xs font-bold px-3 py-1 rounded-full">6-10 дней</span>
            </div>

            <div class="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-all">
              <div class="flex items-center gap-3">
                <span class="text-3xl">🇩🇪</span>
                <div>
                  <p class="font-bold text-gray-900 text-base">Германия (Европа) → Таджикистан</p>
                  <p class="text-xs text-gray-500">Доставка через наш хаб в Мюнхене</p>
                </div>
              </div>
              <span class="bg-blue-100 text-primary text-xs font-bold px-3 py-1 rounded-full">7-14 дней</span>
            </div>

            <div class="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-all">
              <div class="flex items-center gap-3">
                <span class="text-3xl">🇪🇸</span>
                <div>
                  <p class="font-bold text-gray-900 text-base">Испания (Европа) → Таджикистан</p>
                  <p class="text-xs text-gray-500">Экспресс-доставка из Испании транзитом через Европу</p>
                </div>
              </div>
              <span class="bg-blue-100 text-primary text-xs font-bold px-3 py-1 rounded-full">7-14 дней</span>
            </div>

            <div class="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-all">
              <div class="flex items-center gap-3">
                <span class="text-3xl">🇮🇹</span>
                <div>
                  <p class="font-bold text-gray-900 text-base">Италия (Европа) → Таджикистан</p>
                  <p class="text-xs text-gray-500">Сборные грузы из Италии напрямую в Таджикистан</p>
                </div>
              </div>
              <span class="bg-blue-100 text-primary text-xs font-bold px-3 py-1 rounded-full">7-14 дней</span>
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
                  <option value="usa">США (6-10 дней)</option>
                  <option value="germany">Европа - Германия (7-14 дней)</option>
                  <option value="spain">Европа - Испания (7-14 дней)</option>
                  <option value="italy">Европа - Италия (7-14 дней)</option>
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
                <option value="macbook">MacBook (меньше 3кг) — $100</option>
                <option value="laptop">Ноутбук (меньше 3кг) — $100</option>
                <option value="iphone">iPhone — $100</option>
                <option value="watch">Apple Watch / Smart Watch — $30</option>
                <option value="ipad">iPad — $70</option>
                <option value="airpods">AirPods — $20</option>
                <option value="meta_glasses">Meta Очки — $20</option>
                <option value="airpods_max">AirPods Max — $25</option>
                <option value="ebook">E-book — $15</option>
                <option value="ps5_xbox">PlayStation 5 / Xbox Series X — по весу</option>
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
                <span class="font-bold text-primary">$16/кг</span>
              </div>
              <div class="flex items-center justify-between p-2.5 bg-gray-50 rounded-xl">
                <span class="font-semibold text-gray-800">От 100 кг</span>
                <span class="font-bold text-primary">$15/кг</span>
              </div>
              <div class="flex items-center justify-between p-2.5 bg-gray-50 rounded-xl">
                <span class="font-semibold text-gray-800">От 1000 кг</span>
                <span class="font-bold text-primary">$11/кг</span>
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
            • Вес <strong>до 1 кг</strong> округляется в большую сторону до 1 кг (например, 0.3 кг считается как 1 кг — $16).
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
import { calculatorAPI, servicesAPI } from '@/api/index.js'

export default {
  name: 'HomePage',

  data() {
    return {
      trackingInput: '',
      calcLoading: false,
      calcResult: null,
      calcForm: {
        country: '',
        cargo_type: 'regular',
        tech_type: '',
        weight: '',
        declared_value: 0,
        services: []
      },
      availableServices: [
        { id: 'insurance', name: 'Страхование', description: 'Страховка (2% от стоимости)', price: 0, percentage: 2, price_type: 'percentage' },
        { id: 'f8b65003-8d46-4ab5-8e46-db4e4e1b6789', name: 'Осмотр товара', description: 'Проверка содержимого', price: 5, price_type: 'fixed' },
        { id: 'fa976004-9e57-4c06-8f57-eb5e5e2c7890', name: 'Проверка работоспособности', description: 'Проверка работоспособности приборов', price: 10, price_type: 'fixed' },
        { id: '11111111-2222-3333-4444-555555555555', name: 'Сделать фото', description: 'Детальные фото товаров', price: 2, price_type: 'fixed' },
        { id: '22222222-3333-4444-5555-666666666666', name: 'Дополнительная упаковка', description: 'Безопасная защитная упаковка', price: 2, price_type: 'fixed' }
      ],
      techTariffs: [
        { icon: '💻', name: 'MacBook', sub: 'меньше 3кг', price: '$100' },
        { icon: '💻', name: 'Ноутбук', sub: 'меньше 3кг', price: '$100' },
        { icon: '📱', name: 'iPhone', price: '$100' },
        { icon: '⌚', name: 'Apple / Smart Watch', price: '$30' },
        { icon: '📟', name: 'iPad', price: '$70' },
        { icon: '🎧', name: 'AirPods', price: '$20' },
        { icon: '🕶️', name: 'Meta Очки', price: '$20' },
        { icon: '🎧', name: 'AirPods Max', price: '$25' },
        { icon: '📖', name: 'E-book', price: '$15' },
        { icon: '🎮', name: 'PlayStation 5 / Xbox', sub: 'по согласованию', price: 'по весу' }
      ],
      faqOpenIndex: null,
      faqs: [
        { q: 'Как узнать адрес склада в США?', a: 'Адреса наших складов приема в США указаны в личном кабинете. Для интернет-покупок используйте безналоговый склад в штате Делавэр: 1680 Porter Rd, Suite A-3, Bear, DE 19701, указав свой ID клиента.' },
        { q: 'Сколько стоит доставка?', a: 'Стоимость доставки обычного груза по весу составляет: до 100 кг – $16/кг, от 100 кг – $15/кг, от 1000 кг – $11/кг. Для техники действуют фиксированные тарифы (например, MacBook/ноутбуки/iPhone – $100, iPad – $70, AirPods – $20, часы – $30).' },
        { q: 'Как долго идёт посылка?', a: 'Доставка из США занимает 6-10 рабочих дней, из Германии, Испании и Италии — 7-14 рабочих дней. Сроки зависят от расписания авиарейсов и скорости таможенного оформления.' },
        { q: 'Как рассчитывается вес и округление?', a: 'Вес до 1 кг округляется до 1 кг (например, 0.4 кг рассчитывается как 1 кг). Если вес составляет 1.0 кг и выше (например, 1.2 кг или 2.8 кг), расчет ведется строго по фактическому весу.' },
        { q: 'Как отследить посылку?', a: 'Вы можете ввести трек-номер на странице отслеживания или отслеживать все свои посылки в личном кабинете после регистрации.' },
        { q: 'Что нельзя отправлять?', a: 'Запрещены оружие, боеприпасы, лекарства без рецепта, опасные жидкости, литиевые аккумуляторы отдельно от приборов, алкоголь и табачные изделия. Полный список смотрите на странице Условий.' },
        { q: 'Есть ли страхование?', a: 'Да, вы можете застраховать вашу посылку. Стоимость страховки составляет 2% от объявленной ценности товара. Это гарантирует возмещение в случае утери груза.' }
      ]
    }
  },

  computed: {
    stats() {
      return [
        { value: '10,000+', label: 'Довольных клиентов' },
        { value: '50,000+', label: 'Доставленных посылок' },
        { value: '99.5%', label: 'Своевременная доставка' },
        { value: '9 лет', label: 'Опыта работы' }
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
    goToTracking() {
      if (this.trackingInput.trim()) {
        this.$router.push({ name: 'tracking', query: { q: this.trackingInput.trim() } })
      } else {
        this.$router.push({ name: 'tracking' })
      }
    },
    toggleFaq(index) {
      this.faqOpenIndex = this.faqOpenIndex === index ? null : index
    },
    isServiceSelected(id) {
      return this.calcForm.services.includes(id)
    },
    async calculate() {
      this.calcLoading = true
      try {
        const response = await calculatorAPI.calculate({
          country: this.calcForm.country,
          weight: this.calcForm.cargo_type === 'tech' && this.calcForm.tech_type !== 'ps5_xbox' ? 1.0 : this.calcForm.weight,
          declared_value: this.calcForm.declared_value,
          service_ids: this.calcForm.services,
          item_type: this.calcForm.cargo_type === 'tech' ? this.calcForm.tech_type : 'regular'
        })
        
        const backendData = response.data?.data || response.data
        if (backendData) {
          this.calcResult = {
            delivery_cost: backendData.delivery_cost,
            insurance_cost: backendData.services?.find(s => s.name?.toLowerCase().includes('insurance') || s.service_id === 'insurance')?.cost || 0,
            services_cost: backendData.services?.filter(s => !s.name?.toLowerCase().includes('insurance') && s.service_id !== 'insurance').reduce((sum, s) => sum + s.cost, 0) || backendData.services_cost,
            total: backendData.total_cost || backendData.total,
            delivery_time: backendData.tariff?.delivery_time || ((this.calcForm.country === 'germany' || this.calcForm.country === 'spain' || this.calcForm.country === 'italy') ? '7-14 дней' : '6-10 дней')
          }
        } else {
          this.calcResult = this.calculateLocally()
        }
      } catch (err) {
        console.warn('API error, falling back to local calculation:', err)
        this.calcResult = this.calculateLocally()
      } finally {
        this.calcLoading = false
      }
    },

    calculateLocally() {
      const weightVal = parseFloat(this.calcForm.weight || 0)
      let baseCost = 0

      const techRates = {
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

      const isTechItem = this.calcForm.cargo_type === 'tech' && this.calcForm.tech_type !== 'ps5_xbox'
      if (isTechItem && techRates[this.calcForm.tech_type]) {
        baseCost = techRates[this.calcForm.tech_type]
      } else {
        const calculatedWeight = weightVal < 1.0 ? 1.0 : weightVal
        let rate = 16
        if (calculatedWeight >= 1000) {
          rate = 11
        } else if (calculatedWeight >= 100) {
          rate = 15
        }
        baseCost = calculatedWeight * rate
      }

      const isInsurance = this.calcForm.services.includes('insurance')
      const insuranceCost = isInsurance ? (this.calcForm.declared_value || 0) * 0.02 : 0

      const servicesCost = this.availableServices
        .filter(s => this.calcForm.services.includes(s.id) && s.id !== 'insurance')
        .reduce((sum, s) => sum + (parseFloat(s.price) || 0), 0)

      return {
        delivery_cost: baseCost,
        insurance_cost: insuranceCost,
        services_cost: servicesCost,
        total: baseCost + insuranceCost + servicesCost,
        delivery_time: (this.calcForm.country === 'germany' || this.calcForm.country === 'spain' || this.calcForm.country === 'italy') ? '7-14 дней' : '6-10 дней'
      }
    }
  },

  mounted() {
    servicesAPI.getAll().then(r => {
      const fetched = r.data?.data || r.data || []
      if (fetched.length > 0) {
        this.availableServices = fetched.map(fs => {
          const isIns = fs.name?.toLowerCase().includes('insurance') || fs.price_type === 'percentage'
          return {
            id: fs.id,
            name: fs.name,
            description: fs.description || (isIns ? 'Страховка (2% от стоимости)' : ''),
            price: parseFloat(fs.price) || 0,
            percentage: parseFloat(fs.percentage) || 2,
            price_type: fs.price_type
          }
        })
      }
    }).catch(err => {
      console.warn('Failed to load services in landing page, using defaults:', err)
    })
  }
}
</script>
