import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

// Generate a deterministic secret for Vercel if NEXTAUTH_SECRET is not set
// This is a fallback to prevent 500 errors, but a proper secret should be set in production
function getAuthSecret(): string {
  if (process.env.NEXTAUTH_SECRET) {
    return process.env.NEXTAUTH_SECRET;
  }
  
  // Fallback for development
  if (process.env.NODE_ENV === 'development') {
    return 'dev-secret-for-local-testing-only';
  }
  
  // Fallback for Vercel/production using deployment URL
  // This ensures the same secret across serverless function instances
  const vercelUrl = process.env.VERCEL_URL || process.env.NEXT_PUBLIC_VERCEL_URL;
  if (vercelUrl) {
    // Use a combination of URL and commit SHA for determinism
    const commitSha = process.env.VERCEL_GIT_COMMIT_SHA || 'no-commit';
    return `vercel-fallback-${vercelUrl}-${commitSha}`;
  }
  
  // Last resort
  console.warn('⚠️ NEXTAUTH_SECRET not set! Using unsafe fallback. Please set NEXTAUTH_SECRET environment variable.');
  return 'unsafe-fallback-secret-please-set-nextauth-secret';
}

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        // Simple validation - accept demo account or any email with password > 5 chars
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = credentials.email.toLowerCase().trim();
        const password = credentials.password;

        // Demo account
        if (email === 'demo@yggdrasil.io' && password === 'demo123') {
          return {
            id: '1',
            email: 'demo@yggdrasil.io',
            name: 'Demo User',
          };
        }

        // Accept any other email with password >= 5 chars
        if (password.length >= 5) {
          return {
            id: Date.now().toString(),
            email: email,
            name: email.split('@')[0],
          };
        }

        return null;
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
      }
      return session;
    },
  },
  secret: getAuthSecret(),
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
