<template>
  <div class="convert-view">
    <section class="convert-view__header">
      <h1 class="convert-view__title">Конвертация валют</h1>
      <p class="convert-view__subtitle">Быстрый и удобный расчет обмена валют по текущему курсу</p>
    </section>

    <section class="converter">
      <div class="converter__card">
        <div class="converter__row">
          <div class="converter__currency-wrapper">
            <label class="converter__label">Из валюты</label>
            <select
              class="converter__currency-select"
              v-model="fromCurrency"
              @change="recalculateTarget"
            >
              <option
                v-for="currency in currencies"
                :key="currency.code"
                :value="currency.code"
              >
                {{ currency.code }} - {{ currency.name }}
              </option>
            </select>
          </div>
          <div class="converter__amount-wrapper">
            <AppInputNumber
              v-model="fromAmount"
              label="Сумма"
              @input="convertFromSource"
              @finished="addToHistory"
            />
          </div>
        </div>

        <div class="converter__switch">
          <button class="converter__switch-btn" @click="switchCurrencies">
            <span class="converter__switch-icon">↑↓</span>
            <span class="converter__switch-text">Поменять местами</span>
          </button>
        </div>

        <div class="converter__row">
          <div class="converter__currency-wrapper">
            <label class="converter__label">В валюту</label>
            <select
              class="converter__currency-select"
              v-model="toCurrency"
              @change="recalculateSource"
            >
              <option
                v-for="currency in currencies"
                :key="currency.code"
                :value="currency.code"
              >
                {{ currency.code }} - {{ currency.name }}
              </option>
            </select>
          </div>
          <div class="converter__amount-wrapper">
            <AppInputNumber
              v-model="toAmount"
              label="Сумма"
              @input="convertFromTarget"
              @finished="addToHistory"
            />
          </div>
        </div>

        <div class="converter__info">
          <p class="converter__rate">
            1 {{ fromCurrency }} = {{ formatRate(getRate(fromCurrency, toCurrency)) }} {{ toCurrency }}
          </p>
          <p class="converter__update">
            Обновлено: {{ currentDate }}
          </p>
        </div>
      </div>
    </section>

    <section class="conversion-history">
      <h2 class="conversion-history__title">История конвертаций</h2>
      <div class="conversion-history__content" v-if="conversionHistory.length > 0">
        <div class="conversion-history__item" v-for="(item, index) in conversionHistory" :key="index">
          <div class="conversion-history__operation">
            {{ formatAmount(item.fromAmount) }} {{ item.fromCurrency }} → {{ formatAmount(item.toAmount) }} {{ item.toCurrency }}
          </div>
          <div class="conversion-history__date">{{ item.date }}</div>
        </div>
      </div>
      <div class="conversion-history__empty" v-else>
        <p class="conversion-history__empty-text">История конвертаций пуста</p>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import {ref, computed, watch, onMounted, getCurrentInstance} from 'vue';
import { useRoute } from 'vue-router';
import AppInputNumber from "@/components/AppInputNumber.vue";
import type CurrencyInfo from "@/types/CurrencyInfo.ts";
import {CURRENCIES_TITLES} from "@/consts/CURRENCIES.ts";

const props = defineProps<{
  baseCurrency: string;
  rates: CurrencyInfo;
}>();

const route = useRoute();

const fromCurrency = ref('RUB');
const toCurrency = ref('USD');
const fromAmount = ref<number | string | null>(1000);
const toAmount = ref<number | string | null>(0);
const conversionHistory = ref([]);

const currencies = ref(CURRENCIES_TITLES);

const currentDate = computed(() => {
  const now = new Date();
  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(now);
});

const getRate = (from: string, to: string): number => {
  if (!props.rates || !props.rates[from] || !props.rates[from][to]) {
    return 1; // Возвращаем 1 как запасной вариант, если курс не найден
  }
  return props.rates[from][to];
};

const formatRate = (rate: number): string => {
  return rate.toFixed(2);
};

