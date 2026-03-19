import { db } from "../firebase/config";
import { doc, getDoc } from "firebase/firestore";
import { SiteContent } from "@/types";
import { getBaseUrl } from "@/lib/utils/base-url";

const COLLECTION_NAME = "site-content";
const DOCUMENT_ID = "main";

const defaultData: SiteContent = {
  hero: {
    title: { 
      tr: "A'dan Z'ye Medikal Çözümler", 
      en: "Medical Solutions from A to Z", 
      de: "Medizinische Lösungen von A bis Z", 
      fr: "Solutions médicales de A à Z" 
    },
    subtitle: { 
      tr: "Sağlık sektöründe güvenilir çözüm ortağınız", 
      en: "Your trusted partner in healthcare", 
      de: "Ihr zuverlässiger Partner im Gesundheitswesen", 
      fr: "Votre partenaire de confiance dans le secteur de la santé" 
    },
    buttonText: { 
      tr: "Ürünlerimizi İnceleyin", 
      en: "Explore Our Products", 
      de: "Unsere Produkte entdecken", 
      fr: "Découvrez nos produits" 
    },
    image: undefined
  },
  about: {
    title: { 
      tr: "Hakkımızda", 
      en: "About Us", 
      de: "Über uns", 
      fr: "À propos" 
    },
    description: { 
      tr: "2010 yılından bu yana sağlık sektöründe faaliyet gösteren firmamız, hastaneler, klinikler ve sağlık kuruluşları için yüksek kaliteli medikal ürünler sunmaktadır. A'dan Z'ye tedarik anlayışımız ile müşterilerimize güvenilir, hızlı ve sürdürülebilir çözümler sağlıyoruz.", 
      en: "Since 2010, our company has been providing high-quality medical products for hospitals, clinics, and healthcare institutions. With our A-to-Z supply approach, we deliver reliable, fast, and sustainable solutions.", 
      de: "Seit 2010 bietet unser Unternehmen hochwertige medizinische Produkte für Krankenhäuser und Kliniken an. Mit unserem A-bis-Z-Versorgungsansatz liefern wir zuverlässige und nachhaltige Lösungen.", 
      fr: "Depuis 2010, notre entreprise fournit des produits médicaux de haute qualité aux hôpitaux et cliniques. Nous offrons des solutions fiables et durables avec une approche complète." 
    },
    image: undefined
  },
  whyUs: [
    { 
      title: { tr: "Teknoloji", en: "Technology", de: "Technologie", fr: "Technologie" }, 
      description: { 
        tr: "En son teknoloji ile donatılmış modern medikal cihazlar ve çözümler sunuyoruz.", 
        en: "We provide modern medical devices equipped with the latest technology.", 
        de: "Wir bieten moderne medizinische Geräte mit neuester Technologie.", 
        fr: "Nous proposons des équipements médicaux modernes avec les dernières technologies." 
      }, 
      icon: "⚙️" 
    },
    { 
      title: { tr: "Uzman Kadro", en: "Expert Team", de: "Fachpersonal", fr: "Équipe experte" }, 
      description: { 
        tr: "Alanında uzman ekibimiz ile kesintisiz destek sağlıyoruz.", 
        en: "Our expert team provides continuous support.", 
        de: "Unser Expertenteam bietet kontinuierliche Unterstützung.", 
        fr: "Notre équipe d'experts offre un support continu." 
      }, 
      icon: "👥" 
    },
    { 
      title: { tr: "Çözüm Ortaklığı", en: "Partnership", de: "Partnerschaft", fr: "Partenariat" }, 
      description: { 
        tr: "Uzun vadeli iş birlikleri ile sürdürülebilir çözümler sunuyoruz.", 
        en: "We provide sustainable solutions with long-term partnerships.", 
        de: "Wir bieten nachhaltige Lösungen durch langfristige Partnerschaften.", 
        fr: "Nous offrons des solutions durables grâce à des partenariats à long terme." 
      }, 
      icon: "🤝" 
    },
    { 
      title: { tr: "Geniş Tedarik Ağı", en: "Wide Supply Network", de: "Breites Liefernetz", fr: "Réseau d'approvisionnement" }, 
      description: { 
        tr: "Global tedarik ağımız ile tüm ihtiyaçlarınıza hızlı çözüm sağlıyoruz.", 
        en: "We meet all your needs quickly with our global supply network.", 
        de: "Mit unserem globalen Netzwerk erfüllen wir Ihre Anforderungen schnell.", 
        fr: "Nous répondons rapidement à vos besoins grâce à notre réseau mondial." 
      }, 
      icon: "🌐" 
    }
  ],
  stats: [
    { 
      label: { tr: "Yıllık Tecrübe", en: "Years of Experience", de: "Jahre Erfahrung", fr: "Années d'expérience" }, 
      value: "15+" 
    },
    { 
      label: { tr: "Mutlu Müşteri", en: "Happy Clients", de: "Zufriedene Kunden", fr: "Clients satisfaits" }, 
      value: "500+" 
    },
    { 
      label: { tr: "Ürün Çeşidi", en: "Product Variety", de: "Produktvielfalt", fr: "Variété de produits" }, 
      value: "1000+" 
    }
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
    }
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
