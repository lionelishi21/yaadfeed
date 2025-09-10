'use client';

// Force dynamic rendering for admin pages
export const dynamic = 'force-dynamic';

import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  // Check if we're on the login page (support both with/without trailing slash)
  const isLoginPage = pathname === '/platform/admin' || pathname === '/platform/admin/';

  useEffect(() => {
    if (status === 'loading') return; // Still loading

    // Don't redirect if we're already on the login page
    if (isLoginPage) return;

    // Redirect to login if not authenticated
    if (status === 'unauthenticated') {
      router.push('/platform/admin/');
      return;
    }

    // Check for admin role
    if (session?.user && (session.user as any).role !== 'admin') {
      console.log('Access denied: User is not an admin');
      router.push('/platform/admin/');
      return;
    }
  }, [session, status, router, isLoginPage]);

  // If we're on the login page, just render the children (login form)
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Show loading while checking authentication
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  // Show login redirect message for unauthenticated users
  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Redirecting to admin login...</p>
        </div>
      </div>
    );
  }

  // Show access denied message for non-admin users
  if (session?.user && (session.user as any).role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Access denied. Admin privileges required.</p>
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  // Render admin layout for authenticated admin users
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <AdminSidebar />
      
      {/* Main Content */}
      <div className="flex-1">
        {/* Mobile Padding to account for mobile menu button */}
        <div className="lg:hidden h-16" />
        
        {/* Content Area */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
} 