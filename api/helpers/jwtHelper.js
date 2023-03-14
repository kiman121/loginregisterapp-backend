import jwt from 'jsonwebtoken';
import environment from '../../config/environment.js';

const { jwtAccessTokenSecret, jwtExpiresIn } = environment;

const generateToken = (id) => {
  return jwt.sign({ id }, jwtAccessTokenSecret, { expiresIn: jwtExpiresIn });
};

const validateToken = (token) => {
  return jwt.verify(token, jwtAccessTokenSecret);
};

export { generateToken, validateToken };
