import jwt from 'jsonwebtoken';

interface TokenPayload {
  userId: string;
  email: string;
}

export const generateAccessToken = (payload: TokenPayload): string => {
  const secret = process.env.JWT_SECRET || 'fallback-secret-key';
  const expiresIn = process.env.JWT_ACCESS_EXPIRY || '15m';

  return jwt.sign(payload, secret, { expiresIn });
};

export const generateRefreshToken = (payload: TokenPayload): string => {
  const secret = process.env.JWT_REFRESH_SECRET || 'fallback-refresh-secret-key';
  const expiresIn = process.env.JWT_REFRESH_EXPIRY || '7d';

  return jwt.sign(payload, secret, { expiresIn });
};

export const verifyAccessToken = (token: string): TokenPayload => {
  const secret = process.env.JWT_SECRET || 'fallback-secret-key';
  
  try {
    const decoded = jwt.verify(token, secret) as TokenPayload;
    return decoded;
  } catch (error) {
    throw new Error('Invalid or expired access token');
  }
};

export const verifyRefreshToken = (token: string): TokenPayload => {
  const secret = process.env.JWT_REFRESH_SECRET || 'fallback-refresh-secret-key';
  
  try {
    const decoded = jwt.verify(token, secret) as TokenPayload;
    return decoded;
  } catch (error) {
    throw new Error('Invalid or expired refresh token');
  }
};


