import jwt from 'jsonwebtoken';

export function requireAdmin(req, res, next) {
  const configuredAdminKey = process.env.ADMIN_API_KEY || 'Rare1357';
  const headerKey = req.headers['x-admin-key'];

  // Check API key header first
  if (headerKey && headerKey === configuredAdminKey) {
    return next();
  }

  // Check Bearer token
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    const jwtSecret = process.env.JWT_SECRET || 'rare_aesthetics_super_secret_jwt_key_2026';

    try {
      const decoded = jwt.verify(token, jwtSecret);
      req.user = decoded;
      return next();
    } catch {
      return res.status(401).json({ error: 'Invalid or expired authentication token' });
    }
  }

  return res.status(401).json({ error: 'Unauthorized: Admin authentication required' });
}
