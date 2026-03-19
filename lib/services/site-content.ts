import { db } from "../firebase/config";
import { doc, getDoc } from "firebase/firestore";
import { SiteContent } from "@/types";
import { getBaseUrl } from "@/lib/utils/base-url";

const COLLECTION_NAME = "site-content";
const DOCUMENT_ID = "main";

const defaultData: SiteContent = {
  hero: {
    title: { tr: "AZT MEDİKAL", en: "AZT MEDICAL", de: "AZT MEDIZIN", fr: "AZT MÉDICAL" },
    subtitle: { tr: "Sağlıkta Güvenilir Çözüm Ortağınız", en: "Your Trusted Healthcare Partner", de: "Ihr zuverlässiger Gesundheitspartner", fr: "Votre partenaire de confiance en santé" },
    buttonText: { tr: "Teklif Al", en: "Get a Quote", de: "Angebot erhalten", fr: "Obtenir un devis" },
    image: undefined
  },
  about: {
    title: { tr: "Hakkımızda", en: "About Us", de: "Über uns", fr: "À propos" },
    description: { tr: "AZT Medikal olarak sağlık sektörüne yenilikçi ve güvenilir çözümler sunuyoruz.", en: "As AZT Medical, we provide innovative and reliable solutions to the healthcare sector.", de: "Als AZT Medikal bieten wir innovative und zuverlässige Lösungen im Gesundheitswesen.", fr: "En tant qu'AZT Medikal, we propose des solutions innovantes et fiables." },
    image: undefined
  },
  whyUs: [
    { title: { tr: "Yüksek Kalite", en: "High Quality", de: "Hohe Qualität", fr: "Haute qualité" }, description: { tr: "Tüm ürünlerimiz uluslararası standartlara uygundur.", en: "All our products meet international standards.", de: "Alle unsere Produkte entsprechen internationalen Standards.", fr: "Tous nos produits respectent les normes internationales." }, icon: "🛡️" },
    { title: { tr: "Hızlı Teslimat", en: "Fast Delivery", de: "Schnelle Lieferung", fr: "Livraison rapide" }, description: { tr: "Siparişleriniz en hızlı şekilde ulaştırılır.", en: "Your orders are delivered as quickly as possible.", de: "Ihre Bestellungen werden schnell geliefert.", fr: "Vos commandes sont livrées rapidement." }, icon: "🚚" },
    { title: { tr: "Teknik Destek", en: "Technical Support", de: "Technischer Support", fr: "Support technique" }, description: { tr: "Uzman ekibimiz her zaman yanınızda.", en: "Our expert team is always with you.", de: "Unser Team ist immer für Sie da.", fr: "Notre équipe est toujours là pour vous." }, icon: "📞" }
  ],
  stats: [
    { label: { tr: "Mutlu Müşteri", en: "Happy Clients", de: "Zufriedene Kunden", fr: "Clients satisfaits" }, value: "500+" },
    { label: { tr: "Ürün Çeşidi", en: "Products", de: "Produkte", fr: "Produits" }, value: "120+" },
    { label: { tr: "Yıllık Deneyim", en: "Years Experience", de: "Jahre Erfahrung", fr: "Années d'expérience" }, value: "10+" }
  ],
  footer: {
    address: { tr: "Ankara, Türkiye", en: "Ankara, Turkey", de: "Ankara, Türkei", fr: "Ankara, Turquie" },
    phone: "+90 555 555 55 55",
    email: "info@aztmedikal.com",
    workingHours: { tr: "Hafta içi 09:00 - 18:00", en: "Weekdays 09:00 - 18:00", de: "Werktage 09:00 - 18:00", fr: "Jours ouvrables 09:00 - 18:00" },
    copyright: { tr: "© 2026 AZT Medikal", en: "© 2026 AZT Medical", de: "© 2026 AZT Medikal", fr: "© 2026 AZT Médical" }
  },
  logo: { url: "" }
};

const normalizeSiteContent = (data: any): SiteContent => {
  const n = (val: any) => (typeof val === "object" && val !== null && !Array.isArray(val)) 
    ? { tr: "", en: "", de: "", fr: "", ...val } 
    : { tr: (typeof val === 'string' ? val : ""), en: "", de: "", fr: "" };

  return {
    ...data,
    hero: {
      ...data.hero,
      title: n(data.hero?.title),
      subtitle: n(data.hero?.subtitle),
      buttonText: n(data.hero?.buttonText),
    },
    about: {
      ...data.about,
      title: n(data.about?.title),
      description: n(data.about?.description),
    },
    stats: (Array.isArray(data.stats) ? data.stats : (Array.isArray(data.about?.stats) ? data.about.stats : [])).map((s: any) => ({
      ...s,
      label: n(s.label),
      value: s.value || "0"
    })),
    whyUs: (data.whyUs || []).map((w: any) => ({
      ...w,
      title: n(w.title),
      description: n(w.description),
    })),
    logo: data.logo || { url: "", objectFit: "contain" },
    footer: {
      ...data.footer,
      address: n(data.footer?.address),
      workingHours: n(data.footer?.workingHours),
      copyright: n(data.footer?.copyright),
      description: n(data.footer?.description),
    }
  };
};

export const siteContentService = {
  async getContent(): Promise<SiteContent | null> {
    const response = await fetch(`${getBaseUrl()}/api/site-content`, {
      cache: "no-store"
    });
    
    if (!response.ok) {
       // Seed if missing (Only locally or if API fails)
       return normalizeSiteContent(defaultData);
    }
    
    const data = await response.json();
    if (!data || Object.keys(data).length < 2) {
       return normalizeSiteContent(defaultData);
    }
    
    return normalizeSiteContent(data);
  },

  async update(data: any): Promise<void> {
    const response = await fetch(`${getBaseUrl()}/api/site-content`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to update site content");
  }
};
