import dotenv from 'dotenv';
dotenv.config({ path: './config.env' });

const environment = {
  port: parseInt(process.env.PORT, 10) || 3002,
  nodeEnv: process.env.NODE_ENV || 'production',
  clientDomain: process.env.CLIENT_DOMAIN,
  saltRounds: parseInt(process.env.SALT_ROUNDS),
  jwtAccessTokenSecret: process.env.JWT_ACCESS_TOKEN_SECRET,
  jwtRefreshTokenSecret: process.env.JWT_REFRESH_TOKEN_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN,
  emailFrom: process.env.EMAIL_FROM,
  emailUsername: process.env.EMAIL_USERNAME,
  emailPassword: process.env.EMAIL_PASSWORD,
  emailHost: process.env.EMAIL_HOST,
  emailPort: process.env.EMAIL_PORT,
  dbPassword: process.env.DATABASE_PASSWORD,
  db: process.env.DATABASE,
};

export default environment;
