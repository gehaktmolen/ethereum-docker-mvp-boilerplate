<template>
  <div class="nav-wrapper">
    <div class="container">
      <nav class="navbar navbar-expand-lg navbar-light">

        <button class="navbar-toggler" type="button" @click="menuCollapse">
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse lessnavbar" :class="{ show : menuCollapsed}">
          <ul class="navbar-nav mr-auto">
            <router-link :to="{ name: 'Home' }" active-class="active" class="nav-item" tag="li">
              <a class="nav-link">
                Home
              </a>
            </router-link>
          </ul>

          <span class="navbar-text ml-5" v-if="authenticated" @click.prevent="logout">
            <div class="m-3">
              Logout
              <i class="fa fa-sign-out colortext" aria-hidden="true"></i>
            </div>
          </span>
        </div>
      </nav>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'app-navbar',
  computed: {
    ...mapGetters('auth', ['email', 'authenticated']),
    ...mapGetters('ui', ['menuCollapsed']),
  },
  methods: {
    menuCollapse() {
      this.$store.dispatch('ui/collapseMenu');
    },
    logout() {
      this.$store.dispatch('auth/logout');
    },
  },
};
</script>

<style scoped>
.active .nav-link {
  text-decoration: underline;
}
.lessnavbar {
  height: 52px;
}
.meninblack {
  color: black;
  font-weight: bold;
}
</style>
