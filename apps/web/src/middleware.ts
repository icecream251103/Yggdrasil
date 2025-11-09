import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        // Allow access if token exists
        return !!token;
      },
    },
    pages: {
      signIn: '/login',
    },
  }
);

// Protect all routes in (app) group
export const config = {
  matcher: [
    '/home/:path*',
    '/catalog/:path*',
    '/scan/:path*',
    '/cart/:path*',
    '/account/:path*',
  ],
};
