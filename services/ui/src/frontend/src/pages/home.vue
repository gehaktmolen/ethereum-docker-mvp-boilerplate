<template>
  <app-layout-full>
    <app-card contextual-style="dark">
      <div slot="body">
        <div class="row">
          <div class="content" v-if="choices">

            <h2>Which city do you like the most?</h2>

            <ul>
              <li v-for="choice in choices" v-bind:class="{ active: currentChoice === choice }">
                <button :disabled="currentChoice === choice" @click="setVote(choice)">
                  {{choice.choiceName}} ({{choice.choiceVoteCount}} votes)
                </button>
              </li>
            </ul>

            <button class="submitBtn" :disabled="!currentChoice" @click="submitVote()">
              SUBMIT
            </button>

          </div>
        </div>
      </div>
    </app-card>
  </app-layout-full>
</template>

<script>
import { mapGetters } from 'vuex';
import LayoutFull from '../layout/full.vue';
import Card from '../components/card.vue';

export default {
  name: 'app-home',
  components: {
    'app-layout-full': LayoutFull,
    'app-card': Card,
  },
  computed: {
    ...mapGetters('voting', ['choices', 'currentChoice']),
  },
  methods: {
    setVote(choice) {
      this.$store.dispatch('voting/updateChoice', { choice });
    },
    submitVote() {
      this.$store.dispatch('voting/submitChoice');
    },
  },
};
</script>

<style scoped>
.service-card {
  margin-top:40px;
}
.active button {
  background-color: #FF7F00 !important;
  color: white;
}
.content ul {
  list-style-type: none;
}
.content h2 {
  margin-bottom:30px;
}
.content button {
  background-color: white;
  border: 0 none;
  padding:10px;
  font-size:20px;
}
.content {
  max-width:600px;
  margin: 0 auto;
}
.content button.submitBtn {
  background-color: #4df047;
  float:right;
}
.content button.submitBtn:disabled {
  display:none;
}
</style>
