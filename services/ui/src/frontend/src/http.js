import Axios from 'axios';

import { API_ROUTE_PREFIX, API_CALL_TIMEOUT_MS } from './config';
import store from './store';

const axios = Axios.create({
  baseURL: API_ROUTE_PREFIX,
  timeout: API_CALL_TIMEOUT_MS,
});

// Default vars set up from localStorage (ie, user has come back)
/* eslint-disable no-undef */
const restoredAccessToken = localStorage.getItem('access_token');
axios.defaults.headers.common.Authorization = restoredAccessToken ? `Bearer ${restoredAccessToken}` : '';

axios.defaults.headers.common.Accept = 'application/json';

// catch authentication error to logout immediately
axios.interceptors.response.use(
  response => response.data,
  (error) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      if (error.response.status === 401) {
        // handle DeAuthentication
        store.dispatch('auth/logout');
      }

      return Promise.reject(error.response.data);
    }

    if (error.request) {
      // The request was made but no response was received
      return Promise.reject('no response received'); // eslint-disable-line
    }

    // Something happened in setting up the request that triggered an Error
    return Promise.reject(error.message);
  },
);

export default axios;
