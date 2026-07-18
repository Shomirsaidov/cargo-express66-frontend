<template>
  <div class="py-12 bg-gradient-to-b from-gray-50 to-white min-h-screen">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="text-center max-w-3xl mx-auto mb-12">
        <span class="text-xs font-bold uppercase tracking-wider bg-blue-50 text-blue-600 px-3 py-1 rounded-full border border-blue-150">🇺🇸 Покупки в США</span>
        <h1 class="text-4xl font-extrabold text-gray-900 sm:text-5xl mt-3 tracking-tight">
          Гид по магазинам США
        </h1>
        <p class="mt-4 text-lg text-gray-500">
          Покупайте качественные товары напрямую из американских онлайн-магазинов, а мы доставим их вам прямо в Душанбе.
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
          <!-- Holiday Sales Banner -->
          <div class="bg-gradient-to-r from-red-500 to-red-600 rounded-3xl p-6 text-white mb-8 shadow-md relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h4 class="text-lg font-bold">🎉 Время мега-скидок!</h4>
              <p class="text-xs text-red-150 leading-relaxed mt-1">
                Во время Black Friday, Cyber Monday, Prime Day и праздничных распродаж цены в магазинах США могут быть значительно ниже обычных!
              </p>
            </div>
            <span class="text-3xl filter drop-shadow">🔥</span>
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
  name: 'ShopsUsaPage',
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
        { value: 'pharmacy', label: 'Аптеки и iHerb' },
        { value: 'fashion', label: 'Одежда и обувь' },
        { value: 'luxury', label: 'Люкс бренды' },
        { value: 'watches', label: 'Часы' },
        { value: 'kids', label: 'Детские товары' }
      ],
      shops: [
        // Универсальные
        { name: 'Amazon USA', category: 'general', emoji: '🛍️', url: 'https://www.amazon.com', description: 'Крупнейший в мире маркетплейс. Здесь можно найти абсолютно всё: от мелочей до сложной техники.' },
        { name: 'Best Buy', category: 'general', emoji: '💻', url: 'https://www.bestbuy.com', description: 'Популярный супермаркет электроники, бытовой техники, гаджетов и аксессуаров.' },
        { name: 'Walmart', category: 'general', emoji: '🛒', url: 'https://www.walmart.com', description: 'Крупнейшая сеть супермаркетов в США с низкими ценами и огромным ассортиментом товаров.' },
        { name: 'Costco', category: 'general', emoji: '📦', url: 'https://www.costco.com', description: 'Оптово-розничный гигант с эксклюзивными предложениями и клубными скидками.' },
        { name: 'Target', category: 'general', emoji: '🎯', url: 'https://www.target.com', description: 'Стильный супермаркет с качественной одеждой, товарами для дома и продуктами.' },
        { name: 'B&H Photo Video', category: 'general', emoji: '📷', url: 'https://www.bhphotovideo.com', description: 'Лучший американский магазин для фотографов, видеографов и любителей профессионального звука.' },
        { name: 'Newegg', category: 'general', emoji: '🔌', url: 'https://www.newegg.com', description: 'Крупный онлайн-ритейлер компьютерных комплектующих, ноутбуков и умной техники.' },
        { name: 'Micro Center', category: 'general', emoji: '🖥️', url: 'https://www.microcenter.com', description: 'Рай для сборщиков ПК с отличными скидками на процессоры, видеокарты и электронику.' },

        // Dyson
        { name: 'Dyson USA', category: 'dyson', emoji: '💨', url: 'https://www.dyson.com', description: 'Официальный магазин Dyson в США. Оригинальные фены, стайлеры, пылесосы и климатическая техника.' },
        { name: 'Best Buy (Dyson)', category: 'dyson', emoji: '🔌', url: 'https://www.bestbuy.com', description: 'Авторизованный продавец Dyson с официальной гарантией и регулярными скидками.' },
        { name: 'Costco (Dyson)', category: 'dyson', emoji: '📦', url: 'https://www.costco.com', description: 'Редкие клубные скидки на эксклюзивные комплекты стайлеров и пылесосов Dyson.' },
        { name: 'Walmart (Dyson)', category: 'dyson', emoji: '🛒', url: 'https://www.walmart.com', description: 'Выгодные предложения на бытовую технику и аксессуары Dyson.' },
        { name: 'Target (Dyson)', category: 'dyson', emoji: '🎯', url: 'https://www.target.com', description: 'Отличный выбор техники Dyson для дома и персонального ухода.' },
        { name: 'Amazon (Dyson)', category: 'dyson', emoji: '🛍️', url: 'https://www.amazon.com', description: 'Официальный брендовый магазин Dyson на площадке Amazon.' },

        // Кофемашины
        { name: 'Williams Sonoma (Coffee)', category: 'coffee', emoji: '☕', url: 'https://www.williams-sonoma.com', description: 'Премиум бутик товаров для кухни и дома. Элитные кофемашины лучших брендов.', brands: ['Breville', 'De\'Longhi', 'Jura', 'Nespresso'] },
        { name: 'Sur La Table', category: 'coffee', emoji: '🍽️', url: 'https://www.surlatable.com', description: 'Кухонные товары премиум класса. Широкий выбор профессионального оборудования для кофе.', brands: ['Breville', 'Jura', 'Philips', 'Nespresso'] },
        { name: 'Best Buy (Coffee)', category: 'coffee', emoji: '⚡', url: 'https://www.bestbuy.com', description: 'Широкий выбор электрических кофеварок, кофемолок и автоматических эспрессо-машин.', brands: ['Breville', 'Ninja', 'Keurig'] },
        { name: 'Costco (Coffee)', category: 'coffee', emoji: '📦', url: 'https://www.costco.com', description: 'Качественные кофемашины и капсульные кофеварки по сниженным ценам.', brands: ['Keurig', 'De\'Longhi', 'Nespresso'] },
        { name: 'Amazon USA (Coffee)', category: 'coffee', emoji: '🛍️', url: 'https://www.amazon.com', description: 'Тысячи кофемашин с доставкой на любой вкус — от капельных до рожковых суперавтоматов.', brands: ['Breville', 'De\'Longhi', 'Ninja', 'Philips'] },

        // Кухонная техника
        { name: 'KitchenAid USA', category: 'kitchen', emoji: '🥣', url: 'https://www.kitchenaid.com', description: 'Официальный сайт легендарного кухонного бренда. Знаменитые планетарные миксеры, блендеры и аксессуары.' },
        { name: 'Costco (Kitchen)', category: 'kitchen', emoji: '📦', url: 'https://www.costco.com', description: 'Электроника для кухни по оптовым ценам: блендеры, мультиварки и грили.', brands: ['Vitamix', 'Ninja', 'Instant Pot'] },
        { name: 'Williams Sonoma (Kitchen)', category: 'kitchen', emoji: '🔪', url: 'https://www.williams-sonoma.com', description: 'Огромный выбор посуды, ножей и элитной кухонной электроники.' },
        { name: 'Crate & Barrel', category: 'kitchen', emoji: '🏺', url: 'https://www.crateandbarrel.com', description: 'Дизайнерская мебель, стильная посуда и современная бытовая техника для идеальной кухни.' },
        { name: 'Amazon USA (Kitchen)', category: 'kitchen', emoji: '🛍️', url: 'https://www.amazon.com', description: 'Самый большой каталог кухонных приборов всех известных марок с быстрой доставкой.', brands: ['Cuisinart', 'Breville', 'Instant Pot'] },
        { name: 'Best Buy (Kitchen)', category: 'kitchen', emoji: '🔌', url: 'https://www.buybuybaby.com', description: 'Большой выбор холодильников, печей, блендеров и микроволновок для вашего дома.', brands: ['Bosch', 'GE', 'Ninja'] },

        // Косметика
        { name: 'Sephora', category: 'cosmetics', emoji: '💄', url: 'https://www.sephora.com', description: 'Главный бьюти-ритейлер. Лучшая парфюмерия, уходовая и декоративная косметика от мировых брендов.' },
        { name: 'Ulta Beauty', category: 'cosmetics', emoji: '💅', url: 'https://www.ulta.com', description: 'Популярная сеть косметики с широким ассортиментом: от масс-маркета до профессиональных средств.' },
        { name: 'Dermstore', category: 'cosmetics', emoji: '🧪', url: 'https://www.dermstore.com', description: 'Магазин профессиональной дерматологической косметики для здоровья и молодости кожи.' },
        { name: 'Bluemercury', category: 'cosmetics', emoji: '🧼', url: 'https://www.bluemercury.com', description: 'Премиальный спа-бутик с эксклюзивными брендами натуральной и лечебной косметики.' },
        { name: 'Amazon USA (Cosmetics)', category: 'cosmetics', emoji: '🛍️', url: 'https://www.amazon.com', description: 'Тысячи оригинальных бьюти-товаров, кистей для макияжа и средств для ухода за волосами.' },

        // Аптеки
        { name: 'CVS Pharmacy', category: 'pharmacy', emoji: '💊', url: 'https://www.cvs.com', description: 'Одна из крупнейших аптечных сетей США. Лекарства, витамины, гигиена и легкая косметика.' },
        { name: 'Walgreens', category: 'pharmacy', emoji: '🏥', url: 'https://www.walgreens.com', description: 'Популярная сеть аптек с большим выбором витаминов, добавок и медицинских товаров.' },
        { name: 'Rite Aid', category: 'pharmacy', emoji: '🩹', url: 'https://www.riteaid.com', description: 'Аптечные товары повседневного спроса, средства для здоровья и личной гигиены.' },
        { name: 'iHerb', category: 'pharmacy', emoji: '🌿', url: 'https://www.iherb.com', description: 'Мировой лидер по продаже натуральных продуктов, БАДов, витаминов, спортивного питания и органики.' },

        // Одежда и обувь
        { name: 'Nike USA', category: 'fashion', emoji: '👟', url: 'https://www.nike.com', description: 'Официальный магазин спортивной одежды и обуви бренда Nike. Лимитированные серии кроссовок.' },
        { name: 'Nordstrom', category: 'fashion', emoji: '👗', url: 'https://www.nordstrom.com', description: 'Один из лучших универмагов модной одежды, обуви и аксессуаров среднего и премиум сегмента.' },
        { name: 'Macy\'s', category: 'fashion', emoji: '👜', url: 'https://www.macys.com', description: 'Знаменитый американский универмаг с частыми скидками на брендовую одежду и текстиль для дома.' },
        { name: 'Bloomingdale\'s', category: 'fashion', emoji: '🕶️', url: 'https://www.bloomingdales.com', description: 'Трендовая одежда, обувь премиум брендов и стильные аксессуары высокого качества.' },
        { name: 'Saks Fifth Avenue', category: 'fashion', emoji: '👑', url: 'https://www.saksfifthavenue.com', description: 'Культовый бутик дизайнерской одежды и обуви прямо с подиумов Нью-Йорка.' },
        { name: 'Zappos', category: 'fashion', emoji: '🥿', url: 'https://www.zappos.com', description: 'Самый популярный обувной интернет-магазин в США с огромным выбором размеров и брендов.' },
        { name: 'Amazon USA (Fashion)', category: 'fashion', emoji: '🛍️', url: 'https://www.amazon.com', description: 'Большой выбор повседневной одежды, джинсов, курток и аксессуаров по доступным ценам.' },

        // Люкс
        { name: 'Neiman Marcus', category: 'luxury', emoji: '⚜️', url: 'https://www.neimanmarcus.com', description: 'Роскошный универмаг эксклюзивной дизайнерской одежды, обуви, сумок и ювелирных изделий.' },
        { name: 'Saks Fifth Avenue (Luxury)', category: 'luxury', emoji: '👑', url: 'https://www.saksfifthavenue.com', description: 'Одежда от кутюр и премиальные аксессуары ведущих мировых домов моды.' },
        { name: 'Nordstrom (Luxury)', category: 'luxury', emoji: '👗', url: 'https://www.nordstrom.com', description: 'Коллекции люксовой одежды, сумок и обуви от ведущих мировых дизайнеров.' },
        { name: 'Bloomingdale\'s (Luxury)', category: 'luxury', emoji: '🕶️', url: 'https://www.bloomingdales.com', description: 'Премиальные дизайнерские вещи и эксклюзивные коллекции одежды высокого класса.' },
        { name: 'Farfetch USA', category: 'luxury', emoji: '👠', url: 'https://www.farfetch.com', description: 'Маркетплейс премиальной одежды, объединяющий сотни лучших модных бутиков со всего мира.' },

        // Часы
        { name: 'Jomashop', category: 'watches', emoji: '⌚', url: 'https://www.jomashop.com', description: 'Лучший дисконт-магазин наручных часов, сумок и аксессуаров. Скидки на брендовые часы до 80%.' },
        { name: 'Watches of Switzerland USA', category: 'watches', emoji: '⏱️', url: 'https://www.watchesofswitzerland.com', description: 'Официальный дилер престижных швейцарских часовых марок высокого класса.' },
        { name: 'Macy\'s (Watches)', category: 'watches', emoji: '👜', url: 'https://www.macys.com', description: 'Широкий выбор дизайнерских и спортивных часов по отличным ценам с купонами.' },
        { name: 'Nordstrom (Watches)', category: 'watches', emoji: '👗', url: 'https://www.nordstrom.com', description: 'Брендовые кварцевые и механические наручные часы от ведущих мировых производителей.' },

        // Детские
        { name: 'Buy Buy Baby', category: 'kids', emoji: '🍼', url: 'https://www.buybuybaby.com', description: 'Огромный выбор колясок, кроваток, питания, развивающих игрушек и одежды для новорожденных.' },
        { name: 'Carter\'s', category: 'kids', emoji: '🧸', url: 'https://www.carters.com', description: 'Самый известный американский бренд детской одежды. Непревзойденное качество и очень низкие цены.' },
        { name: 'Target (Kids)', category: 'kids', emoji: '🎯', url: 'https://www.target.com', description: 'Качественная детская одежда, обувь, игрушки и товары для школы по выгодным ценам.' },
        { name: 'Walmart (Kids)', category: 'kids', emoji: '🛒', url: 'https://www.walmart.com', description: 'Недорогие детские игрушки, одежда, товары для новорожденных и детские автокресла.' },
        { name: 'Amazon USA (Kids)', category: 'kids', emoji: '🛍️', url: 'https://www.amazon.com', description: 'Миллионы детских товаров: от подгузников до конструкторов Lego и интерактивных игрушек.' }
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
