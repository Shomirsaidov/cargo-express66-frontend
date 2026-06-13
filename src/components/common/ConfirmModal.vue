<template>
  <Teleport to="body">
    <transition name="fade">
      <div v-if="isOpen" class="modal-overlay" @click.self="cancel">
        <transition name="slide-up">
          <div v-if="isOpen" class="modal-content max-w-sm mx-auto">
            <div class="p-6">
              <!-- Icon -->
              <div class="flex items-center justify-center w-12 h-12 rounded-full mx-auto mb-4"
                :class="iconBgClass">
                <svg v-if="type === 'danger'" class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                </svg>
                <svg v-else class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>

              <!-- Title -->
              <h3 class="text-lg font-semibold text-gray-900 text-center mb-2">
                {{ title || $t('common.confirm') }}
              </h3>

              <!-- Message -->
              <p class="text-sm text-gray-600 text-center mb-6">
                {{ message }}
              </p>

              <!-- Buttons -->
              <div class="flex gap-3">
                <button @click="cancel"
                  class="flex-1 btn btn-ghost border border-gray-200">
                  {{ cancelText || $t('common.cancel') }}
                </button>
                <button @click="confirm"
                  class="flex-1 btn"
                  :class="type === 'danger' ? 'btn-danger' : 'btn-primary'">
                  {{ confirmText || $t('common.confirm') }}
                </button>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </transition>
  </Teleport>
</template>

<script>
export default {
  name: 'ConfirmModal',

  props: {
    isOpen: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    message: {
      type: String,
      required: true
    },
    confirmText: {
      type: String,
      default: ''
    },
    cancelText: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'info',
      validator: (v) => ['info', 'danger'].includes(v)
    }
  },

  emits: ['confirm', 'cancel', 'update:isOpen'],

  computed: {
    iconBgClass() {
      return this.type === 'danger' ? 'bg-red-100' : 'bg-primary-100'
    }
  },

  methods: {
    confirm() {
      this.$emit('confirm')
      this.$emit('update:isOpen', false)
    },
    cancel() {
      this.$emit('cancel')
      this.$emit('update:isOpen', false)
    }
  },

  watch: {
    isOpen(val) {
      if (val) {
        document.body.style.overflow = 'hidden'
      } else {
        document.body.style.overflow = ''
      }
    }
  },

  beforeUnmount() {
    document.body.style.overflow = ''
  }
}
</script>
