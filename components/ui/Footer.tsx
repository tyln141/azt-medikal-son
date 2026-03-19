"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import useSWR from "swr";
import { siteContentService } from "@/lib/services/site-content";

export default function Footer() {
  const { lang: rawLang } = useParams();
  const lang = Array.isArray(rawLang) ? rawLang[0] : rawLang || "tr";
  const { data: content } = useSWR("site-content", () => siteContentService.getContent());
  
  const logo = content?.logo;
  const logoUrl = logo?.url;
  console.log("FOOTER CONTENT:", content?.footer);
  const t = (v: any, lang: string) => {
    if (!v) return "";
    if (typeof v === "string") return v;
    return v?.[lang] || v?.tr || "";
  };

  const T_MENU = { tr: "Hızlı Menü", en: "Quick Menu", de: "Schnellmenü", fr: "Menu rapide" };
  const T_CONTACT = { tr: "İletişim", en: "Contact", de: "Kontakt", fr: "Contact" };
  const T_SUBSCRIBE = { tr: "Bültene Üye Ol", en: "Subscribe to Newsletter", de: "Newsletter abonnieren", fr: "Abonnez-vous" };
  const T_EMAIL = { tr: "E-posta adresiniz", en: "Your email address", de: "Ihre E-Mail-Adresse", fr: "Votre e-mail" };
  const T_SEND = { tr: "Gönder", en: "Send", de: "Senden", fr: "Envoyer" };
  const T_HOME = { tr: "Ana Sayfa", en: "Home", de: "Startseite", fr: "Accueil" };
  const T_ABOUT = { tr: "Hakkımızda", en: "About", de: "Über Uns", fr: "À propos" };
  const T_CAT = { tr: "Ürünlerimiz", en: "Products", de: "Produkte", fr: "Produits" };
  
  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black text-white py-20 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
            <Link href={`/${lang}`} className="block mb-6 group">
              {logoUrl ? (
                <img 
                  src={logoUrl} 
                  alt="Logo" 
                  className="bg-white/10 backdrop-blur-md p-3 rounded-2xl shadow-xl border border-white/5 transition-transform duration-300 group-hover:scale-105" 
                  style={{ 
                    maxWidth: "160px",
                    width: logo?.width ? `${logo.width}px` : "auto",
                    height: logo?.height ? `${logo.height}px` : "auto",
                    objectFit: (logo?.objectFit as any) || "contain"
                  }} 
                />
              ) : (
                <h3 className="text-3xl font-black text-blue-500 tracking-tight">AZT MEDİKAL</h3>
              )}
            </Link>
            <p className="text-gray-400 leading-relaxed font-medium">
              {content?.footer?.description ? t(content.footer.description, lang) : ""}
            </p>
          </div>
          
          <div>
            <h4 className="text-xl font-bold mb-8 text-white">{t(T_MENU, lang)}</h4>
            <ul className="space-y-4 text-gray-400 font-medium">
              <li><Link href={`/${lang}`} className="hover:text-blue-400 transition-colors flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-500"/> {t(T_HOME, lang)}</Link></li>
              <li><Link href={`/${lang}/#about`} className="hover:text-blue-400 transition-colors flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-500"/> {t(T_ABOUT, lang)}</Link></li>
              <li><Link href={`/${lang}/#categories`} className="hover:text-blue-400 transition-colors flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-500"/> {t(T_CAT, lang)}</Link></li>
              <li><Link href={`/${lang}/#contact`} className="hover:text-blue-400 transition-colors flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-500"/> {t(T_CONTACT, lang)}</Link></li>
            </ul>
          </div>
          
          <div>
             <h4 className="text-xl font-bold mb-8 text-white">{t(T_CONTACT, lang)}</h4>
             <ul className="space-y-5 text-gray-400 font-medium">
                <li className="flex items-start gap-3">
                   <div className="bg-white/5 p-2 rounded-lg text-blue-400 mt-1">📍</div>
                   <span className="leading-relaxed">{content?.footer?.address ? t(content.footer.address, lang) : "Ankara, Türkiye"}</span>
                </li>
                <li className="flex items-center gap-3">
                   <div className="bg-white/5 p-2 rounded-lg text-blue-400">📞</div>
                   <span>{content?.footer?.phone ? t(content.footer.phone, lang) : "+90 5XX XXX XX XX"}</span>
                </li>
                <li className="flex items-center gap-3">
                   <div className="bg-white/5 p-2 rounded-lg text-blue-400">✉️</div>
                   <span>{content?.footer?.email ? t(content.footer.email, lang) : "info@aztmedikal.com"}</span>
                </li>
                <li className="flex items-start gap-3">
                   <div className="bg-white/5 p-2 rounded-lg text-blue-400 mt-1">🕒</div>
                   <span className="leading-relaxed">
                     {content?.footer?.workingHours ? t(content.footer.workingHours, lang) : "Hafta içi: 09:00 - 18:00\nHafta sonu: Kapalı"}
                   </span>
                </li>
             </ul>
          </div>
          
          <div>
            <h4 className="text-xl font-bold mb-8 text-white">{t(T_SUBSCRIBE, lang)}</h4>
            <div className="flex bg-white/10 p-1.5 rounded-2xl overflow-hidden border border-white/10 backdrop-blur-md group focus-within:ring-2 ring-blue-500 transition-all">
              <input type="email" placeholder={t(T_EMAIL, lang)} className="bg-transparent border-none focus:ring-0 px-4 py-3 w-full text-sm text-white placeholder-gray-500 outline-none" />
              <button className="bg-blue-600 text-white hover:bg-blue-700 px-6 font-bold rounded-xl transition-colors shadow-lg shadow-blue-600/20 active:scale-95">
                {t(T_SEND, lang)}
              </button>
            </div>
          </div>
        </div>
        
        <div className="border-t border-white/10 pt-10 mt-10 text-center text-gray-500 text-sm font-medium flex flex-col gap-2">
           <div>{content?.footer?.copyright ? t(content.footer.copyright, lang) : "© 2026 AZT Medikal. Tüm Hakları Saklıdır."}</div>
           {content?.footer?.poweredBy && (
             <div className="text-gray-600 text-xs">
               {t(content.footer.poweredBy, lang)}
             </div>
           )}
        </div>
      </div>
    </footer>
  );
}
