import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth';

// Generate static params for NextAuth catch-all route
export async function generateStaticParams() {
  return [
    { nextauth: ['signin'] },
    { nextauth: ['signout'] },
    { nextauth: ['callback'] },
    { nextauth: ['session'] },
    { nextauth: ['csrf'] },
    { nextauth: ['providers'] },
  ];
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
