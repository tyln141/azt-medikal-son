"use client";

import useSWR from "swr";
import { productsService } from "@/lib/services/products";
import { categoriesService } from "@/lib/services/categories";
import { messagesService } from "@/lib/services/messages";
import Link from "next/link";

export default function AdminDashboard() {
  const { data: products } = useSWR("products", () => productsService.getAll());
  const { data: categories } = useSWR("categories", () => categoriesService.getAll());
  const { data: messages } = useSWR("messages", () => messagesService.getAll());

  const unreadMessagesCount = (messages || []).filter(m => !m.isRead).length;

  const stats = [
    { name: "Ürünler", value: products?.length || 0, color: "bg-blue-600", link: "/secure-admin-login/products" },
    { name: "Kategoriler", value: categories?.length || 0, color: "bg-purple-600", link: "/secure-admin-login/categories" },
    { name: "Okunmamış Mesajlar", value: unreadMessagesCount, color: "bg-amber-600", link: "/secure-admin-login/messages" },
  ];

  return (
    <div className="pb-20">
      <div className="mb-12">
        <h1 className="text-5xl font-black text-black mb-3 tracking-tight">Yönetim Paneli</h1>
        <p className="text-gray-900 text-lg font-bold">AZT Medikal dijital varlıklarını buradan kontrol edin.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {stats.map((stat) => (
          <Link 
            key={stat.name} 
            href={stat.link}
            className="bg-white p-10 rounded-[40px] shadow-2xl border border-gray-100 hover:scale-[1.02] transition-all group relative overflow-hidden"
          >
            <div className={`absolute top-0 left-0 w-2 h-full ${stat.color} opacity-80`} />
            <h3 className="text-gray-900 font-black text-xs uppercase tracking-[0.2em] mb-4 opacity-70">{stat.name}</h3>
            <p className="text-6xl font-black text-black tracking-tighter">{stat.value}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 bg-white rounded-[40px] p-12 border border-gray-100 shadow-2xl">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-black text-black">Son Eklenen Ürünler</h2>
            <Link href="/secure-admin-login/products" className="bg-zinc-100 px-6 py-3 rounded-xl text-black font-black text-xs uppercase tracking-widest hover:bg-black hover:text-white transition-all">
              TÜMÜNÜ GÖR
            </Link>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-gray-900 text-xs uppercase font-black tracking-widest border-b-2 border-zinc-100">
                  <th className="pb-6">Ürün İsmi</th>
                  <th className="pb-6">Kategori</th>
                  <th className="pb-6 text-right">Durum</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50">
                {(products || []).slice(0, 5).map((product) => (
                  <tr key={product.id} className="group hover:bg-zinc-50/50 transition-all">
                    <td className="py-6 font-black text-gray-900 text-lg">{product.name?.tr || "İsimsiz"}</td>
                    <td className="py-6">
                      <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-[10px] font-black uppercase border border-blue-100">
                        {categories?.find(c => c.id === product.categoryId)?.name?.tr || "Kategorisiz"}
                      </span>
                    </td>
                    <td className="py-6 text-right">
                      <Link 
                        href={`/secure-admin-login/products`}
                        className="text-gray-900 font-black text-xs uppercase tracking-widest hover:underline decoration-2"
                      >
                        DÜZENLE
                      </Link>
                    </td>
                  </tr>
                ))}
                {(products || []).length === 0 && (
                  <tr>
                    <td colSpan={3} className="py-12 text-center text-gray-900 font-black italic">
                      Henüz ürün eklenmemiş.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-zinc-900 rounded-[40px] p-12 shadow-2xl text-white flex flex-col justify-between">
          <div>
            <h2 className="text-3xl font-black mb-8 border-b border-white/10 pb-6 uppercase tracking-tight">Hızlı Menü</h2>
            <div className="flex flex-col gap-4">
              <Link href="/secure-admin-login/products" className="p-6 bg-white/5 rounded-2xl hover:bg-white hover:text-black font-black transition-all flex items-center justify-between group uppercase text-sm tracking-widest">
                Ürün Ekle
                <span className="text-2xl group-hover:translate-x-2 transition-transform">→</span>
              </Link>
              <Link href="/secure-admin-login/categories" className="p-6 bg-white/5 rounded-2xl hover:bg-white hover:text-black font-black transition-all flex items-center justify-between group uppercase text-sm tracking-widest">
                Kategoriler
                <span className="text-2xl group-hover:translate-x-2 transition-transform">→</span>
              </Link>
              <Link href="/secure-admin-login/site-content" className="p-6 bg-white/5 rounded-2xl hover:bg-white hover:text-black font-black transition-all flex items-center justify-between group uppercase text-sm tracking-widest">
                Site İçeriği
                <span className="text-2xl group-hover:translate-x-2 transition-transform">→</span>
              </Link>
            </div>
          </div>
          <div className="mt-12 pt-10 border-t border-white/10">
             <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em]">Sürüm 1.5.0 Production Ready</p>
          </div>
        </div>
      </div>
    </div>
  );
}
