import Vue from 'vue';
import { sync } from 'vuex-router-sync';
import VueCurrencyFilter from 'vue-currency-filter';

// CSS
import 'bootstrap/dist/css/bootstrap.css';
import 'font-awesome/css/font-awesome.css';
import 'animate.css';

import './notification';
import store from './store';
import router from './router';
import App from './components/app.vue';

Vue.use(VueCurrencyFilter, {
  symbol: '',
  thousandsSeparator: ',',
  fractionCount: 2,
  fractionSeparator: '.',
  symbolPosition: 'front',
  symbolSpacing: true,
});

// hookup router <--> store
sync(store, router, { moduleName: 'router' });

Vue.config.productionTip = false;

new Vue({ // eslint-disable-line no-new
  el: '#app',
  store,
  router,
  template: '<App/>',
  components: { App },
});
