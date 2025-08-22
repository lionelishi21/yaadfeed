import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth';

// Generate static params for static export
export async function generateStaticParams() {
  return [
    { nextauth: ['signin'] },
    { nextauth: ['signout'] },
    { nextauth: ['callback'] }
  ];
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }; 