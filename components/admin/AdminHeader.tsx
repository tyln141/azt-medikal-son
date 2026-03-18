"use client";

import { useAuth } from "./AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import { useRouter } from "next/navigation";

export default function AdminHeader() {
  const { user } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/secure-admin-login");
  };

  return (
    <header className="bg-white border-b border-gray-100 flex items-center justify-between px-8 h-20 shadow-sm sticky top-0 z-40">
      <div className="flex items-center gap-4 text-sm text-gray-500 font-medium">
        <span>Yönetim Paneli</span>
        <span className="w-1 h-1 rounded-full bg-gray-300" />
        <span className="text-gray-900">{user?.email}</span>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-zinc-100 rounded-full flex items-center justify-center text-zinc-500">
             👤
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-bold text-gray-900 leading-none mb-1">Admin</p>
            <p className="text-xs text-gray-500 font-medium leading-none">{user?.email}</p>
          </div>
        </div>
        
        <button
          onClick={handleLogout}
          className="bg-zinc-50 hover:bg-red-50 text-gray-600 hover:text-red-500 px-4 py-2 rounded-xl transition-all font-bold text-sm border border-gray-100"
        >
          Çıkış
        </button>
      </div>
    </header>
  );
}
