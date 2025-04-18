<template>
  <div class="app app--dark">
    <AppHeader v-model:currency="baseCurrency" :available-currencies="availableCurrencies" />
    <main class="main">
      <div class="main__container">
        <router-view :baseCurrency="baseCurrency" :rates="exchangeRates" />
      </div>
    </main>
    <AppFooter/>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import AppFooter from "@/components/AppFooter.vue";
import AppHeader from "@/components/AppHeader.vue";
import type CurrencyInfo from "@/types/CurrencyInfo.ts";
import {CURRENCIES_EXC_RATES} from "@/consts/CURRENCIES.ts";

const availableCurrencies = ref([
  { code: 'RUB', name: 'Российский рубль' },
  { code: 'USD', name: 'Доллар США' },
  { code: 'EUR', name: 'Евро' },
])

const exchangeRates = ref<CurrencyInfo>(CURRENCIES_EXC_RATES)

const baseCurrency = ref('RUB')

const fetchExchangeRate = async () => {
  const res = await fetch('https://status.neuralgeneration.com/api/currency');
  const data = await res.json();
  const keys = Object.keys(data)
  if(keys.length !== 30) return;
  exchangeRates.value.RUB.USD = data["rub-usd"];
  exchangeRates.value.RUB.EUR = data["rub-eur"];
  exchangeRates.value.USD.RUB = data["usd-rub"];
  exchangeRates.value.USD.EUR = data["usd-eur"];
  exchangeRates.value.EUR.RUB = data["eur-rub"];
  exchangeRates.value.EUR.USD = data["eur-usd"];
}

onMounted(fetchExchangeRate)
</script>

<style lang="scss">
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
$header-height-mobile: 70px;
$header-height-desktop: 80px;
$max-content-width: 1200px;
$breakpoint-mobile: 768px;

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Roboto', 'Arial', sans-serif;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  &--dark {
    background-color: $dark-bg-primary;
    color: $dark-text-primary;
  }
}

.main {
  margin-top: $header-height-mobile;
  flex: 1;
  padding: 2rem 0;

  &__container {
    width: 100%;
    max-width: $max-content-width;
    margin: 0 auto;
    padding: 0 1rem;
  }

  @media (min-width: $breakpoint-mobile) {
    margin-top: $header-height-desktop;
  }
}
</style>
