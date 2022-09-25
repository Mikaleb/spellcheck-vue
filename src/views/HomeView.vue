<script setup lang="ts">
import { ref } from 'vue'

import SpellCheck from '../components/SpellCheck.vue'
import useSpellCheck from '../composables/useSpellCheck'

const contentToCheck = ref('')
const checkSpelling = () => {
  const { callApi } = useSpellCheck(contentToCheck.value)
  callApi().then((res: any) => {
    console.log(res)
  })
}
</script>

<template>
  <main class="">
    <SpellCheck v-model="contentToCheck" />
    <button @click="checkSpelling">Check Spelling</button>
  </main>
</template>
