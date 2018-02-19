<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import { CHECK_AUTH_INTERVAL_MS } from '../config';

export default {
  name: 'app',
  data() {
    return {
      checkAuthIntervalRef: null,
    };
  },
  created() {
    this.$store.dispatch('voting/boot');
  },
  mounted() {
    const fn = () => {
      this.$store.dispatch('auth/checkAuth');
    };

    this.checkAuthIntervalRef = setInterval(fn, +CHECK_AUTH_INTERVAL_MS);
    fn(); // exec immediately at page enter
  },
  beforeDestroy() {
    clearInterval(this.checkAuthIntervalRef);
  },
};
</script>
