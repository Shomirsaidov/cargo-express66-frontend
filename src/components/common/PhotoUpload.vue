<template>
  <div class="photo-upload">
    <!-- Previews -->
    <div v-if="previews.length > 0" class="flex flex-wrap gap-2 mb-3">
      <div v-for="(preview, index) in previews" :key="index"
        class="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200">
        <img :src="preview.url" :alt="`Photo ${index + 1}`" class="w-full h-full object-cover" />
        <button @click="removePhoto(index)"
          class="absolute top-0.5 right-0.5 w-5 h-5 bg-danger text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors">
          ×
        </button>
      </div>
    </div>

    <!-- Upload area -->
    <div
      @click="triggerInput"
      @dragover.prevent="isDragging = true"
      @dragleave="isDragging = false"
      @drop.prevent="handleDrop"
      class="border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all"
      :class="isDragging ? 'border-primary bg-primary-50' : 'border-gray-300 hover:border-primary hover:bg-gray-50'">
      <svg class="w-8 h-8 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
      </svg>
      <p class="text-sm text-gray-600">{{ $t('warehouse.uploadPhoto') }}</p>
      <p class="text-xs text-gray-400 mt-1">PNG, JPG, WEBP (max 5MB)</p>
    </div>

    <input
      ref="fileInput"
      type="file"
      accept="image/*"
      :multiple="multiple"
      class="hidden"
      @change="handleFileChange"
    />
  </div>
</template>

<script>
export default {
  name: 'PhotoUpload',

  props: {
    multiple: {
      type: Boolean,
      default: false
    },
    maxSize: {
      type: Number,
      default: 5 * 1024 * 1024 // 5MB
    }
  },

  emits: ['update:photos', 'change'],

  data() {
    return {
      previews: [],
      isDragging: false
    }
  },

  methods: {
    triggerInput() {
      this.$refs.fileInput.click()
    },

    handleFileChange(event) {
      const files = Array.from(event.target.files)
      this.processFiles(files)
      event.target.value = ''
    },

    handleDrop(event) {
      this.isDragging = false
      const files = Array.from(event.dataTransfer.files).filter(f => f.type.startsWith('image/'))
      this.processFiles(files)
    },

    processFiles(files) {
      const validFiles = files.filter(f => f.size <= this.maxSize)
      if (validFiles.length < files.length) {
        alert('Some files exceed the 5MB limit')
      }

      validFiles.forEach(file => {
        const reader = new FileReader()
        reader.onload = (e) => {
          const photoData = {
            url: e.target.result,
            base64: e.target.result,
            name: file.name,
            type: file.type
          }
          if (this.multiple) {
            this.previews.push(photoData)
          } else {
            this.previews = [photoData]
          }
          this.emitPhotos()
        }
        reader.readAsDataURL(file)
      })
    },

    removePhoto(index) {
      this.previews.splice(index, 1)
      this.emitPhotos()
    },

    emitPhotos() {
      const photos = this.previews.map(p => p.base64)
      this.$emit('update:photos', photos)
      this.$emit('change', photos)
    },

    reset() {
      this.previews = []
      this.emitPhotos()
    }
  }
}
</script>
