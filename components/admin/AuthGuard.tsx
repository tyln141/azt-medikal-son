"use client";

import { useAuth } from "./AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Only protect routes under /secure-admin-login
    if (pathname.startsWith("/secure-admin-login")) {
      if (!loading && !user && pathname !== "/secure-admin-login") {
        router.push("/secure-admin-login");
      }
      if (!loading && user && pathname === "/secure-admin-login") {
        router.push("/secure-admin-login/dashboard");
      }
    }
  }, [user, loading, router, pathname]);

  if (loading && pathname.startsWith("/secure-admin-login")) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Allow children if not in admin path or if authenticated
  if (pathname.startsWith("/secure-admin-login") && !user && pathname !== "/secure-admin-login") {
    return null;
  }

  return <>{children}</>;
}
