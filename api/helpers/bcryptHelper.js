import bcrypt from 'bcryptjs';
import environment from '../../config/environment.js';

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(environment.saltRounds);
  return bcrypt.hash(password, salt);
};

const matchPassword = (password, dbPassword) => {
  return bcrypt.compare(password, dbPassword);
};

export { hashPassword, matchPassword };
