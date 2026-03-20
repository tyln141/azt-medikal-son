import { db } from "../firebase/config";
import { doc, getDoc } from "firebase/firestore";
import { SiteContent } from "@/types";
import { getBaseUrl } from "@/lib/utils/base-url";

const COLLECTION_NAME = "site-content";
const DOCUMENT_ID = "main";

const defaultData: SiteContent = {
  hero: {
    title: {
      tr: "İleri Teknoloji Medikal Çözümlerle Sağlıkta Güvenin Adresi",
      en: "The Address of Trust in Healthcare with Advanced Medical Solutions",
      de: "Die Adresse des Vertrauens im Gesundheitswesen mit fortschrittlichen medizinischen Lösungen",
      fr: "L'Adresse de la Confiance dans le Secteur de la Santé avec des Solutions Médicales Avancées"
    },
    subtitle: {
      tr: "Dünya standartlarında tıbbi cihaz ve ekipman tedariği ile yarının sağlığını bugünden inşa ediyoruz.",
      en: "We build tomorrow's healthcare today with world-class medical device and equipment supply.",
      de: "Wir bauen die Gesundheitsversorgung von morgen schon heute mit erstklassigen medizinischen Geräten und Ausrüstungen auf.",
      fr: "Nous construisons la santé de demain dès aujourd'hui grâce à une fourniture d'appareils et d'équipements médicaux de classe mondiale."
    },
    buttonText: {
      tr: "Ürünlerimizi Keşfedin",
      en: "Explore Our Products",
      de: "Unsere Produkte entdecken",
      fr: "Découvrez nos produits"
    },
    image: undefined
  },
  about: {
    title: {
      tr: "15 Yılı Aşkın Tecrübe ile Sağlık Sektöründe Küresel Bir Güç",
      en: "A Global Power in the Healthcare Sector with Over 15 Years of Experience",
      de: "Eine globale Kraft im Gesundheitssektor mit über 15 Jahren Erfahrung",
      fr: "Une puissance mondiale dans le secteur de la santé avec plus de 15 ans d'expérience"
    },
    description: {
      tr: "2010 yılında kurulan AZT Medikal, kuruluşundan bu yana tıbbi teknoloji alanında öncü roller üstlenmiş, yenilikçi ve güvenilir bir çözüm ortağıdır. Modern tıbbın gerekliliklerini en ileri düzeyde karşılayan geniş ürün yelpazemizle healthcare standartlarını yükseltmek için çalışıyoruz.",
      en: "Founded in 2010, AZT Medical has been an innovative and reliable solution partner that has taken pioneering roles in the field of medical technology since its inception. We work to raise healthcare standards globally.",
      de: "Das 2010 gegründete Unternehmen AZT Medical ist seit seiner Gründung ein innovativer und zuverlässiger Lösungspartner im Bereich der Medizintechnik.",
      fr: "Fondée en 2010, AZT Médical est un partenaire de solutions innovant et fiable dans le domaine de la technologie médicale."
    },
    image: undefined
  },
  whyUs: [
    { 
      title: { tr: "Üstün Kalite ve Sertifikasyon", en: "Superior Quality and Certification", de: "Hervorragende Qualität", fr: "Qualité Supérieure" }, 
      description: { 
        tr: "Tüm ürünlerimiz en zorlu kalite testlerinden geçerek uluslararası standartlara uygunluk belgesi almıştır.", 
        en: "All our products passed the most rigorous quality tests and received international certificates.",
        de: "Alle unsere Produkte haben strengste Qualitätstests bestanden.",
        fr: "Tous nos produits ont passé les tests de qualité les plus rigoureux."
      }, 
      icon: "🛡️" 
    },
    { 
      title: { tr: "Güven ve Şeffaflık", en: "Trust and Transparency", de: "Vertrauen und Transparenz", fr: "Confiance et Transparence" }, 
      description: { 
        tr: "Dürüstlük ve tam şeffaflık ilkesiyle hareket ederek uzun vadeli güven inşa ediyoruz.", 
        en: "We build long-term trust by acting with honesty and full transparency.",
        de: "Wir bauen langfristiges Vertrauen auf, indem wir ehrlich und transparent handeln.",
        fr: "Nous bâtissons une confiance à long terme en agissant avec honnêteté."
      }, 
      icon: "🤝" 
    },
    { 
      title: { tr: "Sürekli İnovasyon", en: "Constant Innovation", de: "Ständige Innovation", fr: "Innovation Constante" }, 
      description: { 
        tr: "En yeni trendleri Ar-Ge süreçlerimize entegre ederek her zaman en modern çözümleri sunuyoruz.", 
        en: "By integrating the latest trends into our R&D, we offer the most modern solutions.",
        de: "Durch die Integration neuester Trends bieten wir stets modernste Lösungen.",
        fr: "En intégrant les dernières tendances, nous offrons toujours les solutions les plus modernes."
      }, 
      icon: "💡" 
    },
    { 
      title: { tr: "Global Lojistik", en: "Global Logistics", de: "Globale Logistik", fr: "Logistique Mondiale" }, 
      description: { 
        tr: "Dünyanın her yerine hızlı sevkiyat ve kurulum sonrası uzman teknik destek sağlıyoruz.", 
        en: "We provide fast shipment to all over the world and expert technical support.",
        de: "Wir bieten schnellen Versand in die ganze Welt und fachkundigen technischen Support.",
        fr: "Nous assurons des expéditions rapides dans le monde entier."
      }, 
      icon: "🌐" 
    }
  ],
  stats: [
    { label: { tr: "Yıllık Tecrübe", en: "Years of Experience", de: "Jahre Erfahrung", fr: "Années d'expérience" }, value: "15+" },
    { label: { tr: "Mutlu Müşteri", en: "Happy Clients", de: "Zufriedene Kunden", fr: "Clients satisfaits" }, value: "500+" },
    { label: { tr: "Ürün Çeşidi", en: "Product Variety", de: "Produktvielfalt", fr: "Variété de produits" }, value: "1000+" }
  ],
  footer: {
    address: { 
      tr: "Kırkkonaklar Mah. 316. Cad. 335 Sok. No:13/A, Çankaya / Ankara", 
      en: "Kırkkonaklar District, 316 Street, No:13/A, Ankara, Turkey", 
      de: "Kırkkonaklar, Ankara, Türkei", 
      fr: "Ankara, Turquie" 
    },
    phone: "+90 555 555 55 55",
    email: "info@aztmedikal.com",
    workingHours: { 
      tr: "Pazartesi - Cuma: 09:00 - 17:00", 
      en: "Monday - Friday: 09:00 - 17:00", 
      de: "Montag - Freitag: 09:00 - 17:00", 
      fr: "Lundi - Vendredi: 09:00 - 17:00" 
    },
    copyright: { 
      tr: "© 2026 AZT Medikal. Tüm hakları saklıdır.", 
      en: "© 2026 AZT Medical. All rights reserved.", 
      de: "© 2026 AZT Medikal. Alle Rechte vorbehalten.", 
      fr: "© 2026 AZT Médical. Tous droits réservés." 
    },
    description: {
      tr: "Sağlık teknolojilerinde küresel çözüm ortağınız. 15 yıllık tecrübemizle yarının tıbbını bugünden şekillendiriyoruz.",
      en: "Your global partner in health technologies. Shaping tomorrow's medicine today with 15 years of experience.",
      de: "Ihr globaler Partner für Gesundheitstechnologien. Wir gestalten die Medizin von morgen schon heute.",
      fr: "Votre partenaire mondial en technologies de santé. Façonner la médecine de demain dès aujourd'hui."
    },
    poweredBy: {
      tr: "Antigravity tarafından güçlendirilmiştir",
      en: "Powered by Antigravity",
      de: "Präsentiert von Antigravity",
      fr: "Propulsé par Antigravity"
    }
  },
  logo: { url: "", objectFit: "contain" }
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
      poweredBy: n(data.footer?.poweredBy),
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
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error("Failed to update site content");
  }
};
