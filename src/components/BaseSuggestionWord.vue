<template>
  <span
    class="bg-rose-100 hover:cursor-pointer ml-1 p-1"
    @click="showSuggestions = !showSuggestions"
    @blur="showSuggestions = false"
  >
    {{ text }}
  </span>
  <div
    v-if="showSuggestions && suggestions.length"
    class="absolute z-50"
    contenteditable="false"
  >
    <div class="bg-white rounded-md shadow-lg">
      <div class="py-1 suggestions">
        <template v-for="(suggestion, i) in suggestions" :key="i">
          <div
            id="menu-item-0"
            class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 hover:cursor-pointer"
            role="menuitem"
            tabindex="-1"
            @click="sendSuggestion(suggestion)"
          >
            <span class="">{{ suggestion }}</span>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
const props = defineProps(['word', 'suggestions'])
const emit = defineEmits(['selectedSuggestion'])

const text = computed(() => {
  // computed property that auto-updates when the prop changes
  return props.word
})

const sendSuggestion = (suggestion: string) => {
  emit('selectedSuggestion', suggestion)
}

const showSuggestions = ref(false)
</script>
