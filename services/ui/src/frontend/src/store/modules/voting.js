/* eslint-disable no-await-in-loop, max-len, function-paren-newline */
/* eslint-disable */
import contract from 'truffle-contract';
import _ from 'lodash';
import Notification from '../../notification';
import web3 from '../../web3';
import SampleArtifact from '../../contracts/Sample.json';

const Sample = contract(SampleArtifact);

Sample.setProvider(web3.currentProvider);

const contractConn = new web3.eth.Contract(SampleArtifact.abi, {
  gasPrice: '20000000000', // default gas price in wei, 20 gwei in this case
});

export const types = {
  SET_CONTRACT_CONN: 'SET_CONTRACT_CONN',
  UPDATE_CHOICE: 'UPDATE_CHOICE',
  ADD_CHOICE: 'ADD_CHOICE',
  UPDATE_CHOICE_VOTES: 'UPDATE_CHOICE_VOTES',
  SUBMIT_CHOICE_SENT: 'SUBMIT_CHOICE_SENT',
  SUBMIT_CHOICE_CLEARED: 'SUBMIT_CHOICE_CLEARED',
  SUBMIT_CHOICE_ERROR: 'SUBMIT_CHOICE_ERROR',
};

export default {
  namespaced: true,
  state: {
    choices: [],
    currentChoice: '',
    contractConn: null,
  },
  getters: {
    choices: state => [...state.choices].sort((a, b) => b.choiceName <= a.choiceName),
    currentChoice: state => state.currentChoice,
  },
  mutations: {
    [types.ADD_CHOICE](state, choiceObj) {
      state.choices = [...state.choices, choiceObj];
    },
    [types.UPDATE_CHOICE](state, choice) {
      state.currentChoice = choice;
    },
    [types.UPDATE_CHOICE_VOTES](state, choiceObj) {
      state.choices = state.choices.map((choice) => (
        choice.choiceName !== choiceObj.choiceName ? choice : choiceObj
      ));
    },
    [types.SUBMIT_CHOICE_SENT](state) {
      state.submitSENT = true;
    },
    [types.SUBMIT_CHOICE_CLEARED](state) {
      state.submitSENT = false;
      state.currentChoice = '';
    },
    [types.SUBMIT_CHOICE_ERROR](state, error) {
      state.submitSENT = false;
      state.currentChoice = '';
      state.error = error;
    },
  },
  actions: {
    async boot({ commit }) {
      try {
        // initialize a contract instance so we can communicate with the smart contract
        // the contract should have been instantiated with arguments as defined in the deploy file
        const truffleCont = await Sample.deployed();
        // we only use truffle contract to get the address of the deployed contract,
        // we use that to instantiate a "web3 contract" instance.
        contractConn.options.address = truffleCont.address;

        const nrOfChoices = await contractConn.methods.choiceCount().call();

        // add all choices
        _.times(nrOfChoices, async (idx) => {
          const choiceName = await contractConn.methods.choices(idx).call({
            from: (await web3.eth.getAccounts())[0], // current active account in metamask
          });

          commit(types.ADD_CHOICE, {
            choiceName: web3.utils.toUtf8(choiceName),
            choiceVoteCount: await contractConn.methods.votesPerChoice(choiceName).call({
              from: (await web3.eth.getAccounts())[0], // current active account in metamask
            }),
          });
        });
      } catch (err) {
        Notification.showError(err);
        console.log(err);
      }
    },
    updateChoice({ commit }, { choice }) {
      commit(types.UPDATE_CHOICE, choice);
    },
    async submitChoice({ state, commit }) {
      contractConn.methods.vote(
        web3.utils.fromUtf8(state.currentChoice.choiceName),
      ).send({
        from: (await web3.eth.getAccounts())[0], // current active account in metamask
        value: web3.utils.toWei(new web3.utils.BN(1), 'ether'), // set default as 1 ether
      })
        .on('receipt', async (receipt) => {
          commit(types.UPDATE_CHOICE_VOTES, {
            choiceName: state.currentChoice.choiceName,
            choiceVoteCount: parseInt(receipt.events.LogChoiceMade.returnValues.choiceVoteCount, 10),
          });
          commit(types.SUBMIT_CHOICE_CLEARED);
        })
        .on('error', (err) => {
          Notification.showError(err);
          console.log(err);
          commit(types.SUBMIT_CHOICE_ERROR, { err });
        });
    },
  },
};
