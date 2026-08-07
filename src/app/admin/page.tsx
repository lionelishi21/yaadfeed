import { NewsService } from '@/lib/mongodb';
import Link from 'next/link';

export default async function AdminDashboardPage() {
  const allArticles = await NewsService.getAllNews({ status: 'all', limit: 1000 });
  const publishedCount = allArticles.filter(a => a.status !== 'draft').length;
  const draftCount = allArticles.filter(a => a.status === 'draft').length;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
          <h3 className="text-gray-400 text-sm uppercase font-semibold mb-2">Total Published</h3>
          <p className="text-4xl font-bold text-white">{publishedCount}</p>
        </div>
        
        <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
          <h3 className="text-gray-400 text-sm uppercase font-semibold mb-2">Pending Drafts</h3>
          <p className="text-4xl font-bold text-yellow-500">{draftCount}</p>
        </div>
      </div>

      <div className="flex gap-4">
        <Link 
          href="/admin/articles/new" 
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition"
        >
          Create New Article
        </Link>
        <Link 
          href="/admin/articles" 
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition"
        >
          Manage Articles
        </Link>
      </div>
    </div>
  );
}
