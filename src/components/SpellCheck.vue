<script setup lang="ts">
defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])

const emitToParent = (e: any) => {
  emit('update:modelValue', e)
}
</script>

<template>
  <textarea
    id="spellCheckArea"
    v-debounce:200="emitToParent"
    name="spellCheckArea"
    :value="modelValue"
    class="rounded-sm p-2 z-10 min-h-fit bg-transparent h-96 max-h-96 resize-none w-fit"
  ></textarea>
</template>
