import jwt from 'jsonwebtoken';

const auth = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ msg: 'No token, access denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // decoded = { id: user._id }
    next();
  } catch (err) {
    console.error('❌ Invalid Token:', err.message);
    res.status(401).json({ msg: 'Invalid token' });
  }
};

export default auth;