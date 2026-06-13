<template>
  <div class="max-w-3xl mx-auto px-4 py-12">
    <h1 class="text-3xl font-bold text-gray-900 mb-2">{{ $t('nav.privacy') }}</h1>
    <p class="text-gray-500 mb-8">Последнее обновление: 1 января 2024</p>
    <div class="card">
      <div class="space-y-6 text-gray-700 leading-relaxed">
        <section>
          <h2 class="text-xl font-bold text-gray-900 mb-3">1. Сбор данных</h2>
          <p>Мы собираем данные, необходимые для оказания услуг: имя, контактные данные, адрес доставки, история отправлений. Данные не передаются третьим лицам без согласия клиента.</p>
        </section>
        <section>
          <h2 class="text-xl font-bold text-gray-900 mb-3">2. Использование данных</h2>
          <p>Собранные данные используются для: идентификации клиентов, оформления отправлений, уведомлений о статусе, улучшения сервиса.</p>
        </section>
        <section>
          <h2 class="text-xl font-bold text-gray-900 mb-3">3. Защита данных</h2>
          <p>Мы используем современные методы шифрования для защиты ваших персональных данных. Доступ к данным имеют только авторизованные сотрудники.</p>
        </section>
        <section>
          <h2 class="text-xl font-bold text-gray-900 mb-3">4. Права пользователей</h2>
          <p>Вы имеете право запросить, изменить или удалить свои персональные данные. Для этого обратитесь в нашу поддержку.</p>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
export default { name: 'PrivacyPage' }
</script>
