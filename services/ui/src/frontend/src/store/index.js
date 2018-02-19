import Vue from 'vue';
import Vuex from 'vuex';
import createLogger from 'vuex/dist/logger';

import auth from './modules/auth';
import ui from './modules/ui';
import voting from './modules/voting';

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

export default new Vuex.Store({
  modules: { auth, ui, voting },
  strict: debug,
  plugins: debug ? [createLogger()] : [],
});
