// next-auth parses NEXTAUTH_URL when it is first imported and throws
// "Invalid URL" on an empty string, which turns every page that uses
// useSession into a 500 on the server. Fall back to the canonical site URL.
export function register() {
  if (!process.env.NEXTAUTH_URL) {
    process.env.NEXTAUTH_URL = 'https://www.yardvybz.news';
  }
}
