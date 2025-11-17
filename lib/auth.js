import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';
const JWT_EXPIRES = process.env.JWT_EXPIRES || '7d';

if (!JWT_SECRET && process.env.NODE_ENV !== 'production') {
  console.warn('[auth] JWT_SECRET not set, using development fallback. Do NOT use in production.');
}

export const hashPassword = async (plaintext) => {
  if (typeof plaintext !== 'string' || plaintext.length < 6) {
    throw new Error('Password must be a string with at least 6 characters.');
  }
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(plaintext, salt);
};

export const comparePassword = async (plaintext, hash) => {
  if (!plaintext || !hash) return false;
  try {
    return await bcrypt.compare(plaintext, hash);
  } catch (err) {
    console.error('[auth.comparePassword]', err);
    return false;
  }
};

export const signJwt = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES });
};

export const verifyJwt = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    // explicit, consistent error shape
    const error = new Error('Invalid or expired token');
    error.code = 'INVALID_TOKEN';
    throw error;
  }
};
