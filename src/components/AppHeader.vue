<template>
  <header class="header">
    <div class="header__container">
      <div class="header__content">
        <div class="header__logo-wrapper">
          <img alt="Logo" class="header__logo" src="@/assets/logo.svg" width="32" height="32" />
          <span class="header__title">CurrencyExchange</span>
        </div>
        <nav class="nav">
          <button class="nav__toggle" @click="toggleMobileMenu">
            <span class="nav__toggle-text">Меню</span>
            <span class="nav__toggle-bar"></span>
            <span class="nav__toggle-bar"></span>
            <span class="nav__toggle-bar"></span>
          </button>
          <div class="nav__wrapper" :class="{ 'nav__wrapper--active': isMobileMenuOpen }">
            <ul class="nav__list">
              <li class="nav__item">
                <router-link class="nav__link" :class="{ 'nav__link--active': route.path === '/' }" to="/">Главная</router-link>
              </li>
              <li class="nav__item">
                <router-link class="nav__link" :class="{ 'nav__link--active': route.path === '/convert' }" to="/convert">Конвертация</router-link>
              </li>
            </ul>
            <div class="currency-selector">
              <span class="currency-selector__label">Основная валюта:</span>
              <select class="currency-selector__dropdown" :value="baseCurrency" @change="saveBaseCurrency($event.target.value)">
                <option v-for="currency in availableCurrencies" :key="currency.code" :value="currency.code">
                  {{ currency.code }} - {{ currency.name }}
                </option>
              </select>
            </div>
          </div>
        </nav>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import {RouterLink, useRoute, useRouter} from "vue-router";
import {onMounted, ref} from "vue";
import type CurrencyInfo from "@/types/CurrencyInfo.ts";

defineProps<{
  availableCurrencies: CurrencyInfo,
}>();

const baseCurrency = defineModel<string>('currency');

const router = useRouter()
const route = useRoute()

const mobileMenuOpen = ref(false);

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value;
};

const saveBaseCurrency = (currency: string) => {
  localStorage.setItem('baseCurrency', currency)
  baseCurrency.value = currency
  onBaseCurrencyChange()
}

const onBaseCurrencyChange = () => {
  if(route.name === 'convert') {
    router.replace({
      path: '/convert',
      query: {
        from: baseCurrency.value,
        to: baseCurrency.value,
      }
    })
  }
}

onMounted(() => {
  const savedCurrency = localStorage.getItem('baseCurrency')
  if (savedCurrency) {
    baseCurrency.value = savedCurrency
  }
})
</script>

<style scoped lang="scss">
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

.header {
  background-color: $dark-bg-secondary;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  height: $header-height-mobile;

  &__container {
    width: 100%;
    max-width: $max-content-width;
    margin: 0 auto;
    padding: 0 1rem;
  }

  &__content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: $header-height-mobile;
  }

  &__logo-wrapper {
    display: flex;
    align-items: center;
  }

  &__logo {
    display: block;
    margin-right: 1rem;
  }

  &__title {
    font-size: 1.25rem;
    font-weight: 700;
    color: $accent-light;
    display: none;

    @media (min-width: $breakpoint-mobile) {
      display: block;
    }
  }

  @media (min-width: $breakpoint-mobile) {
    height: $header-height-desktop;

    &__content {
      height: $header-height-desktop;
    }
  }
}

.nav {
  position: relative;

  &__toggle {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 30px;
    height: 21px;
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 0;
    z-index: 1100;

    @media (min-width: $breakpoint-mobile) {
      display: none;
    }
  }

  &__toggle-text {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }

  &__toggle-bar {
    height: 3px;
    width: 100%;
    background-color: $dark-text-primary;
    border-radius: 3px;
  }

  &__wrapper {
    display: flex;
    align-items: center;

    @media (max-width: $breakpoint-mobile - 1) {
      position: fixed;
      top: 0;
      right: -100%;
      width: 80%;
      height: 100vh;
      background-color: $dark-bg-secondary;
      flex-direction: column;
      padding: 80px 2rem 2rem;
      transition: right 0.3s ease;
      box-shadow: -2px 0 10px rgba(0, 0, 0, 0.5);
      justify-content: flex-start;
      align-items: flex-start;

      &--active {
        right: 0;
      }
    }
  }

  &__list {
    display: flex;
    list-style: none;
    margin: 0;
    padding: 0;

    @media (max-width: $breakpoint-mobile - 1) {
      flex-direction: column;
      width: 100%;
      margin-bottom: 2rem;
    }
  }

  &__item {
    margin: 0 0.5rem;

    @media (max-width: $breakpoint-mobile - 1) {
      margin: 0.5rem 0;
      width: 100%;
    }
  }

  &__link {
    display: block;
    padding: 0.5rem 1rem;
    color: $dark-text-secondary;
    text-decoration: none;
    font-weight: 500;
    transition: all 0.3s ease;
    border-radius: 4px;

    &:hover {
      color: $dark-text-primary;
      background-color: $dark-bg-tertiary;
    }

    &--active {
      color: $accent-light;
      position: relative;

      &:after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 1rem;
        right: 1rem;
        height: 2px;
        background-color: $accent-light;

        @media (max-width: $breakpoint-mobile - 1) {
          left: 0;
          right: 0;
          bottom: -2px;
        }
      }
    }

    @media (max-width: $breakpoint-mobile - 1) {
      font-size: 1.2rem;
      padding: 0.75rem 0;
      width: 100%;
    }
  }
}

.currency-selector {
  display: flex;
  align-items: center;
  margin-left: 1.5rem;

  &__label {
    margin-right: 0.5rem;
    color: $dark-text-secondary;
    font-size: 0.875rem;
  }

  &__dropdown {
    background-color: $dark-bg-tertiary;
    color: $dark-text-primary;
    border: 1px solid $dark-divider;
    border-radius: 4px;
    padding: 0.5rem;
    font-size: 0.875rem;
    cursor: pointer;
    outline: none;
    transition: border-color 0.3s ease;

    &:hover, &:focus {
      border-color: $accent-light;
    }

    option {
      background-color: $dark-bg-secondary;
    }
  }

  @media (max-width: $breakpoint-mobile - 1) {
    margin-left: 0;
    flex-direction: column;
    align-items: flex-start;
    width: 100%;

    &__label {
      margin-bottom: 0.5rem;
    }

    &__dropdown {
      width: 100%;
    }
  }
}
</style>
