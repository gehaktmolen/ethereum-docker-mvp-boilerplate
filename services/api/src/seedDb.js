/* eslint-disable no-underscore-dangle */
const User = require('./models/user');

const { hashPassword } = require('./crypto');

const {
  ROOT_EMAIL,
  ROOT_PASSWORD,
} = process.env;

const seed = async () => {
  const rootUser = await User.findOne({ email: ROOT_EMAIL });

  if (!rootUser) {
    await User.create({
      email: ROOT_EMAIL,
      password: await hashPassword(ROOT_PASSWORD),
      role: 'admin',
    });
  }
};

seed();
