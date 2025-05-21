const jwt = require('jsonwebtoken');

exports.protect = (roles = []) => {
  return (req, res, next) => {
    const auth = req.headers.authorization;
    if (!auth) return res.status(401).json({ message: 'No token' });

    try {
      const decoded = jwt.verify(auth.split(" ")[1], process.env.JWT_SECRET);

      if (!roles.includes(decoded.role)) {
        console.log("❌ Access denied. Role not allowed.");
        return res.status(403).json({ message: 'Access denied' });
      }

      req.user = decoded;
      next();
    } catch (err) {
      console.log("❌ Token verification failed:", err.message);
      res.status(401).json({ message: 'Invalid token' });
    }
  };
};
