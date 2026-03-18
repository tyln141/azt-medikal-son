"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import useSWR from "swr";
import { siteContentService } from "@/lib/services/site-content";
import { useContact } from "@/context/ContactContext";

const locales = [
  { code: "tr", name: "TR" },
  { code: "en", name: "EN" },
  { code: "de", name: "DE" },
  { code: "fr", name: "FR" },
];

export default function Header() {
  const { lang: rawLang } = useParams();
  const lang = Array.isArray(rawLang) ? rawLang[0] : rawLang || "tr";
  const pathname = usePathname();
  const { data: content } = useSWR("site-content", () => siteContentService.getContent());
  const { openModal } = useContact();
  
  const logo = content?.logo; // Could be object with {url, width, height, objectFit} or just {url}
  const logoUrl = logo?.url;

  const t = (v: any, lang: string) => v?.[lang] || v?.tr || "";

  const T_NAV = {
    home: { tr: "Ana Sayfa", en: "Home", de: "Startseite", fr: "Accueil" },
    about: { tr: "Hakkımızda", en: "About Us", de: "Über Uns", fr: "À propos" },
    categories: { tr: "Kategoriler", en: "Categories", de: "Kategorien", fr: "Catégories" },
    contact: { tr: "İletişim", en: "Contact", de: "Kontakt", fr: "Contact" }
  };

  const getLocalizedPath = (targetLang: string) => {
    const segments = pathname.split("/");
    if (segments.length > 1) {
       segments[1] = targetLang;
    }
    return segments.join("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/70 backdrop-blur-xl shadow-sm border-b border-gray-200 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex h-20 items-center justify-between px-4">
        <Link href={`/${lang}`} className="flex items-center gap-2 group">
          {logoUrl ? (
            <img 
              src={logoUrl} 
              alt="Logo" 
              className="transition-transform duration-300 group-hover:scale-105" 
              style={{
                width: logo?.width ? `${logo.width}px` : "auto",
                height: logo?.height ? `${logo.height}px` : "40px",
                objectFit: (logo?.objectFit as any) || "contain"
              }}
            />
          ) : (
            <span className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-sky-500 tracking-tight">AZT MEDİKAL</span>
          )}
        </Link>

        <nav className="hidden md:flex items-center gap-8 font-bold text-gray-700">
          <Link href={`/${lang}`} className="relative hover:text-blue-600 transition-colors after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 hover:after:w-full after:bg-blue-600 after:transition-all after:duration-300">{t(T_NAV.home, lang)}</Link>
          <Link href={`/${lang}/#about`} className="relative hover:text-blue-600 transition-colors after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 hover:after:w-full after:bg-blue-600 after:transition-all after:duration-300">{t(T_NAV.about, lang)}</Link>
          <Link href={`/${lang}/#categories`} className="relative hover:text-blue-600 transition-colors after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 hover:after:w-full after:bg-blue-600 after:transition-all after:duration-300">{t(T_NAV.categories, lang)}</Link>
          <button 
            onClick={openModal}
            className="relative hover:text-blue-600 transition-colors after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 hover:after:w-full after:bg-blue-600 after:transition-all after:duration-300"
          >
            {t(T_NAV.contact, lang)}
          </button>
        </nav>

        <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-full shadow-inner border border-gray-200/50">
          {locales.map((locale) => (
            <Link
              key={locale.code}
              href={getLocalizedPath(locale.code)}
              className={`text-xs font-black px-4 py-2 rounded-full uppercase transition-all duration-300 tracking-wider ${
                lang === locale.code 
                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30 scale-100" 
                : "text-gray-500 hover:text-gray-900 hover:bg-white scale-95"
              }`}
            >
              {locale.name}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
