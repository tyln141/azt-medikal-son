"use client";

import React, { useState } from "react";
import { useContact } from "@/context/ContactContext";

interface ContactModalProps {
  lang: string;
}

export default function ContactModal({ lang }: ContactModalProps) {
  const { isOpen, closeModal } = useContact();
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  if (!isOpen) return null;

  const t = (v: any) => v?.[lang] || v?.tr || "";

  const T = {
    title: { tr: "Bize Ulaşın", en: "Contact Us", de: "Kontaktiere uns", fr: "Contactez-nous" },
    name: { tr: "Adınız", en: "Your Name", de: "Ihr Name", fr: "Votre nom" },
    email: { tr: "E-posta Adresiniz", en: "Your Email", de: "Ihre E-Mail", fr: "Votre e-mail" },
    message: { tr: "Mesajınız", en: "Your Message", de: "Ihre Nachricht", fr: "Votre message" },
    send: { tr: "Gönder", en: "Send", de: "Absenden", fr: "Envoyer" },
    success: { tr: "Mesajınız gönderildi!", en: "Message sent!", de: "Nachricht gesendet!", fr: "Message envoyé!" },
    close: { tr: "Kapat", en: "Close", de: "Schließen", fr: "Fermer" }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    // Simulate API call
    setTimeout(() => {
      setStatus("success");
      setFormData({ name: "", email: "", message: "" });
      setTimeout(() => {
        closeModal();
        setStatus("idle");
      }, 2000);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={closeModal}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden transform transition-all animate-in fade-in zoom-in duration-300">
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-black text-gray-900">{t(T.title)}</h2>
            <button 
              onClick={closeModal}
              className="p-2 hover:bg-zinc-100 rounded-xl transition-colors text-gray-800 hover:text-black font-bold"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {status === "success" ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto text-4xl">
                ✓
              </div>
              <p className="text-xl font-bold text-gray-900">{t(T.success)}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-black text-gray-800 uppercase tracking-widest mb-2">{t(T.name)}</label>
                <input
                  required
                  type="text"
                  className="w-full px-5 py-4 rounded-2xl border border-gray-300 bg-white text-gray-900 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-bold placeholder-gray-500"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-black text-gray-800 uppercase tracking-widest mb-2">{t(T.email)}</label>
                <input
                  required
                  type="email"
                  className="w-full px-5 py-4 rounded-2xl border border-gray-300 bg-white text-gray-900 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-bold placeholder-gray-500"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-black text-gray-800 uppercase tracking-widest mb-2">{t(T.message)}</label>
                <textarea
                  required
                  rows={4}
                  className="w-full px-5 py-4 rounded-2xl border border-gray-300 bg-white text-gray-900 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium placeholder-gray-500 resize-none"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />
              </div>

              <button
                disabled={status === "loading"}
                type="submit"
                className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black hover:bg-zinc-900 transition-all duration-300 shadow-lg shadow-blue-500/10 active:scale-95 text-sm uppercase tracking-wider"
              >
                {status === "loading" ? "..." : t(T.send)}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
