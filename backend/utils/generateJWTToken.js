import jwt from 'jsonwebtoken';

export const generateJWTToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d"
  });

  // Set cookie options based on environment
  const isProduction = process.env.NODE_ENV === 'production';
  
  res.cookie('token', token, {
    httpOnly: true, // cookie cannot be accessed by client side scripts
    secure: isProduction, // only use HTTPS in production
    sameSite: isProduction ? 'none' : 'strict', // cross-site cookie in production
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    domain: isProduction ? process.env.COOKIE_DOMAIN : undefined // Use custom domain in production if needed
  });

  return token;
}