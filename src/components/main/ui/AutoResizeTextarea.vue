<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from "vue";

const { modelValue, placeholder, minHeight, maxHeight } = defineProps<{
  modelValue: string;
  placeholder?: string;
  minHeight?: number;
  maxHeight?: number;
  onBlur?: () => void;
  onEnter?: () => void;
  onEscape?: () => void;
}>();

const emit = defineEmits(["update:modelValue"]);

const textarea = ref(null);
const internalValue = computed({
  get: () => modelValue,
  set: (value: string) => emit("update:modelValue", value),
});

function resize() {
  const element = textarea.value;
  if (!element) return;
  element.style.height = "auto";
  let newHeight = el.scrollHeight;

  if (props.minHeight) {
    newHeight = Math.max(newHeight, props.minHeight);
  }
  if (props.maxHeight) {
    newHeight = Math.min(newHeight, props.maxHeight);
  }

  el.style.height = `${newHeight}px`;
  emit("update:modelValue", element.value);
}

watch(
  () => modelValue,
  () => nextTick(() => resize()),
);

onMounted(() => {
  nextTick(() => resize());
});
</script>
<template>
  <textarea
    ref="textarea"
    class="auto-resize"
    row="1"
    v-model="internalValue"
    @input="resize"
    @blur="onBlur"
    @keyup.enter="onEnter"
    @keyup.escape="onEscape"
    :placeholder="placeholder"
  />
</template>
<style scoped>
.auto-resize {
  overflow: hidden;
  resize: none;
  min-height: 30px;
  width: 100%;
  box-sizing: border-box;
  font-size: 16px;
  line-height: 1.5;
  padding: 8px;
}
</style>
