"use client";

import { useState } from "react";
import useSWR from "swr";
import { messagesService } from "@/lib/services/messages";
import { Message } from "@/types";

export default function MessagesPage() {
  const { data: messages, mutate } = useSWR("messages", () => messagesService.getAll());
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  const handleOpenMessage = async (msg: Message) => {
    setSelectedMessage(msg);
    if (!msg.isRead) {
      await messagesService.markAsRead(msg.id);
      mutate();
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Bu mesajı silmek istediğinize emin misiniz?")) return;
    try {
      await messagesService.delete(id);
      mutate();
      if (selectedMessage?.id === id) setSelectedMessage(null);
    } catch (error) {
      console.error(error);
    }
  };

  const sortedMessages = (messages || []).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-4xl font-black text-black mb-2">Mesajlar</h1>
        <p className="text-gray-700 font-medium">Müşterilerden gelen tüm mesajları ve teklif isteklerini yönetin.</p>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden text-sm font-medium">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-zinc-50 border-b">
              <tr className="text-xs uppercase font-black text-gray-700 tracking-widest">
                <th className="px-8 py-5 w-16">Durum</th>
                <th className="px-8 py-5">Gönderen</th>
                <th className="px-8 py-5">Konu / Mesaj</th>
                <th className="px-8 py-5">Tarih</th>
                <th className="px-8 py-5 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sortedMessages.map((msg) => (
                <tr 
                  key={msg.id} 
                  onClick={() => handleOpenMessage(msg)}
                  className={`hover:bg-zinc-50 transition-colors cursor-pointer group ${!msg.isRead ? "bg-blue-50/50" : ""}`}
                >
                  <td className="px-8 py-5">
                    {!msg.isRead && (
                      <div className="w-3 h-3 bg-red-600 rounded-full shadow-lg shadow-red-500/40" />
                    )}
                  </td>
                  <td className="px-8 py-5">
                    <p className={`font-black uppercase tracking-tight ${!msg.isRead ? "text-black" : "text-gray-700"}`}>{msg.name}</p>
                    <p className="text-xs text-gray-500 font-bold">{msg.email}</p>
                  </td>
                  <td className="px-8 py-5 max-w-md truncate text-gray-900 font-bold">
                    {msg.message}
                  </td>
                  <td className="px-8 py-5 text-xs text-black font-black uppercase tracking-tighter">
                    {msg.createdAt ? new Date(msg.createdAt).toLocaleDateString("tr-TR", { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : "-"}
                  </td>
                  <td className="px-8 py-5 text-right">
                     <button
                        onClick={(e) => handleDelete(msg.id, e)}
                        className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all opacity-0 group-hover:opacity-100 border border-red-100"
                     >
                        🗑️
                     </button>
                  </td>
                </tr>
              ))}
              {sortedMessages.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center text-gray-900 italic font-black">
                     Henüz bir mesaj bulunmamaktadır.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Message Detail Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="p-10">
              <div className="flex justify-between items-start mb-10">
                <div>
                  <h2 className="text-3xl font-black text-gray-900 mb-2">{selectedMessage.name}</h2>
                  <p className="text-blue-600 font-bold">{selectedMessage.email} • {selectedMessage.phone}</p>
                </div>
                <button 
                  onClick={() => setSelectedMessage(null)}
                  className="p-3 bg-zinc-100 rounded-2xl hover:bg-zinc-200 transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="bg-zinc-50 rounded-3xl p-8 mb-10 border border-gray-100 min-h-[200px]">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap font-medium">
                  {selectedMessage.message}
                </p>
              </div>

              <div className="flex gap-4">
                <a
                  href={`mailto:${selectedMessage.email}?subject=AZT Medikal Geri Dönüş`}
                  className="flex-1 bg-zinc-900 text-white py-5 rounded-2xl font-black text-center hover:bg-black transition-all shadow-xl shadow-zinc-900/20 active:scale-[0.98]"
                >
                  Cevapla (Email Gönder)
                </a>
                <button
                  onClick={(e) => handleDelete(selectedMessage.id, e as any)}
                  className="px-8 bg-red-50 text-red-600 py-5 rounded-2xl font-black hover:bg-red-600 hover:text-white transition-all active:scale-[0.98]"
                >
                  Sil
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
