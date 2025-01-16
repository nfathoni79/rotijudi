<script setup>
import { useAttrs } from 'vue'

const attrs = useAttrs()
</script>

<template>
  <button type="button"
    :class="['rounded-lg px-6 py-2 font-medium text-green-50',
    !attrs.disabled ? 'bg-red-700 hover:bg-red-800' : 'bg-gray-400',
    'focus:outline-none focus:ring-4 focus:ring-red-300']">
    <slot></slot>
  </button>
</template>