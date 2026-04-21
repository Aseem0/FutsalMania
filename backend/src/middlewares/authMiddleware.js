import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authentication required" });
  }

  const token = authHeader.split(" ")[1]?.trim();
  const JWT_SECRET = process.env.JWT_SECRET;
  
  if (!JWT_SECRET) {
     console.error("[AuthMiddleware] ❌ CRITICAL: JWT_SECRET is not defined in environment variables during request!");
     return res.status(500).json({ message: "Server configuration error" });
  }

  try {
    const decoded = jwt.verify(token.trim(), JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error(`[AuthMiddleware] ❌ Token Validation Failed: ${error.message}`);
    console.error(`[AuthMiddleware] Error Name: ${error.name}`);
    console.error(`[AuthMiddleware] Attempted Path: ${req.path}`);
    
    return res.status(401).json({ 
      message: "Authentication failed",
      error: error.message,
      code: error.name === "TokenExpiredError" ? "TOKEN_EXPIRED" : "INVALID_TOKEN"
    });
  }
};
