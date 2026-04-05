import jwt from "jsonwebtoken";

const generateAccessToken = async (user) => {
  const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET) throw new Error("JWT_SECRET is not defined");

  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role, arenaId: user.arenaId }, 
    JWT_SECRET, 
    { expiresIn: "111h" } // Providing longer expiration for ease of testing
  );
  return token;
};

const generateRefreshToken = async (user) => {
  const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET) throw new Error("JWT_SECRET is not defined");

  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role, arenaId: user.arenaId }, 
    JWT_SECRET, 
    { expiresIn: "77d" }
  );
  return token;
};

export { generateAccessToken, generateRefreshToken };
