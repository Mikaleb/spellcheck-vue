<template>
  <!-- modelValue always passed is : {{ props.modelValue }} -->

  <div
    id="highlights"
    ref="root"
    name="spellCheckArea"
    class="rounded-sm p-2 z-0 w-full h-96 overflow-auto"
    contenteditable="true"
    @blur="emitToParent"
  >
    <template v-if="highlights.length === 0">
      <span class="">{{ props.modelValue }}</span>
    </template>
    <template v-else>
      <template v-for="(result, i) in highlights">
        <template v-if="result.match">
          <BaseSuggestionWord
            :key="i"
            :word="result.word"
            :suggestions="result.suggestions"
            @selected-suggestion="replaceWithSuggestion(result.word, $event)"
          />
        </template>
        <template v-else>
          <span :key="i" class="">{{ result.word }}</span>
        </template>
      </template>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import BaseSuggestionWord from './BaseSuggestionWord.vue'

interface HighLightWord extends ErrorApi {
  match: boolean
}

interface ErrorApi {
  position: number
  word: string
  suggestions: string[]
}
const root: any = ref(null)
const props = defineProps(['modelValue', 'content', 'errors'])
const emit = defineEmits(['update:modelValue', 'update'])

watch(
  () => props.modelValue,
  (selection, prevSelection) => {
    if (selection === prevSelection) return
    emit('update')
    root.value = selection
  }
)

const emitToParent = (e: any) => {
  const text = parseHtmlToText(e.target)

  if (e.target.textContent !== props.modelValue) {
    emit('update:modelValue', text)
  }
}

const errors = computed<ErrorApi[]>(() => {
  if (!props.errors.length) return []
  return props.errors
})

function parseHtmlToText(html: any) {
  const element = html.cloneNode(true)
  const spans = element.getElementsByClassName('suggestions')
  while (spans.length > 0) {
    spans[0].parentNode.removeChild(spans[0])
  }
  let text = element.textContent.split('\n').join('')
  text = text.trimStart()
  text = text.replace(/  +/g, ' ')
  return text
}

// Make a list of all the words + highlighted errors
const highlights = computed(() => {
  const wordList: HighLightWord[] = []

  function getTextBeforeError(lastWord: HighLightWord | null, error: ErrorApi) {
    let text = ''
    let positionOfText = {
      start: 0,
      end: error.position,
    }

    if (lastWord && lastWord !== null) {
      positionOfText.start = lastWord.position + lastWord.word.length
      positionOfText.end = error.position
    }

    text = props.content.slice(positionOfText.start, positionOfText.end)

    return { match: false, position: positionOfText.start, word: text }
  }

  // if we are at the last error, we add the text after the error
  function addTextAfter(
    index: number,
    error: { position: any; word: string | any[] }
  ) {
    if (index === errors.value.length - 1) {
      const position = {
        start: error.position + error.word.length,
        end: props.content.length,
      }
      const textAfter = props.content.slice(position.start, position.end)
      wordList.push({
        match: false,
        position: position.start,
        word: textAfter,
        suggestions: [],
      })
    }
  }

  function addContent(
    index: number,
    textBefore: HighLightWord,
    error: any,
    apiError: HighLightWord
  ) {
    if (textBefore.position !== error.position && textBefore.word.length > 0) {
      wordList.push(textBefore)
    }
    wordList.push(apiError)
    addTextAfter(index, error)
  }

  // for each error, we add the text before the error and the error itself
  errors.value.forEach((error, index) => {
    let match = error.word.length > 0
    let apiError = { match, ...error }

    // get the last result of wordList, otherwise return null
    const lastWordList = wordList.length ? wordList[wordList.length - 1] : null

    const textBefore: any = getTextBeforeError(lastWordList, error)

    if (!wordList.length) {
      // if the text before is different than the error, we add it
      addContent(index, textBefore, error, apiError)
    }

    // if we already have words in our list
    else {
      // we replace the last result with the error
      if (lastWordList && lastWordList !== null) {
        if (lastWordList.position === error.position) {
          wordList[wordList.length - 1] = apiError
        } else if (lastWordList.position < error.position) {
          addContent(index, textBefore, error, apiError)
        }
      }
    }
  })

  return wordList
})

const replaceWithSuggestion = (word: string, suggestion: string) => {
  const text = parseHtmlToText(root.value)
  const newText = text.replace(word, suggestion)
  emit('update:modelValue', newText)
}
</script>

<style scoped>
#highlights {
  height: inherit;
}
</style>
