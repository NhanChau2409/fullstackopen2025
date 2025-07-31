const jwt = require("jsonwebtoken");
const User = require("../models/User");
const config = require("../config");

const createAuthContext = async ({ req }) => {
  try {
    const authHeader = req ? req.headers.authorization : null;
    
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.substring(7);
      const decodedToken = jwt.verify(token, config.security.jwtSecret);
      const currentUser = await User.findById(decodedToken.id);
      
      return { currentUser };
    }
    
    return {};
  } catch (error) {
    console.error("Authentication context error:", error);
    return {};
  }
};

module.exports = createAuthContext; 