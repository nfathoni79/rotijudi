<script setup>
import { ref, computed, watch } from 'vue'
import { confetti } from '@tsparticles/confetti'
import CryptoJS from 'crypto-js'

import AButton from './components/AButton.vue'
import ARadioButton from './components/ARadioButton.vue'
import Spinner from './components/Spinner.vue'
import LotteryPoint from './components/LotteryPoint.vue'

import { getName, postSubmission } from './services/DbService'

const loading = ref(false)

const name = ref('')
const nameChecked = ref(false)
const nameError = ref(false)
const secretKey = import.meta.env.VITE_SECRET

const choice = ref(null)
const choiceSelected = ref(false)

const winRate = 0.000001
const randomResult = ref(1)
const lotteryPoints = ref([1, 1, 1])
const revealCount = ref(0)

const nameValid = computed(() => {
  return name.value && name.value.length >= 3 && name.value.length <= 20
})

const won = computed(() => {
  const wonByBread = choiceSelected.value && choice.value == 0
  const wonByLottery = (choiceSelected.value && choice.value == 1
    && randomResult.value <= winRate && revealCount.value >= 3)

  return wonByBread || wonByLottery
})

const secretName = computed(() => {
  if (nameChecked.value) {
    const encrypted = CryptoJS.AES.encrypt(name.value, secretKey)
    return encrypted.toString()
  }

  return ''
})

watch([won, revealCount], async ([newWon, newCount]) => {
  if (newWon) {
    await startConfetti()
  }
  
  if (newWon || newCount >= 3) {
    await saveResult()
  }
})

const onPointRevealed = () => revealCount.value++

const checkName = async () => {
  loading.value = true

  try {
    const response = await getName(name.value)

    if (Object.keys(response.data).length == 0) {
      nameError.value = false
      nameChecked.value = true
    } else {
      nameError.value = true
    }
  } catch (error) {
    console.log(error)
  } finally {
    loading.value = false
  }
}

const selectChoice = () => {
  choiceSelected.value = true

  if (choice.value == 1) doGamble()
}

const doGamble = () => {
  randomResult.value = Math.random()

  const lastPoint = randomResult.value <= winRate ? 1 : 0
  const lastPointIndex = Math.floor(Math.random() * 3)
  lotteryPoints.value[lastPointIndex] = lastPoint
}

const startConfetti = async () => {
  await confetti('tsparticles', {
    count: 100,
  })
}

const saveResult = async () => {
  loading.value = true

  try {
    await postSubmission(
      name.value, choice.value, randomResult.value, won.value, secretName.value)
  } catch (error) {
    console.log(error)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="mx-auto min-h-screen max-w-screen-sm bg-white
    py-8 px-4 sm:px-8 text-center">
    <h1 class="font-ultra text-4xl text-gray-900 uppercase">
      Roti <span class="text-2xl">atau</span> Judi
    </h1>

    <div class="mt-8">
      <form @submit.prevent="checkName">
        <label for="name" class="block font-medium text-gray-900">
          Nama Anda
        </label>
        <input type="text" id="name" minlength="3" maxlength="20" required
          v-model="name" :disabled="nameChecked"
          class="mt-2 mx-auto block w-80 border-2 border-gray-400 rounded-lg
          bg-gray-50 p-2 text-gray-900 text-center
          focus:ring-red-600 focus:border-red-600" />

          <div v-if="nameError" role="alert"
            class="mt-2 mx-auto w-80 rounded-lg p-2 bg-red-50 text-red-800">
            Nama sudah digunakan
          </div>

        <AButton v-if="!nameChecked" type="submit"
          :disabled="!nameValid || loading" class="mt-2">
          Lanjut
        </AButton>
      </form>
    </div>

    <div v-if="nameChecked && !choiceSelected" class="mt-8">
      <form @submit.prevent="selectChoice">
        <p class="font-medium text-gray-900">Pilih Satu</p>

        <div class="mt-4 flex justify-stretch items-stretch gap-4">
          <ARadioButton name="choice" id="choice-bread" :value="0"
            v-model="choice" class="grow w-full">
            <img src="/bread.svg" alt="Bread" draggable="false" class="w-32">
            <p class="text-3xl font-semibold text-gray-900 uppercase">
              Roti
            </p>
            <p class="text-lg sm:text-xl font-medium text-gray-800">Rp5.000</p>
          </ARadioButton>

          <ARadioButton name="choice" id="choice-lottery" :value="1"
            v-model="choice" class="grow w-full">
            <img src="/lottery.svg" alt="Lottery" draggable="false" class="w-32">
            <p class="text-3xl font-semibold text-gray-900 uppercase">
              Judi
            </p>
            <p class="text-sm sm:text-xl font-medium text-gray-800">
              Rp1.000.000.000
            </p>
          </ARadioButton>
        </div>

        <AButton type="submit" :disabled="choice == null || loading" class="mt-4">
          Pilih
        </AButton>
      </form>
    </div>

    <div v-if="choiceSelected && choice == 0" class="mt-8">
      <img src="/bread.svg" alt="Bread" class="mx-auto w-80">
      <p class="text-2xl sm:text-3xl font-semibold text-gray-900 uppercase tracking-wide">
        Selamat menikmati roti Anda, {{ name }}
      </p>
    </div>

    <div v-if="choiceSelected && choice == 1" class="mt-8">
      <p class="font-medium text-gray-900">
        Klik ketiga kotak
      </p>

      <div class="mt-4 flex flex-col gap-8 border-4 border-gray-900
        rounded-2xl bg-blue-100 px-4 py-8">
        <p class="font-ultra text-2xl sm:text-4xl text-gray-900">Rp1.000.000.000</p>
        
        <div class="flex justify-center items-stretch gap-2">
          <LotteryPoint v-for="(point, key) in lotteryPoints" :key="key"
            :value="point" @onRevealed="onPointRevealed" />
        </div>
      </div>

      <div v-if="revealCount >= 3" class="mt-8 text-2xl sm:text-3xl font-semibold
        text-gray-900 uppercase tracking-wide">
        <p v-if="!won">
          Maaf, {{ name }}<br>
          Anda kalah
        </p>
        <p v-else>
          Selamat, {{ name }}<br>
          Anda menang<br>
          <span class="text-3xl sm:text-4xl font-bold normal-case">Rp1.000.000.000</span>
        </p>
      </div>
    </div>

    <div v-if="loading" class="mt-8">
      <Spinner />
    </div>
  </div>
</template>
