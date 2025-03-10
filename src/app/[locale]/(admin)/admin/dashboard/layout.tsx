'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const locale = params.locale || 'en';
  const router = useRouter();
  const {
    user,
    isCheckingAuth,
    isAuthenticatedAdmin,
    checkAdminAuth,
    checkAdminProfile,
  } = useAuthStore();

  // Check user authentication on mount.
  useEffect(() => {
    (async () => {
      await checkAdminAuth();
    })();
  }, [checkAdminAuth]);

  // Once authenticated, fetch the user profile to get the username.
  useEffect(() => {
    if (isAuthenticatedAdmin) {
      checkAdminProfile();
    }
  }, [isAuthenticatedAdmin, checkAdminProfile]);

  // Redirect to login if not authenticated once checking is complete.
  useEffect(() => {
    if (!isCheckingAuth && !isAuthenticatedAdmin) {
      router.push(`/${locale}/login`);
    }
  }, [isCheckingAuth, isAuthenticatedAdmin, router, locale]);

  // While waiting for the auth check to finish, show a loading indicator.
  if (isCheckingAuth) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-14">
      <div className="flex">
        {/* Main content area */}
        <main className="flex-1 p-6 sm:p-8">
          <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
            {user && (
              <h1 className="text-3xl font-bold text-black">
                {getGreeting()}, {user?.name?.split(' ')[0] || 'User'}
              </h1>
            )}
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
