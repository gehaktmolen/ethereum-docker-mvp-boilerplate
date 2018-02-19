/* eslint no-unused-vars: ["error", { "argsIgnorePattern": "next" }] */

const isEmail = require('isemail');
const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const jwt = require('jsonwebtoken');
const Web3 = require('web3');

const log = require('../logger');
const User = require('../models/user');

const { comparePassword, hashPassword } = require('../crypto');

const { API_SESSION_SECRET } = process.env;

/**
 * initialize passport in the express app
 *
 * @param {ExpressApp} app - an express app
 */
exports.init = (app) => {
  passport.use(new JwtStrategy({
    // extract jwt token from Authorization header (Bearer: ..)
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: API_SESSION_SECRET,
  }, async (jwtPayload, done) => {
    const foundUser = await User.findOne({ _id: jwtPayload.id });

    if (!foundUser) {
      done(new Error('user not found'));
    } else {
      done(null, foundUser);
    }
  }));

  app
    .use(passport.initialize())
    .use(passport.session());
};

/*
 *
 * Middleware
 *
 */

/**
 * express middleware to validate an email address
 *
 * @param {Request} req - express request object
 * @param {Response} res - express reqsponse object
 * @param {Next} next - express next callback
 */
exports.validateEmail = (req, res, next) => {
  if (!req.body.email) {
    next(new Error('missing email'));
  } else if (!isEmail.validate(req.body.email)) {
    next(new Error('invalid email'));
  } else {
    next();
  }
};

/**
 * express middleware to validate an ethereum address
 *
 * @param {Request} req - express request object
 * @param {Response} res - express reqsponse object
 * @param {Next} next - express next callback
 */
exports.validatePassword = (req, res, next) => {
  // TODO: force password complexity
  if (!req.body.password) {
    next(new Error('missing password'));
  } else {
    next();
  }
};

/**
 * express middleware that will authenticate a user, it will populate req.user
 * with the authenticated User mongoose instance
 */
exports.authenticate = passport.authenticate('jwt', { session: false });

/*
 *
 * Route Handlers
 *
 */

/**
 * POST /api/login
 *
 * @param {Request} req - express request object
 * @param {Response} res - express reqsponse object
 * @param {Next} next - express next callback
 */
exports.login = async (req, res, next) => {
  try {
    const foundUser = await User.findOne({ email: req.body.email });

    if (!foundUser || !(await comparePassword(req.body.password, foundUser.password))) {
      next(new Error('invalid credentials'));
    } else {
      res.json({
        amountSLQ: foundUser.amountSLQ,
        accessToken: jwt.sign({ id: foundUser.id }, API_SESSION_SECRET),
        testAddress: foundUser.testAddress,
        testPrivateKey: foundUser.testPrivateKey,
      });
    }
  } catch (err) {
    log.error(err);
    next(new Error('login error'));
  }
};

/**
 * POST /api/register
 *
 * @param {Request} req - express request object
 * @param {Response} res - express reqsponse object
 * @param {Next} next - express next callback
 */
exports.register = async (req, res, next) => {
  try {
    if (await User.findOne({ email: req.body.email })) {
      next(new Error('user already exists'));
    } else {
      const newUser = await User.create({
        email: req.body.email,
        password: await hashPassword(req.body.password),
        role: 'user',
      });
      await newUser.newKeyStore();
      await newUser.save();

      res.sendStatus(200);
    }
  } catch (err) {
    log.error(err);
    next(new Error('register error'));
  }
};

/* eslint-disable */
exports.test = async (req, res, next) => {
  const pe = req.user.getProviderEngine();
  const web3custom = new Web3(pe.engine);
  const web3 = new Web3(new Web3.providers.HttpProvider('http://ganache:8545'));

  // Give the keyStore 3 new accounts
  pe.setKeyStore(await pe.newAddress(3));

  web3.eth.getAccounts((err, acc) => {
    console.log('Ganache accounts', acc);
  });

  web3custom.eth.getAccounts((err, acc) => {
    console.log('User accounts', acc);

    web3.eth.sendTransaction({
      from: web3.eth.accounts[0],
      to: acc[0],
      value: web3.toWei('1', 'ether'),
    }, (errorTx, txHash) => {
      console.log('SEED TX', txHash, acc.length);
      web3custom.eth.sendTransaction({
        from: acc[0],
        to: acc[1],
        value: web3.toWei('0.5', 'ether'),
      }, (errorTx, txHash) => {
        console.log('CUSTOM SIGNED', txHash);
        web3custom.eth.getBalance(acc[1], (errBalance, balance) => {
          console.log(errBalance, balance.toString(10));
          res.json({});
        })
      });
    });
  });
};
/* eslint-enable */

/**
 * GET /api/me
 *
 * This route exists so that if you logon in browser tab 1, and you have the app
 * also open in browser tab 2, and browser tab 2 detects an access token in localStorage
 * then browser tab 2 can call this route to get the email belonging to the accessToken
 *
 * @param {Request} req - express request object
 * @param {Response} res - express reqsponse object
 * @param {Next} next - express next callback
 */
exports.getMe = async (req, res, next) => {
  // get user email based on his accessToken (logon in multiple tabs)
  res.json({
    email: req.user.email,
    amountSLQ: req.user.amountSLQ,
    testAddress: req.user.testAddress,
    testPrivateKey: req.user.testPrivateKey,
  });
};

// TODO: also allow authenticating using an API_KEY
