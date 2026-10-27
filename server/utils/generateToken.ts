import jwt from 'jsonwebtoken';

export function generateToken(id: string, role: string): string {
  const secret = process.env.JWT_SECRET || 'agritech_jwt_secure_agricultural_secret_key_2026';
  return jwt.sign({ id, role }, secret, {
    expiresIn: '7d',
  });
}
