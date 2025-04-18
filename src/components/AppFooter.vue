<template>
  <footer class="footer">
    <div class="footer__container">
      <p class="footer__copyright">© {{ new Date().getFullYear() }} CurrencyExchange. Все права защищены.(нет)</p>
    </div>
  </footer>
</template>

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

.footer {
  background-color: $dark-bg-secondary;
  padding: 1.5rem 0;

  &__container {
    width: 100%;
    max-width: $max-content-width;
    margin: 0 auto;
    padding: 0 1rem;
  }

  &__copyright {
    color: $dark-text-secondary;
    font-size: 0.875rem;
    text-align: center;
  }
}
</style>
