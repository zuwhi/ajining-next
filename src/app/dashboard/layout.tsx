"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "./components/Sidebar";
import { isAuthenticated } from "@/lib/auth";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [authStatus, setAuthStatus] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authenticated = await isAuthenticated();
        if (!authenticated) {
          // Redirect to login if not authenticated
          window.location.replace("/auth/login");
          return;
        }
        setAuthStatus(true);
        setIsLoading(false);
      } catch (error) {
        console.error("Auth check error:", error);
        // Redirect to login on error
        window.location.replace("/auth/login");
      }
    };

    checkAuth();
  }, []);

  // Show loading while checking auth
  if (isLoading) {
    return (
      <html lang="en">
        <body>
          <div className="flex h-screen w-full items-center justify-center bg-white">
            <div className="animate-pulse text-lg font-semibold text-teal-600">
              Memuat...
            </div>
          </div>
        </body>
      </html>
    );
  }

  // Don't render anything if not authenticated (will redirect)
  if (!authStatus) {
    return null;
  }

  return (
    <html lang="en">
      <body>
        <div className="min-h-screen bg-white font-sans text-gray-800">
          <div className="flex min-h-screen">
            <Sidebar />
            <main className="mt-0 min-h-screen w-full flex-1 bg-white p-2 md:p-6">
              <div className="mx-auto w-full max-w-6xl rounded-xl bg-white p-4 shadow-md transition-all md:p-8">
                {children}
              </div>
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
