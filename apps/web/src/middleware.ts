import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: '/login',
    },
  }
);

// Protect all routes in (app) group
export const config = {
  matcher: [
    '/(app)/:path*',
    '/catalog/:path*',
    '/scan/:path*',
    '/cart/:path*',
    '/account/:path*',
  ],
};
