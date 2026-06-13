<template>
  <span class="badge" :class="badgeClass">{{ statusLabel }}</span>
</template>

<script>
export default {
  name: 'StatusBadge',

  props: {
    status: {
      type: String,
      required: true
    }
  },

  computed: {
    badgeClass() {
      const classes = {
        awaiting_arrival: 'bg-gray-100 text-gray-700',
        received_at_warehouse: 'bg-blue-100 text-blue-700',
        processing: 'bg-yellow-100 text-yellow-700',
        assigned_to_flight: 'bg-indigo-100 text-indigo-700',
        dispatched: 'bg-purple-100 text-purple-700',
        in_transit: 'bg-primary-100 text-primary-700 bg-blue-100 text-blue-700',
        arrived_in_dushanbe: 'bg-teal-100 text-teal-700',
        customs_clearance: 'bg-orange-100 text-orange-700',
        ready_for_pickup: 'bg-lime-100 text-lime-700',
        delivered: 'bg-green-100 text-green-700',
        unknown_recipient: 'bg-red-100 text-red-700',
        cancelled: 'bg-gray-200 text-gray-500'
      }
      return classes[this.status] || 'bg-gray-100 text-gray-600'
    },
    statusLabel() {
      const key = `statuses.${this.status}`
      const translated = this.$t(key)
      return translated !== key ? translated : this.status
    }
  }
}
</script>
