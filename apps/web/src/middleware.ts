// Middleware temporarily disabled for auth debugging
// Will re-enable after confirming basic auth works

export { default } from 'next-auth/middleware';

export const config = {
  matcher: [], // Disable all middleware temporarily
};
