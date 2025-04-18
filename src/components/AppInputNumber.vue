<template>
  <div class="currency-input">
    <label v-if="label" class="currency-input__label" :for="uid">{{ label }}</label>
    <div class="currency-input__wrapper">
      <input
        :id="uid"
        type="tel"
        :value="formattedValue"
        @input="onInput"
        @blur="onFinish"
        @keydown.enter="onFinish"
        class="currency-input__field"
        inputmode="numeric"
        pattern="[0-9]*"
        placeholder="Enter numbers only"
      />
    </div>
<!--    <div v-if="errorMessage" class="currency-input__error">{{ errorMessage }}</div>-->
  </div>
</template>

<script setup lang="ts">
import { getCurrentInstance, ref, watch } from 'vue'

const modelValue = defineModel<string | number | null>();

const uid = ref(`${getCurrentInstance()?.uid}`);

defineProps<{
  label: string;
}>();

const emit = defineEmits<{
  (e: 'finished'): void
}>();

const formattedValue = ref(modelValue.value || '')

const onInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  let value = target.value

  value = value.replace(/[^0-9.]/g, '')

  const parts = value.split('.')
  if (parts.length > 2) {
    value = parts[0] + '.' + parts.slice(1).join('')
  }
  target.value = value;
  formattedValue.value = value;
  modelValue.value = value;
}

const onFinish = () => {
  emit('finished');
}


watch(modelValue, (newVal) => {
  if (newVal !== formattedValue.value) {
    formattedValue.value = newVal || ''
  }
})
</script>

<style lang="scss" scoped>
$dark-bg-primary: #121212;
$dark-bg-secondary: #1e1e1e;
$dark-bg-tertiary: #2d2d2d;
$dark-text-primary: #ffffff;
$dark-text-secondary: rgba(255, 255, 255, 0.7);
$dark-text-disabled: rgba(255, 255, 255, 0.5);
$dark-divider: rgba(255, 255, 255, 0.12);
$accent-color: hsla(160, 100%, 37%, 1);
$accent-light: hsl(160, 98%, 46%);
$accent-dark: hsla(160, 100%, 37%, 0.2);
$error-color: #cf6679;

.currency-input {
  margin-bottom: 1rem;
  width: 100%;

  &__label {
    display: block;
    margin-bottom: 0.5rem;
    color: $dark-text-secondary;
    font-size: 0.875rem;
  }

  &__wrapper {
    position: relative;
    width: 100%;
  }

  &__field {
    width: 100%;
    background-color: $dark-bg-tertiary;
    color: $dark-text-primary;
    border: 1px solid $dark-divider;
    border-radius: 4px;
    padding: 0.75rem 1rem;
    font-size: 1rem;
    transition: border-color 0.3s ease;
    outline: none;

    &:focus {
      border-color: $accent-light;
    }

    &::placeholder {
      color: $dark-text-disabled;
    }

    &:disabled {
      background-color: rgba($dark-bg-tertiary, 0.5);
      color: $dark-text-disabled;
      cursor: not-allowed;
    }
  }

  //&__error {
  //  color: $error-color;
  //  font-size: 0.75rem;
  //  margin-top: 0.25rem;
  //}
}
</style>
