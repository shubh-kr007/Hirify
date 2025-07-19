import { verifyToken } from '@clerk/clerk-sdk-node';

const auth = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }
    
    const token = authHeader.replace('Bearer ', '');
    
    // Verify Clerk token
    const payload = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY
    });
    
    // Extract user ID from Clerk payload
    req.userId = payload.sub; // Clerk uses 'sub' for user ID
    
    // Debug log
    console.log('Authenticated user:', req.userId);
    
    next();
  } catch (error) {
    console.error('Auth error:', error);
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

export default auth;