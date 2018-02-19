<template>
    <app-layout-minimal>
      <div class="row justify-content-md-center">
        <div class="col-sm-12 col-md-8 col-lg-4 colorme mt-5">
          <app-card contextual-style="dark" class="app-card">
            <div slot="body">

              <form @submit.prevent="login">
                <div class="form-group">
                  <div class="input-group mb-3">
                    <div class="input-group-prepend">
                      <span class="input-group-text input-dropdown">
                        <i class="fa fa-envelope fa-fw"></i>
                      </span>
                    </div>
                    <input
                      :value="email"
                      @input="updateEmail"
                      type="email"
                      placeholder="Email"
                      class="form-control input-field mr-3"
                    >
                  </div>
                </div>
                <div class="form-group">
                  <div class="input-group">
                    <div class="input-group-prepend">
                      <span class="input-group-text input-dropdown">
                        <i class="fa fa-lock fa-fw"></i>
                      </span>
                    </div>
                    <input
                      :value="password"
                      @input="updatePassword"
                      type="password"
                      placeholder="Password"
                      class="form-control input-field mr-3"
                    >
                  </div>
                </div>
                <div class="form-group pull-right mr-3">
                  <button :disabled="!email || !password" class="btn btn-outline-primary button-other">
                    Login
                  </button>
                </div>
              </form>
            </div>
          </app-card>
        </div>
      </div>
    </app-layout-minimal>
</template>

<script>
import _ from 'lodash';
import { mapGetters } from 'vuex';
import LayoutMinimal from '../layout/minimal.vue';
import Card from '../components/card.vue';

export default {
  name: 'app-login',
  components: {
    'app-layout-minimal': LayoutMinimal,
    'app-card': Card,
  },
  computed: {
    ...mapGetters('auth', ['email', 'password']),
  },
  methods: {
    updateEmail: _.debounce(function (ev) {
      this.$store.dispatch('auth/updateEmail', ev.target.value);
    }, 500),
    updatePassword: _.debounce(function (ev) {
      this.$store.dispatch('auth/updatePassword', ev.target.value);
    }, 500),
    login() {
      this.$store.dispatch('auth/login');
    },
  },

};
</script>

<style scoped>
#login-error {
  color:red;
  margin-left:10px;
  margin-top:1px;
}
.service-card {
  margin-top:40px;
}
.input-dropdown {
  border: 0 none;
}
.input-field {
  border: 0 none;
}
.button-other {
  background-color: blue;
  color: white;
  font-size: 20px;
}
:focus {
    outline: 0;
    /* or */
    outline: none;
}
</style>
