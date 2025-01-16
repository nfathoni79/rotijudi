<script setup>
import { ref } from 'vue'

const props = defineProps(['value'])
const emit = defineEmits(['onRevealed'])

const revealed = ref(false)

const reveal = () => {
  revealed.value = true
  emit('onRevealed')
}
</script>

<template>
  <div class="relative w-24">
    <Transition
      leave-active-class="transition-opacity ease-in duration-200"
      leave-from-class="opacity-100" leave-to-class="opacity-0">
      <div v-if="!revealed" @click="reveal"
        class="absolute rounded-xl w-full h-full
        bg-yellow-500 cursor-pointer"></div>
    </Transition>

    <div class="h-full border-2 border-gray-900 rounded-xl bg-white p-4">
      <p v-if="props.value == 1"
        class="font-ultra text-7xl text-red-700 select-none">
        7
      </p>
      <img v-else src="/bomb.svg" alt="Bomb" draggable="false"
        class="w-full h-full" />
    </div>
  </div>
</template>