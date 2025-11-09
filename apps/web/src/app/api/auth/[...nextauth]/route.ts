import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

// Mock user database (MVP only - replace with real DB later)
// Note: In the dev server this is in-memory and resets on restart.
const MOCK_USERS: Array<{ id: string; email: string; name: string; wallet_address: string | null; password?: string }>= [
  {
    id: '1',
    email: 'demo@yggdrasil.io',
    // For MVP we don't verify this hash; we accept the plain password below.
    name: 'Demo User',
    wallet_address: null,
    password: 'demo123',
  },
];

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'demo@yggdrasil.io' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email và password không được để trống');
        }

        const email = credentials.email.toLowerCase().trim();
        const password = String(credentials.password);

        // 1) Happy path for the baked-in demo account
        if (email === 'demo@yggdrasil.io' && password === 'demo123') {
          return {
            id: '1',
            email,
            name: 'Demo User',
            wallet_address: null,
          } as any;
        }

        // 2) MVP fallback: accept any non-empty credentials and create an in-memory user
        // This unlocks the register flow without a real database.
        const MIN_PASS = 5;
        if (password.length < MIN_PASS) {
          throw new Error(`Mật khẩu tối thiểu ${MIN_PASS} ký tự`);
        }

        let user = MOCK_USERS.find((u) => u.email === email);
        if (!user) {
          user = {
            id: `${MOCK_USERS.length + 1}`,
            email,
            name: email.split('@')[0] || 'User',
            wallet_address: null,
            password,
          };
          MOCK_USERS.push(user);
        }

        // In MVP we don't enforce password matching for existing records created above.
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          wallet_address: user.wallet_address,
        } as any;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.wallet_address = (user as any).wallet_address;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).email = token.email;
        (session.user as any).name = token.name;
        (session.user as any).wallet_address = token.wallet_address;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
