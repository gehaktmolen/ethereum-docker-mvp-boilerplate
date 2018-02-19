# ethereum-mvp-docker-boilerplate

This boilerplate consist of 6 applications, each running in its own docker container.

- `nginx`, reverse proxy
- `api`, node.js express serving handling api requests
- `ui`, webpack powered vue.js frontend
- `smart-contracts`, truffle repo with smart contracts
- `ganache`, simulated ethereum full node using `ganache-cli`
- `mongo`, mongodb database

There is a sample smart contract added called `Sample.sol`.

## Prerequisites

- `docker` (tested on `17.12.0-ce`)
- `node.js` (tested on `8.9.4`)
- Windows 🧙‍:  `node-gyp` requirements (see [here](https://github.com/nodejs/node-gyp#on-windows))
- [`metamask`](https://metamask.io) browser extension

## Install

```
git clone git@github.com:BlockChainCompany/ethereum-docker-mvp-boilerplate.git

cd ethereum-docker-mvp-boilerplate

npm run setup
```

## Setting up Metamask

The `ganache` container will use the same seed every time and therefore generate the same accounts every time it is run. The created accounts are:

```
Available Accounts
==================
(0) 0x30e2c0c9837c23d55fa1cbeb3e450d572bb1a0b1
(1) 0x7414fdde5fa406beebb1a54e418b468d6975b226
(2) 0xbfccbadf899efa8bacf30fa635168d2aaa3770e4
(3) 0x0505f8a99a74f58246be8ac87c7c86ace77e4e91
(4) 0x95e1a3fa2877efdfc394bbd2b64cc0e1b832edad
(5) 0x62b239a2dc79964911a64d7758676c7d8a57f3b9
(6) 0x06f3c5b202fbb7f2928fa5a1c7f1fb71c5ebb918
(7) 0xcc2e8ffac7202e68dfc271be5f511c20ed41b4db
(8) 0x8b31b3169f4f734010410b2a5b644f1f1a06474c
(9) 0xec77941503a6b5b6b77965b7edae23f92b51efb2

Private Keys
==================
(0) 0c81d795c749e4b21b18d049259fb5b9a06fecffd6bb5c1bb391ba2014035fc2
(1) 587fff42745223c3520b4b75eb5a52359894672916705213037e05d38cae02ef
(2) c0ba3250d283dcf009c214643acb216444f4eefd1068c5fc2abe9dc727a96b28
(3) 00f7c54f74f83e4adce888cd52faecd33f8ae2186b46f0f1affeb42fe33f3d74
(4) 287c84e47b1de24911a61ec907d8de9f51c25ca969c1606dacdd8686ee12fd78
(5) 48445c2fc315d283b3f53cd254ae8700c449aebc3632ba452fad7f0b5d842f11
(6) 797fc703af625330447dcde0f529a29963ea21d68c39ffe75801587feee0de9b
(7) b99533887ee9e0700d35d7dcd7e652312054ed3e24f759efe3388fb0bb2b310e
(8) 365957a6125cf8e0b6292a1ad61aa03259f7ebcaedf03522349d444c852c8440
(9) 56e1adfbb350a75c7ef914155b1af12aa72ddb3f0c9f5ff237b58397e0ba9b81
```

To setup metamask:

1. open metamask browser extension
2. switch to network `localhost:8545`
3. if this is the first time: import account (using one of the above "Private Keys")
4. set added account (step 3) as active/current account

#### known issues + solution

- if the `ganache` container is restarted, the nonce will be reset. If Metamask complains about a `"nonce mismatch"`, execute "reset account" in the Metamask browser plugin.
- if you restart the application and the ui still shows the old state instead of the new fresh contract state,
switch to a different network in the Metamask browser plugin (any will do), and then switch back to `localhost:8545`.

## Quickstart

```
npm run start

# open http://localhost in your browser
```

## Usage

Since we're using docker-compose to run all parts of the application, we have provided
a number of npm scripts that abstract away the execution of docker(-compose) command(s).

**The application will be served on http://localhost (port 80)**

#### starting/stopping
```
# starts the application
npm run start

# starts the application in detached mode
npm run start:detached

# restarts the application
npm run restart

# restarts the application (starts application in detached mode)
npm run restart:detached

# stops the application (either when it's running in detached mode or not)
npm run stop
```

#### smart-contracts container related

```
# run the smart contract tests using truffle
npm run test:smart-contracts

# create coverage-report using solidity-coverage, outputting the result in
# directory: services/smart-contracts/coverage-report
npm run test:coverage:smart-contracts

# lint smart contract(s) using solium
npm run lint:smart-contracts

# compile + deploy the smart-contracts, saves generated artifact files in
# directory: services/smart-contracts/src/build/contracts/
# NOTE: this is automatically called by the (re)start npm scripts
npm run deploy:smart-contracts
```

#### dropping into a shell in a running container

You can use docker to execute a command in a running container. A very useful one being: execute the `sh` command in running container X. We have provided npm scripts to drop into a shell in each running container.

```
# drop into a shell (sh) in the running api container
# NOTE: you can only enter a container which is running, which means you cannot
#       enter into the smart-contracts container, since it only deploys the contracts,
#       then exits
npm run entershell:api
```

#### viewing logs

Viewing the logs of each container can be achieved in 2 ways:

1. by using the provided npm scripts, e.g. `npm run logs:api`, `npm run logs:ui`.
2. by looking at the created log files in `logs/*.log` in the root of this repo (will be created on first run of app)

Besides getting all the logs of a container up until this moment using the npm script,
it's also possible to tail the logs of a container by appending `:tail` to the npm script command, e.g. `npm run logs:ui:tail`.

## Info per container

inside the containers `ui`, `api` and `smart-contracts` folder there is a `src/` directory. The contents of this entire folder will be mounted in the docker container. So if you want to add new folders/files, always place them **inside** the `src/` folder.

### container: nginx

- only used as a reverse proxy
- proxies all `/api/*` routes are proxied to the `api` container
- proxies all other routes are proxied to the `ui` container
- logs both access and error logs to stdout (so they show up in container logs)
- also logs to `logs/nginx.error.log` + `logs/nginx.access.log`
- exposes port `80` to serve the app
- exposes port `8545` which connects to the ganache container

### container: api

- node.js [`express`](https://github.com/expressjs/express) server which serves a REST api.
- uses [`nodemon`](https://github.com/remy/nodemon) to auto-restart on code changes
- uses passport + json webtokens for authentication
- smart contract truffle artifact files are automatically placed in `services/api/src/contracts/`
- logs to stdout + `logs/api.log`

### container: ui

- node.js webpack dev server which serves the vue.js frontend + static assets
- webpack will automatically reload the browser on code changes + akes use of hot-module reload
- smart contract truffle artifact files are automatically placed in `services/ui/src/frontend/src/contracts/`
- logs to stdout + `logs/ui.log`

### container: smart-contracts

- node.js [`truffle`](https://github.com/trufflesuite/truffle) project for writing/deploying/testing the solidity smart contracts
- makes use of [`solium`](https://github.com/duaraghav8/Solium) for linting of solidity smart contract files
- makes use of [`solidity-coverage`](https://github.com/sc-forks/solidity-coverage) to generate (istanbul) test coverage report
- whenever the npm script `deploy:smart-contracts` is executed, after the contracts have been deployed (truffle artifact files have been created), a node.js scripts (`scripts/move-contract-artifacts-to-ui-api.js`) will copy these newly created artifact files to both the `api` + `ui` folders.
- logs to stdout + `logs/smart-contracts.log`

### container: ganache-cli

- [`ganache-cli`](https://github.com/trufflesuite/ganache-cli) simulated ethereum node
- uses a seed to always get the same created accounts
- sets amount of ether for all created accounts to 100 million
- logs to stdout only (viewable in container logs)
- accessbile through nginx on port `8545` so you can connect Metamask

### container: mongo

- mongodb database
- exposes port `27017` to localhost so you can connect with MongoHub/RoboMongo/etc.
- logs to stdout + `logs/mongodb.log`
- mongo db data folder is mounted to host folder `/data/mongo`

## Other

#### why install dependencies on host if we're using docker?

Even though we use docker container to run our application, there are 2 reasons to also
install all npm dependencies locally:

1. This boilerplate makes use of an `eslint` precommit hook. This is setup in the root
`package.json` file. If you try to commit files of which an imported/required dependency
was not found in the corresponding `node_modules` folder, the precommit hook will
fail, telling you dependencies are missing. Therefore you should also install all dependencies
on the host.

2. Whenever you install new `npm` dependencies the package-lock.json file will be updated.

#### the usage of .env files

Each service contains an `.env.sample` file in its root folder. Whenever we run the application(s),
`docker-compose` will automatically look for a file named `.env` in the same folder as the used `Dockerfile`.
If it finds one it will read all env vars into the environment of the docker container (at runtime!). The applications will read from `process.env` to get all the set env vars from the `.env` file.

#### updating smart contracts while application is running

If you have updated a smart contract and want the ui/api to pick up these new/updated contracts, you should manually run `npm run deploy:smart-contracts`.

## Todo

- [ ] setup jest tests for ui container
- [ ] setup jest tests for api container
- [ ] add ipfs container
- [ ] enhance the example smart contract to one which also makes use of smart contract calls from the api container
- [ ] find out which container creates the `error.log` file in `logs/` and prevent it from showing up in `logs/`
- [ ] log ganache output to `logs/ganache.log`

## License

MIT
