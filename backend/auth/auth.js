import jwt from "jsonwebtoken";

const generateAccessToken = async (user) => {
  const token = jwt.sign({ id: user.id, username: user.username }, "123", {
    expiresIn: "1h",
  });
  return token;
};

const generateRefreshToken = async (user) => {
  const token = jwt.sign({ id: user.id, username: user.username }, "123", {
    expiresIn: "7d",
  });
  return token;
};

export { generateAccessToken, generateRefreshToken };
