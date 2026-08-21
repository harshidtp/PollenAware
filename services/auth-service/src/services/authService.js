const bcrypt = require("bcryptjs");
const authRepository = require("../repositories/authRepository");
const jwt = require("jsonwebtoken");

const registerUser = async (userId, email, password) => {
  const existingUser = await authRepository.findByEmail(email);

  if (existingUser) {
    throw new Error("Email already registered");
  }

  const passwordHash = await bcrypt.hash(password, 12);

  return authRepository.createAuthUser(
    userId,
    email,
    passwordHash
  );
};

const loginUser = async (email, password) => {
  const user = await authRepository.findByEmail(email);

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const passwordValid = await bcrypt.compare(
    password,
    user.password_hash
  );

  if (!passwordValid) {
    throw new Error("Invalid email or password");
  }

  const token = jwt.sign(
    {
      userId: user.user_id,
      email: user.email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h",
    }
  );

  return {
    user: {
      id: user.id,
      userId: user.user_id,
      email: user.email,
    },
    token,
  };
};

module.exports = {
  registerUser,
  loginUser,
};