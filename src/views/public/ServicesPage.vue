<template>
  <div class="py-12 bg-gradient-to-b from-gray-50 to-white min-h-screen">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header Section -->
      <div class="text-center max-w-3xl mx-auto mb-16">
        <span class="text-xs font-bold uppercase tracking-wider bg-primary-50 text-primary px-3 py-1 rounded-full">Наши услуги</span>
        <h1 class="text-4xl font-extrabold text-gray-900 sm:text-5xl mt-3 tracking-tight">
          Дополнительные услуги
        </h1>
        <p class="mt-4 text-lg text-gray-500">
          Мы предлагаем ряд дополнительных сервисов для проверки, защиты и качественной доставки ваших посылок из США и Германии.
        </p>
      </div>

      <!-- Services Cards Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        <!-- Card 1 -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-md hover:border-primary-200 transition-all duration-300 flex flex-col justify-between group">
          <div>
            <div class="w-12 h-12 rounded-xl bg-blue-50 text-primary flex items-center justify-center text-2xl mb-6 group-hover:bg-primary group-hover:text-white transition-all duration-300">
              🔍
            </div>
            <h3 class="text-lg font-bold text-gray-900 mb-2">Проверить товар</h3>
            <p class="text-sm text-gray-500 leading-relaxed mb-6">
              Наш сотрудник откроет посылку и сверит содержимое с вашим описанием. Проверим соответствие размера, цвета и комплектации.
            </p>
          </div>
          <div class="flex items-center justify-between border-t border-gray-50 pt-4">
            <span class="text-xs font-semibold text-gray-400">Стоимость</span>
            <span class="text-lg font-bold text-primary">$5.00</span>
          </div>
        </div>

        <!-- Card 2 -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-md hover:border-primary-200 transition-all duration-300 flex flex-col justify-between group">
          <div>
            <div class="w-12 h-12 rounded-xl bg-blue-50 text-primary flex items-center justify-center text-2xl mb-6 group-hover:bg-primary group-hover:text-white transition-all duration-300">
              📸
            </div>
            <h3 class="text-lg font-bold text-gray-900 mb-2">Сделать фото</h3>
            <p class="text-sm text-gray-500 leading-relaxed mb-6">
              Мы сделаем 3-5 качественных фотографий полученного товара и его упаковки, чтобы вы могли визуально убедиться в его сохранности.
            </p>
          </div>
          <div class="flex items-center justify-between border-t border-gray-50 pt-4">
            <span class="text-xs font-semibold text-gray-400">Стоимость</span>
            <span class="text-lg font-bold text-primary">$2.00</span>
          </div>
        </div>

        <!-- Card 3 -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-md hover:border-primary-200 transition-all duration-300 flex flex-col justify-between group">
          <div>
            <div class="w-12 h-12 rounded-xl bg-blue-50 text-primary flex items-center justify-center text-2xl mb-6 group-hover:bg-primary group-hover:text-white transition-all duration-300">
              ⚡
            </div>
            <h3 class="text-lg font-bold text-gray-900 mb-2">Проверить работоспособность</h3>
            <p class="text-sm text-gray-500 leading-relaxed mb-6">
              Включение электроники и проверка базовых функций устройства. Убедитесь, что гаджет включается и работает исправно до отправки.
            </p>
          </div>
          <div class="flex items-center justify-between border-t border-gray-50 pt-4">
            <span class="text-xs font-semibold text-gray-400">Стоимость</span>
            <span class="text-lg font-bold text-primary">$10.00</span>
          </div>
        </div>

        <!-- Card 4 -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-md hover:border-primary-200 transition-all duration-300 flex flex-col justify-between group">
          <div>
            <div class="w-12 h-12 rounded-xl bg-blue-50 text-primary flex items-center justify-center text-2xl mb-6 group-hover:bg-primary group-hover:text-white transition-all duration-300">
              📦
            </div>
            <h3 class="text-lg font-bold text-gray-900 mb-2">Дополнительная упаковка</h3>
            <p class="text-sm text-gray-500 leading-relaxed mb-6">
              Обернем товар пузырчатой пленкой, укрепим швы коробки армированным скотчем или упакуем в дополнительный плотный защитный бокс.
            </p>
          </div>
          <div class="flex items-center justify-between border-t border-gray-50 pt-4">
            <span class="text-xs font-semibold text-gray-400">Стоимость</span>
            <span class="text-lg font-bold text-primary">$2.00</span>
          </div>
        </div>

        <!-- Card 5 -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-md hover:border-primary-200 transition-all duration-300 flex flex-col justify-between group">
          <div>
            <div class="w-12 h-12 rounded-xl bg-blue-50 text-primary flex items-center justify-center text-2xl mb-6 group-hover:bg-primary group-hover:text-white transition-all duration-300">
              🛡️
            </div>
            <h3 class="text-lg font-bold text-gray-900 mb-2">Страхование груза</h3>
            <p class="text-sm text-gray-500 leading-relaxed mb-6">
              Полная финансовая защита стоимости вашего груза в случае утери или повреждения в процессе транспортировки.
            </p>
          </div>
          <div class="flex items-center justify-between border-t border-gray-50 pt-4">
            <span class="text-xs font-semibold text-gray-400">Стоимость</span>
            <span class="text-lg font-bold text-primary">2% от стоимости</span>
          </div>
        </div>
      </div>

      <!-- How to Add Guide -->
      <div class="bg-primary-950 text-white rounded-3xl p-8 md:p-12 shadow-xl relative overflow-hidden">
        <div class="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-x-12 translate-y-12">
          <span class="text-[200px] font-bold">Cargo</span>
        </div>
        
        <h2 class="text-2xl md:text-3xl font-extrabold mb-6">Как добавить услуги к посылке?</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="space-y-2">
            <div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-sm font-bold text-white">1</div>
            <h4 class="font-bold text-base">Оформить заявку</h4>
            <p class="text-xs text-primary-200 leading-relaxed">
              В личном кабинете перейдите в раздел «Номера отслеживания» и нажмите кнопку создания заявки.
            </p>
          </div>
          <div class="space-y-2">
            <div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-sm font-bold text-white">2</div>
            <h4 class="font-bold text-base">Выбрать услуги</h4>
            <p class="text-xs text-primary-200 leading-relaxed">
              Отметьте галочками нужные услуги в списке. Если выбрали страховку, укажите стоимость товара.
            </p>
          </div>
          <div class="space-y-2">
            <div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-sm font-bold text-white">3</div>
            <h4 class="font-bold text-base">Готово!</h4>
            <p class="text-xs text-primary-200 leading-relaxed">
              Наш склад автоматически увидит выбранные услуги при сканировании и примет их в работу.
            </p>
          </div>
        </div>
        <div class="mt-8 text-center md:text-left">
          <RouterLink to="/register" class="btn btn-primary bg-white text-primary hover:bg-gray-100 !px-8 py-3 rounded-xl font-bold transition-all shadow-lg inline-block">
            Начать доставку
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PublicServicesPage'
}
</script>
