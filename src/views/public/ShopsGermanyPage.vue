<template>
  <div class="py-12 bg-gradient-to-b from-gray-50 to-white min-h-screen">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="text-center max-w-3xl mx-auto mb-12">
        <span class="text-xs font-bold uppercase tracking-wider bg-yellow-50 text-amber-700 px-3 py-1 rounded-full border border-yellow-200">🇩🇪 Покупки в Германии</span>
        <h1 class="text-4xl font-extrabold text-gray-900 sm:text-5xl mt-3 tracking-tight">
          Гид по магазинам Германии
        </h1>
        <p class="mt-4 text-lg text-gray-500">
          Заказывайте оригинальные товары из немецких и европейских интернет-магазинов, включая качественные автозапчасти.
        </p>
      </div>

      <!-- Main Layout: Sidebar Filters + Shop Grid -->
      <div class="flex flex-col lg:flex-row gap-8">
        <!-- Sidebar Filter -->
        <div class="w-full lg:w-64 flex-shrink-0">
          <div class="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm sticky top-24">
            <!-- Search bar -->
            <div class="relative mb-5">
              <span class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg class="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input v-model="searchQuery" type="text" placeholder="Поиск магазина..."
                class="block w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary" />
            </div>

            <!-- Categories -->
            <h3 class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-1">Категории</h3>
            <div class="space-y-1">
              <button v-for="cat in categories" :key="cat.value" @click="activeCategory = cat.value"
                :class="[
                  'w-full text-left px-3 py-2 text-sm font-medium rounded-xl transition-all duration-200 flex items-center justify-between',
                  activeCategory === cat.value
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                ]">
                <span>{{ cat.label }}</span>
                <span class="text-xs opacity-60">({{ getCount(cat.value) }})</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Shop Grid -->
        <div class="flex-1">
          <!-- Idealo Highlight Banner -->
          <div class="bg-gradient-to-r from-amber-500 to-amber-600 rounded-3xl p-6 text-white mb-8 shadow-md relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h4 class="text-lg font-bold">💡 Лайфхак для Германии: Idealo.de</h4>
              <p class="text-xs text-amber-100 leading-relaxed mt-1">
                Используйте лучший сервис сравнения цен <strong>Idealo Germany</strong>. Он показывает цены в десятках магазинов — например, миксер KitchenAid Artisan часто можно найти от €340–430 вместо полной цены!
              </p>
            </div>
            <a href="https://www.idealo.de" target="_blank" rel="noopener noreferrer"
              class="btn btn-primary bg-white text-amber-700 hover:bg-amber-50 shadow-sm border-none font-bold text-xs py-2 px-4 rounded-xl shrink-0 no-underline">
              Открыть Idealo 🔗
            </a>
          </div>

          <div v-if="filteredShops.length === 0" class="card text-center py-16">
            <span class="text-4xl mb-4 block">🔍</span>
            <h3 class="text-lg font-semibold text-gray-800">Магазины не найдены</h3>
            <p class="text-gray-400 text-sm mt-1">Попробуйте изменить поисковый запрос.</p>
          </div>

          <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <div v-for="shop in filteredShops" :key="shop.name"
              class="bg-white rounded-2xl border border-gray-150 p-6 hover:shadow-md hover:border-primary-300 transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div class="flex items-start justify-between mb-4">
                  <span class="text-3xl">{{ shop.emoji }}</span>
                  <span class="text-[10px] font-semibold text-primary bg-primary-50 px-2 py-0.5 rounded-full uppercase tracking-wider">
                    {{ getCategoryLabel(shop.category) }}
                  </span>
                </div>
                <h3 class="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors duration-200">
                  {{ shop.name }}
                </h3>
                <p class="text-xs text-gray-500 leading-relaxed mt-2" v-if="shop.description">
                  {{ shop.description }}
                </p>
                <div class="mt-3 flex flex-wrap gap-1.5" v-if="shop.brands && shop.brands.length > 0">
                  <span v-for="brand in shop.brands" :key="brand"
                    class="text-[10px] bg-gray-50 text-gray-500 border border-gray-100 px-2 py-0.5 rounded">
                    {{ brand }}
                  </span>
                </div>
              </div>
              <div class="mt-6 pt-4 border-t border-gray-50">
                <a :href="shop.url" target="_blank" rel="noopener noreferrer"
                  class="btn btn-outline btn-sm w-full no-underline hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-1">
                  <span>Перейти на сайт</span>
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ShopsGermanyPage',
  data() {
    return {
      searchQuery: '',
      activeCategory: 'all',
      categories: [
        { value: 'all', label: 'Все магазины' },
        { value: 'general', label: 'Универсальные' },
        { value: 'dyson', label: 'Оборудование Dyson' },
        { value: 'coffee', label: 'Кофемашины' },
        { value: 'kitchen', label: 'Кухонная техника' },
        { value: 'cosmetics', label: 'Косметика' },
        { value: 'pharmacy', label: 'Аптеки' },
        { value: 'fashion', label: 'Одежда и обувь' },
        { value: 'luxury', label: 'Люкс бренды' },
        { value: 'watches', label: 'Часы' },
        { value: 'kids', label: 'Детские товары' },
        { value: 'autoparts_used', label: 'Б/у автозапчасти' },
        { value: 'autoparts_new', label: 'Новые автозапчасти' }
      ],
      shops: [
        // Универсальные
        { name: 'Amazon Germany', category: 'general', emoji: '🛍️', url: 'https://www.amazon.de', description: 'Немецкий филиал крупнейшего маркетплейса. Главная точка входа для покупок по всей Европе.' },
        { name: 'MediaMarkt', category: 'general', emoji: '💻', url: 'https://www.mediamarkt.de', description: 'Крупнейший ритейлер электроники и бытовой техники в Европе.' },
        { name: 'Saturn', category: 'general', emoji: '🔌', url: 'https://www.saturn.de', description: 'Популярная немецкая сеть электроники, мультимедиа и гаджетов.' },
        { name: 'Galaxus Germany', category: 'general', emoji: '🛒', url: 'https://www.galaxus.de', description: 'Крупнейший интернет-магазин с широчайшим ассортиментом товаров для дома, спорта и хобби.' },
        { name: 'OTTO', category: 'general', emoji: '🧥', url: 'https://www.otto.de', description: 'Популярный немецкий каталог одежды, обуви, мебели и бытовой техники.' },
        { name: 'Expert DE', category: 'general', emoji: '📺', url: 'https://www.expert.de', description: 'Качественная электроника, телевизоры, аудиосистемы и компьютерная техника.' },

        // Dyson
        { name: 'Dyson Germany', category: 'dyson', emoji: '💨', url: 'https://www.dyson.de', description: 'Официальный магазин Dyson в Германии. Оригинальные фены, стайлеры Airwrap и пылесосы.' },
        { name: 'MediaMarkt (Dyson)', category: 'dyson', emoji: '💻', url: 'https://www.mediamarkt.de', description: 'Официальный продавец техники Dyson в Германии с регулярными акциями.' },
        { name: 'Saturn (Dyson)', category: 'dyson', emoji: '🔌', url: 'https://www.saturn.de', description: 'Бытовая техника Dyson с официальной европейской гарантией качества.' },

        // Кофемашины
        { name: 'Coffeefriend', category: 'coffee', emoji: '☕', url: 'https://www.coffeefriend.de', description: 'Профессиональный магазин кофемашин, зёрен и аксессуаров для ценителей.', brands: ['De\'Longhi', 'Jura', 'Siemens', 'Philips'] },
        { name: 'MediaMarkt (Coffee)', category: 'coffee', emoji: '💻', url: 'https://www.mediamarkt.de', description: 'Большой выбор автоматических кофемашин с европейским качеством.', brands: ['De\'Longhi', 'Siemens', 'Bosch'] },
        { name: 'Saturn (Coffee)', category: 'coffee', emoji: '🔌', url: 'https://www.saturn.de', description: 'Популярные эспрессо-кофеварки и капучинаторы от ведущих европейских марок.', brands: ['Philips', 'Bosch', 'Jura'] },
        { name: 'Amazon Germany (Coffee)', category: 'coffee', emoji: '🛍️', url: 'https://www.amazon.de', description: 'Огромный выбор кофемашин и сопутствующих товаров для приготовления кофе.', brands: ['De\'Longhi', 'Siemens', 'Philips'] },

        // Кухонная техника
        { name: 'KitchenAid Germany', category: 'kitchen', emoji: '🥣', url: 'https://www.kitchenaid.de', description: 'Официальный сайт KitchenAid в Германии. Легендарные планетарные миксеры, блендеры и тостеры.' },
        { name: 'Kitchenland', category: 'kitchen', emoji: '🍽️', url: 'https://www.kitchenland.de', description: 'Специализированный магазин высококачественной посуды и кулинарной техники.' },
        { name: 'Amazon DE (Kitchen)', category: 'kitchen', emoji: '🛍️', url: 'https://www.amazon.de', description: 'Огромный ассортимент кухонных приборов всех европейских марок.', brands: ['Bosch', 'Siemens', 'Ninja', 'Kenwood'] },
        { name: 'Idealo (Kitchen comparison)', category: 'kitchen', emoji: '⚖️', url: 'https://www.idealo.de', description: 'Сравнение цен на технику KitchenAid, Bosch, Kenwood во всех магазинах Германии.' },

        // Косметика
        { name: 'dm Drogerie', category: 'cosmetics', emoji: '🧴', url: 'https://www.dm.de', description: 'Крупнейшая и любимая немцами сеть магазинов косметики, парфюмерии и органических товаров.' },
        { name: 'Rossmann', category: 'cosmetics', emoji: '🧼', url: 'https://www.rossmann.de', description: 'Большая сеть дрогери с широким ассортиментом косметики, гигиены и бытовой эко-химии.' },
        { name: 'Douglas', category: 'cosmetics', emoji: '💄', url: 'https://www.douglas.de', description: 'Ведущий магазин селективной парфюмерии, косметики люкс брендов и средств по уходу.' },
        { name: 'Flaconi', category: 'cosmetics', emoji: '💅', url: 'https://www.flaconi.de', description: 'Популярный бьюти-ритейлер с отличными скидками на парфюм и люксовый уход.' },
        { name: 'Notino Germany', category: 'cosmetics', emoji: '🧴', url: 'https://www.notino.de', description: 'Европейский бьюти-гигант: парфюмерия, косметика, корейский уход и уход за волосами.' },

        // Аптеки
        { name: 'DocMorris', category: 'pharmacy', emoji: '💊', url: 'https://www.docmorris.de', description: 'Крупнейшая онлайн-аптека Германии с широким выбором витаминов, БАДов и лекарств.' },
        { name: 'Shop Apotheke', category: 'pharmacy', emoji: '🏥', url: 'https://www.shop-apotheke.com', description: 'Популярная интернет-аптека с быстрой доставкой медицинских изделий и дерматокосметики.' },

        // Одежда и обувь
        { name: 'Zalando', category: 'fashion', emoji: '👗', url: 'https://www.zalando.de', description: 'Главный интернет-магазин модной одежды и обуви в Европе с огромной базой брендов.' },
        { name: 'About You', category: 'fashion', emoji: '🧥', url: 'https://www.aboutyou.de', description: 'Стильный молодежный маркетплейс одежды, обуви и готовых дизайнерских образов.' },
        { name: 'Breuninger', category: 'fashion', emoji: '👜', url: 'https://www.breuninger.com', description: 'Премиальный универмаг одежды, обуви и товаров для дома от известных брендов.' },
        { name: 'Peek & Cloppenburg', category: 'fashion', emoji: '👔', url: 'https://www.peek-cloppenburg.de', description: 'Классический немецкий магазин качественной одежды для всей семьи.' },
        { name: 'BestSecret', category: 'fashion', emoji: '🗝️', url: 'https://www.bestsecret.com', description: 'Закрытый клуб распродаж дизайнерской одежды по приглашению со скидками до 80%.' },

        // Люкс
        { name: 'Mytheresa', category: 'luxury', emoji: '⚜️', url: 'https://www.mytheresa.com', description: 'Мировой лидер в сегменте онлайн-продаж роскошной женской, мужской и детской моды.' },
        { name: 'Breuninger (Luxury)', category: 'luxury', emoji: '👑', url: 'https://www.breuninger.com', description: 'Премиум коллекции одежды и сумок Gucci, Prada, Balenciaga и других модных домов.' },
        { name: 'Fashionette', category: 'luxury', emoji: '👠', url: 'https://www.fashionette.de', description: 'Лучший немецкий бутик дизайнерских сумок, обуви и роскошных аксессуаров.' },

        // Часы
        { name: 'Christ', category: 'watches', emoji: '⌚', url: 'https://www.christ.de', description: 'Знаменитая сеть ювелирных изделий и часов в Германии с вековой историей.' },
        { name: 'Uhrzeit.org', category: 'watches', emoji: '⏱️', url: 'https://www.uhrzeit.org', description: 'Специализированный интернет-магазин наручных мужских и женских часов всех марок.' },
        { name: 'Burker Watches', category: 'watches', emoji: '🕶️', url: 'https://burkerwatches.com', description: 'Стильные минималистичные наручные часы и украшения для современных образов.' },

        // Детские
        { name: 'BabyOne', category: 'kids', emoji: '🍼', url: 'https://www.babyone.de', description: 'Специализированный супермаркет колясок, автокресел, мебели и игрушек для детей.' },
        { name: 'BabyWalz', category: 'kids', emoji: '🧸', url: 'https://www.baby-walz.de', description: 'Высококачественная одежда для беременных и малышей, безопасность и комфорт с первых дней.' },

        // Б/у запчасти
        { name: 'B-Parts', category: 'autoparts_used', emoji: '🚗', url: 'https://www.b-parts.com', description: 'Огромный склад оригинальных б/у запчастей. Гарантия 12 месяцев и право на возврат в течение 14 дней.' },
        { name: 'Autoparts24', category: 'autoparts_used', emoji: '⚙️', url: 'https://www.autoparts-24.com', description: 'Крупнейший агрегатор авторазборов Европы. Поставки деталей из Германии, Франции и др.' },
        { name: 'Kleinanzeigen', category: 'autoparts_used', emoji: '🔧', url: 'https://www.kleinanzeigen.de', description: 'Немецкая доска объявлений. Идеальна для поиска б/у запчастей, шин, дисков и кузовных деталей.' },

        // Новые запчасти
        { name: 'AUTODOC Germany', category: 'autoparts_new', emoji: '🚘', url: 'https://www.autodoc.de', description: 'Один из самых популярных сайтов новых автозапчастей в Европе. Детали на VW, Mercedes, BMW, Audi, Opel.' },
        { name: 'ATP Autoteile', category: 'autoparts_new', emoji: '🛠️', url: 'https://www.atp-autoteile.de', description: 'Проверенный временем немецкий интернет-магазин новых автомобильных запчастей.' },
        { name: 'Motointegrator Germany', category: 'autoparts_new', emoji: '🛢️', url: 'https://www.motointegrator.de', description: 'Выгодные цены на моторные масла, фильтры, тормозные диски, колодки и подвеску.' },
        { name: 'kfzteile24', category: 'autoparts_new', emoji: '🔧', url: 'https://www.kfzteile24.de', description: 'Популярный немецкий магазин с быстрой доставкой качественных деталей и автохимии.' },
        { name: 'eBay Germany (Auto Parts)', category: 'autoparts_new', emoji: '📦', url: 'https://www.ebay.de', description: 'Огромная база автотоваров. Удобный поиск деталей по VIN-коду, OEM номеру или модели авто.' }
      ]
    }
  },
  computed: {
    filteredShops() {
      let result = this.shops;
      if (this.activeCategory !== 'all') {
        result = result.filter(shop => shop.category === this.activeCategory);
      }
      if (this.searchQuery.trim()) {
        const query = this.searchQuery.toLowerCase();
        result = result.filter(shop =>
          shop.name.toLowerCase().includes(query) ||
          (shop.description && shop.description.toLowerCase().includes(query)) ||
          (shop.brands && shop.brands.some(b => b.toLowerCase().includes(query)))
        );
      }
      return result;
    }
  },
  methods: {
    getCount(category) {
      if (category === 'all') return this.shops.length;
      return this.shops.filter(shop => shop.category === category).length;
    },
    getCategoryLabel(categoryVal) {
      const match = this.categories.find(c => c.value === categoryVal);
      return match ? match.label : '';
    }
  }
}
</script>
