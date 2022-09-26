<template>
  <main class="p-6">
    <div
      id="container"
      class="w-full h-96 min-h-fit bg-zinc-50 overflow-auto block"
    >
      <BaseTextareaSpelling
        v-model="contentToCheck"
        :content="contentToCheck"
        :errors="getErrors"
        @update="defineApi(getInitialData())"
      />
    </div>
    <button :disabled="loading" @click="checkSpelling">Check Spelling</button>

    <template v-if="loading">⌛ Loading</template>
    <template v-else>
      <template v-if="nbErrors > 0">
        ❌ You have {{ nbErrors }} spelling errors
      </template>
      <template v-else>✅ No error (yet)</template>
    </template>
  </main>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from 'vue'

import BaseTextareaSpelling from '../components/BaseTextareaSpelling.vue'
import useSpellCheck from '../composables/useSpellCheck'

const contentToCheck = ref('Hello, example')
const getInitialData = () => ({
  elements: [],
  spellingErrorCount: 0,
})

const api = reactive(getInitialData())
const loading = ref(false)

const nbErrors = computed(() => {
  if (api.elements) {
    // @ts-ignore
    return api.elements[0]?.errors.length
  }
  return 0
})

const getErrors = computed(() => {
  if (api.elements.length > 0) {
    // @ts-ignore
    return api.elements[0]?.errors
  }
  return []
})

const checkSpelling = () => {
  loading.value = true
  const { callApi } = useSpellCheck()
  callApi(contentToCheck.value).then((res: any) => {
    if (res.spellingErrorCount) {
      defineApi(res)
    }
    loading.value = false
  })
}

const defineApi = (res: any) => {
  api.spellingErrorCount = res.spellingErrorCount
  api.elements = res.elements
}
</script>
