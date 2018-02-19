import HTTP from '../../http';
import Notification from '../../notification';
import router from '../../router';

export const types = {
  UPDATE_EMAIL: 'UPDATE_EMAIL',
  CLEAR_EMAIL: 'CLEAR_EMAIL',
  UPDATE_PASSWORD: 'UPDATE_PASSWORD',
  CLEAR_PASSWORD: 'CLEAR_PASSWORD',
  UPDATE_PASSWORDCONFIRM: 'UPDATE_PASSWORDCONFIRM',
  CLEAR_PASSWORDCONFIRM: 'CLEAR_PASSWORDCONFIRM',
  SET_AUTHENTICATED: 'SET_AUTHENTICATED',
  SET_ACCESS_TOKEN: 'SET_ACCESS_TOKEN',
  CLEAR_ACCESS_TOKEN: 'CLEAR_ACCESS_TOKEN',
  SET_AUTH_ERROR: 'SET_AUTH_ERROR',
  CLEAR_AUTH_ERROR: 'CLEAR_AUTH_ERROR',
  SET_ERROR: 'SET_ERROR',
};

export default {
  namespaced: true,
  state: {
    email: '',
    password: '',
    error: '',
    passwordConfirm: '',
    authenticated: false,
    accessToken: null,
    booted: true,
  },
  getters: {
    email: state => state.email,
    error: state => state.error,
    password: state => state.password,
    passwordConfirm: state => state.passwordConfirm,
    authenticated: state => state.authenticated,
  },
  mutations: {
    // email
    [types.UPDATE_EMAIL](state, value) {
      state.email = value;
    },
    [types.CLEAR_EMAIL](state) {
      state.email = '';
    },

    // password
    [types.UPDATE_PASSWORD](state, value) {
      state.password = value;
    },
    [types.CLEAR_PASSWORD](state) {
      state.password = '';
    },

    // password confirm
    [types.UPDATE_PASSWORDCONFIRM](state, value) {
      state.passwordConfirm = value;
    },
    [types.CLEAR_PASSWORDCONFIRM](state) {
      state.passwordConfirm = '';
    },

    // auth token
    [types.SET_AUTHENTICATED](state, value) {
      state.authenticated = value;
    },

    // auth token
    [types.SET_ACCESS_TOKEN](state, accessToken) {
      state.accessToken = accessToken;
    },
    [types.CLEAR_ACCESS_TOKEN](state) {
      state.accessToken = null;
    },

    // boot
    [types.SET_BOOTED](state) {
      state.booted = true;
    },

    // error
    [types.SET_ERROR](state, error) {
      state.error = error;
    },
  },
  actions: {
    /**
     * updateEmail will update the email
     */
    updateEmail({ commit }, value) {
      commit(types.UPDATE_EMAIL, value);
    },

    /**
     * updatePassword will update the password
     */
    updatePassword({ commit }, value) {
      commit(types.UPDATE_PASSWORD, value);
    },

    /**
     * updatePasswordConfirm will update the password confirm
     */
    updatePasswordConfirm({ commit }, value) {
      commit(types.UPDATE_PASSWORDCONFIRM, value);
    },

    /**
     * checkAuth is called every 1 second to see if the browser is currently authenticated
     * by checking if there is an access_token in the localStorage, will update state
     * and current page accordingly
     */
    async checkAuth({ commit, state }) {
      //
      // TODO: use websockets! the below is using constant http polling
      //

      if (!state.booted) {
        // some bootup code?
        // nothing for now
      }

      const accessToken = localStorage.getItem('access_token'); // eslint-disable-line no-undef

      const currentPage = router.currentRoute.name;
      const currentlyAuthed = state.authenticated;

      if (accessToken && !currentlyAuthed) {
        // user when from logged out to logged in

        commit(types.SET_ACCESS_TOKEN, accessToken);
        commit(types.SET_AUTHENTICATED, true);

        HTTP.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

        // if user logged in in another browser tab, we need to fetch the email
        // by exchanging the accessToken for the user's email with the api
        const me = await HTTP.get('/me');
        commit(types.UPDATE_EMAIL, me.email);

        // if on login/register page but suddenly authed, redirect to home page
        // this will happen if logon happens in a different browser tab
        if (['Login', 'Register'].includes(currentPage)) {
          router.push({ name: 'Home' });
        }
      } else if (!accessToken && currentlyAuthed) {
        // user went from logged in to logged out
        commit(types.CLEAR_ACCESS_TOKEN);
        commit(types.SET_AUTHENTICATED, false);
        commit(types.CLEAR_EMAIL);

        localStorage.removeItem('access_token'); // eslint-disable-line no-undef
        HTTP.defaults.headers.common.Authorization = '';

        // if not on login page but suddenly not authed, redirect to login page
        // this will happen if logout happens in a different browser tab
        if (!['Login', 'Register'].includes(currentPage)) {
          router.push({ name: 'Login' });
        }
      }

      if (!state.booted) {
        commit(types.SET_BOOTED);
      }
    },
    /**
     * login will send a logon request to the server receiving an accessToken on success
     */
    async register({ state, commit }) {
      try {
        await HTTP.post('/register', { // eslint-disable-line no-undef
          email: state.email, password: state.password,
        });

        commit(types.CLEAR_EMAIL);
        commit(types.CLEAR_PASSWORD);
        commit(types.CLEAR_PASSWORDCONFIRM);

        Notification.showSuccess('Registered, please login');

        router.push({ name: 'Login' });
      } catch (error) {
        Notification.showError(error);
        commit(types.SET_ERROR, error);
      }
    },

    /**
     * login will send a logon request to the server receiving an accessToken on success
     */
    async login({ state, commit }) {
      try {
        const { accessToken } = await HTTP.post('/login', { // eslint-disable-line no-undef
          email: state.email, password: state.password,
        });

        commit(types.SET_ACCESS_TOKEN, accessToken);
        commit(types.SET_AUTHENTICATED, true);
        commit(types.UPDATE_EMAIL, state.email);
        commit(types.CLEAR_PASSWORD);

        localStorage.setItem('access_token', accessToken); // eslint-disable-line no-undef

        HTTP.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

        router.push({ name: 'Home' });
      } catch (error) {
        Notification.showError(error);
        commit(types.SET_ERROR, error);
      }
    },

    /**
     * logout will logout the user by removing the access token locally
     */
    logout({ commit }) {
      commit(types.CLEAR_ACCESS_TOKEN);
      commit(types.SET_AUTHENTICATED, false);
      commit(types.CLEAR_EMAIL);

      localStorage.removeItem('access_token'); // eslint-disable-line no-undef
      HTTP.defaults.headers.common.Authorization = '';

      router.push({ name: 'Login' });
    },
  },
};
