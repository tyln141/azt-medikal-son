"use client";

import { usePathname } from "next/navigation";
import { AuthProvider } from "@/components/admin/AuthContext";
import AuthGuard from "@/components/admin/AuthGuard";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";

function SidebarWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/secure-admin-login";

  if (isLoginPage) return <>{children}</>;

  return (
    <div className="flex bg-zinc-50 min-h-screen">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader />
        <main className="flex-1 overflow-auto">
          <div className="p-8 md:p-12 lg:p-16">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AuthGuard>
        <SidebarWrapper>{children}</SidebarWrapper>
      </AuthGuard>
    </AuthProvider>
  );
}
