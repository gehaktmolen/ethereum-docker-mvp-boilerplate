import Vue from 'vue';
import VueRouter from 'vue-router';

import Login from './pages/login.vue';
import Register from './pages/register.vue';
import Home from './pages/home.vue';

Vue.use(VueRouter);

const router = new VueRouter({
  routes: [
    {
      path: '/register',
      name: 'Register',
      meta: { title: 'Register', guest: true },
      component: Register,
    },
    {
      path: '/login',
      name: 'Login',
      meta: { title: 'Login', guest: true },
      component: Login,
    },
    {
      path: '/',
      name: 'Home',
      meta: { title: 'Home', auth: true },
      component: Home,
    },
    {
      path: '*',
      redirect: '/',
    },
  ],
});

router.beforeEach((to, from, next) => {
  window.document.title = to.meta.title; // eslint-disable-line no-undef
  next();
});

// NOTE: using localStorage below because at page load the store is not yet
// initialized, and to prevent a redirect to Login we fetch the info from
// localStorage, which is initialized at boot

router.beforeEach((to, from, next) => {
  // eslint-disable-next-line no-undef
  if (to.matched.some(m => m.meta.auth) && !localStorage.getItem('access_token')) {
    /*
     * If the user is not authenticated and visits
     * a page that requires authentication, redirect to the login page
     */
    next({ name: 'Login' });

    // eslint-disable-next-line no-undef
  } else if (to.matched.some(m => m.meta.guest) && localStorage.getItem('access_token')) {
    /*
     * If the user is authenticated and visits
     * an guest page, redirect to the dashboard page
     */
    next({ name: 'Home' });
  } else {
    next();
  }
});

export default router;
