import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let session = null;
  try {
    session = await getServerSession(authOptions);
  } catch (error) {
    console.error("Error fetching session in admin layout:", error);
  }

  if (!session?.user || (session.user as any).role !== 'admin') {
    redirect('/');
  }

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 p-6 flex flex-col">
        <h2 className="text-2xl font-bold text-yellow-500 mb-8">Admin Dash</h2>
        <nav className="flex-1 space-y-4">
          <Link href="/admin" className="block px-4 py-2 rounded hover:bg-gray-700 transition">
            Dashboard
          </Link>
          <Link href="/admin/articles" className="block px-4 py-2 rounded hover:bg-gray-700 transition">
            Articles
          </Link>
          <Link href="/admin/scraper" className="block px-4 py-2 rounded hover:bg-gray-700 transition">
            Scraper Tools
          </Link>
        </nav>
        <div className="mt-auto">
          <p className="text-sm text-gray-400">Logged in as:</p>
          <p className="text-sm font-semibold truncate">{session.user.email}</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  );
}
