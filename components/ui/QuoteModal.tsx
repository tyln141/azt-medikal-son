"use client";

import { useState } from "react";
import { messagesService } from "@/lib/services/messages";

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName?: string;
  lang: string;
}

export default function QuoteModal({ isOpen, onClose, productName, lang }: QuoteModalProps) {
  const t = (v: any, lang: string) => v?.[lang] || v?.tr || "";
  
  const T = {
    title: { tr: "Fiyat Teklifi Al", en: "Get a Quote", de: "Angebot einholen", fr: "Obtenir un devis" },
    success: { tr: "Başarılı!", en: "Success!", de: "Erfolg!", fr: "Succès!" },
    successDesc: { tr: "Talebiniz alınmıştır. En kısa sürede size dönüş yapacağız.", en: "Your request has been received. We will contact you soon.", de: "Ihre Anfrage wurde empfangen. Wir werden Sie bald kontaktieren.", fr: "Votre demande a été reçue. Nous vous contacterons bientôt." },
    name: { tr: "Ad Soyad", en: "Full Name", de: "Vollständiger Name", fr: "Nom complet" },
    email: { tr: "E-posta adresi", en: "Email Address", de: "E-Mail", fr: "Adresse e-mail" },
    phone: { tr: "Telefon Numarası", en: "Phone Number", de: "Telefonnummer", fr: "Numéro tel" },
    message: { tr: "Mesajınız", en: "Your Message", de: "Ihre Nachricht", fr: "Votre message" },
    sending: { tr: "Gönderiliyor...", en: "Sending...", de: "Senden...", fr: "Envoi en cours..." },
    submit: { tr: "Teklif İsteğini Gönder", en: "Send Quote Request", de: "Angebotsanfrage senden", fr: "Envoyer la demande" },
    error: { tr: "Mesaj gönderilemedi. Lütfen tekrar deneyin.", en: "Failed to send message. Please try again.", de: "Nachricht konnte nicht gesendet werden. Bitte versuchen Sie es erneut.", fr: "Échec de l'envoi du message. Veuillez réessayer." }
  };

  const getDefMessage = () => {
     const defaults = {
        tr: `Merhaba, ${productName} ürünü için fiyat teklifi almak istiyorum.`,
        en: `Hello, I would like to get a price quote for the ${productName} product.`,
        de: `Hallo, ich möchte ein Preisangebot für das Produkt ${productName} erhalten.`,
        fr: `Bonjour, je voudrais obtenir un devis pour le produit ${productName}.`
     } as any;
     return productName ? (defaults[lang] || defaults["tr"]) : "";
  };

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: getDefMessage(),
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await messagesService.create({
        ...formData,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
      });
      setIsSuccess(true);
      setTimeout(() => {
        onClose();
        setIsSuccess(false);
        setFormData({ name: "", email: "", phone: "", message: "" });
      }, 2000);
    } catch (error) {
      alert(t(T.error, lang));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-md">
      <div className="bg-white rounded-[2rem] w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-300 border border-gray-100">
        <div className="p-8 sm:p-10">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-3xl font-black text-gray-900 tracking-tight">{t(T.title, lang)}</h3>
            <button onClick={onClose} className="w-10 h-10 bg-gray-50 flex items-center justify-center rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-200 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          {isSuccess ? (
            <div className="text-center py-12 animate-in slide-in-from-bottom-4">
              <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 text-green-500 shadow-inner">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
              </div>
              <h4 className="text-2xl font-black text-gray-900 mb-3">{t(T.success, lang)}</h4>
              <p className="text-gray-600 font-medium text-lg">{t(T.successDesc, lang)}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">{t(T.name, lang)}</label>
                <input
                  required
                  type="text"
                  className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-none focus:ring-4 focus:ring-blue-500/20 text-gray-900 font-medium outline-none transition-all placeholder-gray-400"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">{t(T.email, lang)}</label>
                  <input
                    required
                    type="email"
                    className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-none focus:ring-4 focus:ring-blue-500/20 text-gray-900 font-medium outline-none transition-all placeholder-gray-400"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">{t(T.phone, lang)}</label>
                  <input
                    required
                    type="tel"
                    className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-none focus:ring-4 focus:ring-blue-500/20 text-gray-900 font-medium outline-none transition-all placeholder-gray-400"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">{t(T.message, lang)}</label>
                <textarea
                  required
                  rows={4}
                  className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-none focus:ring-4 focus:ring-blue-500/20 text-gray-900 font-medium outline-none transition-all resize-none placeholder-gray-400"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />
              </div>
              <button
                disabled={isSubmitting}
                type="submit"
                className="w-full bg-blue-600 text-white py-4 mt-4 rounded-2xl font-black text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100"
              >
                {isSubmitting ? t(T.sending, lang) : t(T.submit, lang)}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
