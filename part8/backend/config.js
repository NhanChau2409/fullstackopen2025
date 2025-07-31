const dotenv = require("dotenv");
dotenv.config();

const getEnvironmentVariable = (key, defaultValue = null) => {
  const value = process.env[key];
  if (!value && defaultValue === null) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value || defaultValue;
};

const serverConfig = {
  database: {
    uri: getEnvironmentVariable("MONGODB_URI"),
  },
  server: {
    port: parseInt(getEnvironmentVariable("PORT", "4000")),
  },
  security: {
    jwtSecret: getEnvironmentVariable("JWT_SECRET", "your-secret-key"),
  },
};

module.exports = serverConfig;
