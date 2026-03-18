"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import { useRouter } from "next/navigation";

const menuItems = [
  { name: "Dashboard", path: "/secure-admin-login/dashboard", icon: "📊" },
  { name: "Ürünler", path: "/secure-admin-login/products", icon: "📦" },
  { name: "Kategoriler", path: "/secure-admin-login/categories", icon: "📁" },
  { name: "Site İçeriği", path: "/secure-admin-login/site-content", icon: "🌐" },
  { name: "Mesajlar", path: "/secure-admin-login/messages", icon: "✉️" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/secure-admin-login");
  };

  return (
    <aside className="w-64 bg-zinc-50 border-r border-gray-200 h-screen sticky top-0 flex flex-col p-6 shadow-sm">
      <div className="mb-10 flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-black text-white shadow-md">
          A
        </div>
        <span className="text-xl font-black text-gray-900 tracking-tight">AZT Admin</span>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all font-bold ${
                isActive
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                  : "text-gray-800 hover:bg-gray-100 hover:text-blue-600"
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="pt-8 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-4 px-4 py-3 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-xl transition-all font-bold shadow-sm"
        >
          <span>🚪</span>
          Çıkış Yap
        </button>
      </div>
    </aside>
  );
}
