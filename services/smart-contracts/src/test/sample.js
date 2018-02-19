/* eslint-env node, mocha */

/* eslint-disable no-await-in-loop */

/*
  global
  artifacts:true,
  contract:true,
  assert:true,
*/

const Sample = artifacts.require('./Sample.sol');

contract('Sample', (accounts) => {
  const [creator, userOne, userTwo] = accounts; // eslint-disable-line no-unused-vars

  let instance;

  beforeEach(async () => {
    instance = await Sample.new('somestring', ['choiceA', 'choiceB', 'choiceX', 'choiceY'], { from: creator });
  });

  it('variables should be initialized to correct values', async () => {
    const [name, choiceCount] = await Promise.all([
      instance.name.call(),
      instance.choiceCount.call(),
    ]);

    assert(name === 'somestring', 'name should be set to the one we passed in when instantiating (sometring)');
    assert(choiceCount.eq(4), 'choice count should be equal to amount of choices we passed in (3)');

    for (let i = 0; i < choiceCount.toNumber(); i += 1) {
      const choiceNameBytes32 = await instance.choices.call(i);
      assert((await instance.votesPerChoice.call(choiceNameBytes32)).eq(0), 'votes of all movies should be zero');
    }
  });

  it('making a choice', async () => {
    const choiceVotesBefore = await instance.votesPerChoice.call('choiceA');
    await instance.vote('choiceA');
    const choiceVotesAfter = await instance.votesPerChoice.call('choiceA');

    assert(choiceVotesBefore.add(1).eq(choiceVotesAfter), 'votes for choiceA should have increased by 1');
  });
});
