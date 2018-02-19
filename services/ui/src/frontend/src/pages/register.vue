<template>
    <app-layout-minimal>
      <div class="row justify-content-md-center">
        <div class="col-sm-12 col-md-8 col-lg-5">
          <app-card contextual-style="dark" class="app-card">
            <span slot="header">
              Register
            </span>
            <div slot="body">
              <form @submit.prevent="register">
                <div class="form-group">
                  <div class="input-group">
                    <div class="input-group-addon">
                      <i class="fa fa-envelope fa-fw"></i>
                    </div>
                    <input
                      :value="email"
                      @input="updateEmail"
                      type="email"
                      placeholder="Email"
                      class="form-control"
                    >
                  </div>
                </div>
                <div class="form-group">
                  <div class="input-group">
                    <div class="input-group-addon">
                      <i class="fa fa-lock fa-fw"></i>
                    </div>
                    <input
                      :value="password"
                      @input="updatePassword"
                      type="password"
                      placeholder="Password"
                      class="form-control"
                    >
                  </div>
                </div>
                <div class="form-group">
                  <div class="input-group">
                    <div class="input-group-addon">
                      <i class="fa fa-lock fa-fw"></i>
                    </div>
                    <input
                      :value="passwordConfirm"
                      @input="updatePasswordConfirm"
                      type="password"
                      placeholder="Confirm password"
                      class="form-control"
                    >
                  </div>
                </div>
                <div class="form-group">
                  <button :disabled="!email || !password || !passwordConfirm || password !== passwordConfirm" class="btn btn-outline-primary">
                    Register
                  </button>
                </div>
              </form>
            </div>
            <div slot="footer">
              Already got an account?
              <router-link :to="{ name: 'Login' }">Login</router-link>
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
  name: 'app-register',
  components: {
    'app-layout-minimal': LayoutMinimal,
    'app-card': Card,
  },
  computed: {
    ...mapGetters('auth', ['email', 'password', 'passwordConfirm']),
  },
  methods: {
    updateEmail: _.debounce(function (ev) {
      this.$store.dispatch('auth/updateEmail', ev.target.value);
    }, 500),
    updatePassword: _.debounce(function (ev) {
      this.$store.dispatch('auth/updatePassword', ev.target.value);
    }, 500),
    updatePasswordConfirm: _.debounce(function (ev) {
      this.$store.dispatch('auth/updatePasswordConfirm', ev.target.value);
    }, 500),
    register() {
      this.$store.dispatch('auth/register');
    },
  },
};
</script>

<style scoped>
.service-card {
  margin-top:40px;
}
</style>
