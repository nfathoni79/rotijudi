<script setup>
const props = defineProps(['name', 'id', 'value'])
const model = defineModel()
</script>

<template>
  <div>
    <input type="radio" :name="props.name" :id="props.id" :value="props.value"
      v-model="model" class="sr-only peer">
    <label :for="props.id" class="flex flex-col items-center justify-center
      h-full border-2 border-gray-400 peer-checked:border-transparent
      rounded-xl bg-white hover:bg-gray-50 peer-checked:bg-red-50
      px-4 py-6 cursor-pointer focus:outline-none
      peer-checked:ring-4 peer-checked:ring-red-600">
      <slot></slot>
    </label>
  </div>
</template>