const formatAmount = (amount: number): string => {
  return new Intl.NumberFormat('ru-RU', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

const convertFromSource = (): void => {
  if (fromAmount.value === null || fromAmount.value === '') {
    toAmount.value = '';
    return;
  }

  const rate = getRate(fromCurrency.value, toCurrency.value);
  toAmount.value = parseFloat((fromAmount.value * rate).toFixed(2));
};

const convertFromTarget = (): void => {
  if (toAmount.value === null || toAmount.value === '') {
    fromAmount.value = '';
    return;
  }
  const rate = getRate(toCurrency.value, fromCurrency.value);
  fromAmount.value = parseFloat((toAmount.value * rate).toFixed(2));
};

const recalculateTarget = (): void => {
  if (fromAmount.value) {
    convertFromSource();
  }
};

const recalculateSource = (): void => {
  if (toAmount.value) {
    convertFromTarget();
  }
};

const switchCurrencies = (): void => {
  const tempCurrency = fromCurrency.value;
  fromCurrency.value = toCurrency.value;
  toCurrency.value = tempCurrency;
  fromAmount.value = toAmount.value;
  convertFromSource();
};

const addToHistory = (): void => {
  if (!fromAmount.value || !toAmount.value) return;

  const historyItem = {
    fromAmount: fromAmount.value,
    fromCurrency: fromCurrency.value,
    toAmount: toAmount.value,
    toCurrency: toCurrency.value,
    date: new Date().toLocaleTimeString('ru-RU'),
    id: `${Date.now()}${Math.random()}${getCurrentInstance()?.uid}`
  };

  conversionHistory.value.unshift(historyItem);

  if (conversionHistory.value.length > 10) {
    conversionHistory.value = conversionHistory.value.slice(0, 10);
  }

  saveHistoryToLocalStorage();
};

const saveHistoryToLocalStorage = (): void => {
  try {
    localStorage.setItem('conversionHistory', JSON.stringify(conversionHistory.value));
  } catch (e) {
    console.error('Ошибка при сохранении истории:', e);
  }
};

const loadHistoryFromLocalStorage = (): void => {
  try {
    const savedHistory = localStorage.getItem('conversionHistory');
    if (savedHistory) {
      conversionHistory.value = JSON.parse(savedHistory);
    }
  } catch (e) {
    console.error('Ошибка при загрузке истории:', e);
  }
};

const init = () => {
  if (route.query.from && route.query.to) {
    const fromParam = route.query.from.toString();
    const toParam = route.query.to.toString();

    const fromExists = currencies.value.some(c => c.code === fromParam);
    const toExists = currencies.value.some(c => c.code === toParam);

    if (fromExists) fromCurrency.value = fromParam;
    if (toExists) toCurrency.value = toParam;
  }

  if (!route.query.from && props.baseCurrency) {
    fromCurrency.value = props.baseCurrency;
  }

  convertFromSource();
  loadHistoryFromLocalStorage();
}

onMounted(init);

watch(() => props.baseCurrency, () => {
  init();
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
$breakpoint-mobile: 768px;

.convert-view {
  &__header {
    text-align: center;
    margin-bottom: 2rem;
  }

  &__title {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
    color: $dark-text-primary;
  }

  &__subtitle {
    color: $dark-text-secondary;
    font-size: 1rem;
  }
}

.converter {
  margin-bottom: 3rem;

  &__card {
    background-color: $dark-bg-secondary;
    border-radius: 12px;
    padding: 2rem;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
    max-width: 600px;
    margin: 0 auto;

    @media (max-width: $breakpoint-mobile) {
      padding: 1.5rem;
    }
  }

  &__row {
    display: flex;
    margin-bottom: 1.5rem;
    gap: 1.5rem;

    @media (max-width: $breakpoint-mobile) {
      flex-direction: column;
      gap: 1rem;
    }
  }

  &__currency-wrapper, &__amount-wrapper {
    flex: 1;
  }

  &__label {
    display: block;
    margin-bottom: 0.5rem;
    color: $dark-text-secondary;
    font-size: 0.875rem;
  }

  &__currency-select {
    width: 100%;
    background-color: $dark-bg-tertiary;
    color: $dark-text-primary;
    border: 1px solid $dark-divider;
    border-radius: 4px;
    padding: 0.75rem 1rem;
    font-size: 1rem;
    transition: border-color 0.3s ease;
    outline: none;
    cursor: pointer;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='rgba(255, 255, 255, 0.7)' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 0.7rem center;
    background-size: 1.2em;

    &:focus {
      border-color: $accent-light;
    }

    option {
      background-color: $dark-bg-secondary;
    }
  }

  &__switch {
    display: flex;
    justify-content: center;
    margin: -0.5rem 0 1.5rem;
  }

  &__switch-btn {
    background-color: $dark-bg-tertiary;
    border: none;
    border-radius: 50px;
    padding: 0.6rem 1.5rem;
    color: $dark-text-primary;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.3s ease;
    display: flex;
    align-items: center;

    &:hover {
      background-color: $accent-dark;
    }
  }

  &__switch-icon {
    margin-right: 0.5rem;
    font-size: 1.25rem;
  }

  &__info {
    border-top: 1px solid $dark-divider;
    padding-top: 1.5rem;
    margin-top: 1rem;
  }

  &__rate {
    color: $dark-text-secondary;
    font-size: 0.875rem;
    margin-bottom: 0.5rem;
  }

  &__update {
    color: $dark-text-disabled;
    font-size: 0.75rem;
  }
}

.conversion-history {
  background-color: $dark-bg-secondary;
  border-radius: 12px;
  padding: 2rem;
  max-width: 600px;
  margin: 0 auto;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);

  &__title {
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 1.5rem;
    color: $dark-text-primary;
  }

  &__content {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  &__item {
    padding: 1rem;
    background-color: $dark-bg-tertiary;
    border-radius: 8px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    @media (max-width: $breakpoint-mobile) {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.5rem;
    }
  }

  &__operation {
    color: $dark-text-primary;
    font-weight: 500;
  }

  &__date {
    color: $dark-text-secondary;
    font-size: 0.875rem;
  }

  &__empty {
    padding: 2rem 0;
    text-align: center;
  }

  &__empty-text {
    color: $dark-text-secondary;
    font-size: 1.125rem;
  }
}
</style>
