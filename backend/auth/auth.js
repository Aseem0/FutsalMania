import jwt from "jsonwebtoken";

const generateAccessToken = async (user) => {
  const token = jwt.sign({ username: user.username }, "123", {
    expiresIn: "15min",
  });
  return token;
};

const generateRefreshToken = async (user) => {
  const token = jwt.sign({ username: user.username }, "123", {
    expiresIn: "7d",
  });
  return token;
};

export { generateAccessToken, generateRefreshToken };
