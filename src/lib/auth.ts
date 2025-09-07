import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import TwitterProvider from 'next-auth/providers/twitter';
import FacebookProvider from 'next-auth/providers/facebook';
import CredentialsProvider from 'next-auth/providers/credentials';
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import bcrypt from 'bcryptjs';
import { UserService } from './mongodb';
import { clientPromise } from './mongodb';

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise as any),
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Admin Login',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const user = await UserService.getUserByEmail(credentials.email);
          
          if (!user) {
            return null;
          }

          const isValidPassword = await bcrypt.compare(credentials.password, user.password);
          
          if (!isValidPassword) {
            return null;
          }

          if (!user.isActive) {
            return null;
          }

          // Update last login
          await UserService.updateLastLogin(user.email);

          return {
            id: user._id!.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
          } as any;
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    TwitterProvider({
      clientId: process.env.TWITTER_CLIENT_ID || '',
      clientSecret: process.env.TWITTER_CLIENT_SECRET || '',
      version: "2.0", // opt-in to Twitter OAuth 2.0
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID || '',
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET || '',
    }),
  ],
  // Use default NextAuth pages to avoid custom sign-in redirects causing loops
  // pages: {
  //   signIn: '/platform/admin',
  //   error: '/auth/error',
  // },
  callbacks: {
    async session({ session, user, token }) {
      if (session.user) {
        if ((token as any)?.role) {
          // For credentials login
          (session.user as any).id = (token as any).id;
          (session.user as any).role = (token as any).role;
        } else if (user) {
          // For database sessions
          (session.user as any).id = (user as any).id;
          // For social logins, default to 'user' role
          (session.user as any).role = 'user';
        }
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        (token as any).id = (user as any).id;
        (token as any).role = (user as any).role || 'user';
      }
      return token;
    },
  },
  session: {
    strategy: 'jwt', // Use JWT for credentials provider
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
};

export default authOptions; 