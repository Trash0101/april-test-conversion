<template>
  <div class="home-view">
    <section class="home-view__header">
      <h1 class="home-view__title">Курсы валют</h1>
      <p class="home-view__subtitle">Актуальные курсы валют относительно {{ baseCurrency }}</p>
    </section>

    <section class="exchange-rates">
      <div class="exchange-rates__filters">
        <div class="exchange-rates__search">
          <input
            type="text"
            class="exchange-rates__search-input"
            placeholder="Поиск валюты..."
            v-model="searchQuery"
          />
        </div>
      </div>

      <div class="exchange-rates__container">
        <div
          v-for="currency in filteredCurrencies"
          :key="currency.code"
          class="exchange-card"
        >
          <div class="exchange-card__header">
            <div class="exchange-card__currency-code">{{ currency.code }}</div>
            <div class="exchange-card__currency-name">{{ currency.name }}</div>
          </div>
          <div class="exchange-card__rate">
            <div class="exchange-card__rate-value">{{ formatRate(getRate(currency.code)) }}</div>
            <div class="exchange-card__rate-base">{{ baseCurrency }}</div>
          </div>
          <div class="exchange-card__footer">
            <div class="exchange-card__conversion">
              1 {{ currency.code }} = {{ formatRate(getRate(currency.code)) }} {{ baseCurrency }}
            </div>
            <router-link :to="`/convert?from=${currency.code}&to=${baseCurrency}`" class="exchange-card__convert-btn">
              Конвертировать
            </router-link>
          </div>
        </div>
      </div>

      <div v-if="filteredCurrencies.length === 0" class="exchange-rates__empty">
        <p class="exchange-rates__empty-text">Валюты не найдены</p>
      </div>
    </section>

    <section class="info-block">
      <h2 class="info-block__title">Как пользоваться сервисом?</h2>
      <div class="info-block__content">
        <div class="info-block__item">
          <div class="info-block__icon">1</div>
          <div class="info-block__text">
            <h3 class="info-block__subtitle">Выберите основную валюту</h3>
            <p>В верхней части сайта вы можете выбрать основную валюту для отображения курсов</p>
          </div>
        </div>
        <div class="info-block__item">
          <div class="info-block__icon">2</div>
          <div class="info-block__text">
            <h3 class="info-block__subtitle">Просмотрите курсы валют</h3>
            <p>На главной странице отображаются актуальные курсы популярных валют</p>
          </div>
        </div>
        <div class="info-block__item">
          <div class="info-block__icon">3</div>
          <div class="info-block__text">
            <h3 class="info-block__subtitle">Выполните конвертацию</h3>
            <p>Перейдите на страницу конвертации, чтобы рассчитать точную сумму в нужной валюте</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed,  } from 'vue'
import type CurrencyInfo from "@/types/CurrencyInfo.ts";
import {CURRENCIES_TITLES} from "@/consts/CURRENCIES.ts";

const props = defineProps<{
  baseCurrency: string;
  rates: CurrencyInfo
}>()

const searchQuery = ref('')
const currencies = ref(CURRENCIES_TITLES)

const filteredCurrencies = computed(() => {
  const query = searchQuery.value.toLowerCase()
  return currencies.value
    .filter(currency => currency.code !== props.baseCurrency)
    .filter(currency => {
      return (
        currency.code.toLowerCase().includes(query) ||
        currency.name.toLowerCase().includes(query)
      )
    })
})

const getRate = (currencyCode: string) => {
  return props.rates[currencyCode][props.baseCurrency]
}

const formatRate = (rate: number) => {
  return rate.toFixed(2)
}
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
$card-bg: #1e1e1e;
$card-hover-bg: #2d2d2d;
$breakpoint-mobile: 768px;
$breakpoint-tablet: 1024px;

.home-view {
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

.exchange-rates {
  margin-bottom: 3rem;

  &__filters {
    margin-bottom: 1.5rem;
  }

  &__search {
    max-width: 400px;
    margin: 0 auto;
  }

  &__search-input {
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
  }

  &__container {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    gap: 1rem;

    @media (min-width: $breakpoint-mobile) {
      grid-template-columns: repeat(2, 1fr);
    }

    @media (min-width: $breakpoint-tablet) {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  &__empty {
    padding: 3rem 0;
    text-align: center;
  }

  &__empty-text {
    color: $dark-text-secondary;
    font-size: 1.125rem;
  }
}

.exchange-card {
  background-color: $card-bg;
  border-radius: 8px;
  padding: 1.5rem;
  transition: background-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  &:hover {
    background-color: $card-hover-bg;
    transform: translateY(-5px);
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
  }

  &__header {
    margin-bottom: 1.5rem;
  }

  &__currency-code {
    font-size: 1.5rem;
    font-weight: 700;
    color: $accent-light;
    margin-bottom: 0.25rem;
  }

  &__currency-name {
    color: $dark-text-secondary;
    font-size: 0.875rem;
  }

  &__rate {
    display: flex;
    align-items: baseline;
    margin-bottom: 1.5rem;
  }

  &__rate-value {
    font-size: 2rem;
    font-weight: 700;
    color: $dark-text-primary;
    margin-right: 0.5rem;
  }

  &__rate-base {
    font-size: 1rem;
    color: $dark-text-secondary;
  }

  &__footer {
    display: flex;
    flex-direction: column;
  }

  &__conversion {
    font-size: 0.875rem;
    color: $dark-text-secondary;
    margin-bottom: 1rem;
  }

  &__convert-btn {
    display: inline-block;
    background-color: $accent-color;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 0.75rem 1rem;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    text-align: center;
    text-decoration: none;
    transition: background-color 0.3s ease;

    &:hover {
      background-color: $accent-dark;
    }
  }
}

.info-block {
  background-color: $dark-bg-secondary;
  border-radius: 8px;
  padding: 2rem;
  margin-top: 3rem;

  &__title {
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 1.5rem;
    text-align: center;
    color: $dark-text-primary;
  }

  &__content {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    gap: 1.5rem;

    @media (min-width: $breakpoint-mobile) {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  &__item {
    display: flex;
    align-items: flex-start;
  }

  &__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    background-color: $accent-color;
    color: white;
    font-weight: 700;
    border-radius: 50%;
    margin-right: 1rem;
    flex-shrink: 0;
  }

  &__text {
    flex: 1;
  }

  &__subtitle {
    font-size: 1.125rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: $dark-text-primary;
  }

  &__text p {
    color: $dark-text-secondary;
    font-size: 0.875rem;
    line-height: 1.5;
  }
}
</style>
