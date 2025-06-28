import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(new Date(decoded.exp * 1000));
    req.userId = decoded.id; 
    console.log(req.userId);
    next();
  } catch (error) {
    console.log("token is failde : ",error);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
