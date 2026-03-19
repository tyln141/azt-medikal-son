import { db } from "@/lib/firebase/config";
import { collection, getDocs, doc, deleteDoc, writeBatch } from "firebase/firestore";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const batch = writeBatch(db);

    // 1. DELETE EXISTING
    const pSnap = await getDocs(collection(db, "products"));
    for (const d of pSnap.docs) { await deleteDoc(doc(db, "products", d.id)); }

    const cSnap = await getDocs(collection(db, "categories"));
    for (const d of cSnap.docs) { await deleteDoc(doc(db, "categories", d.id)); }

    const sSnap = await getDocs(collection(db, "site-content"));
    for (const d of sSnap.docs) { await deleteDoc(doc(db, "site-content", d.id)); }

    // 2. CREATE CATEGORIES
    const categories = [
      {
        id: "hemodiyaliz-kateterleri",
        name: { 
          tr: "Hemodiyaliz Kateterleri", 
          en: "Hemodialysis Catheters", 
          de: "Hämodialysekatheter", 
          fr: "Cathéters d'hémodialyse" 
        },
        description: { 
          tr: "Uzun ömürlü ve biyouyumlu materyalden üretilmiş profesyonel hemodiyaliz kateterleri.",
          en: "Professional hemodialysis catheters made from long-lasting biocompatible materials.",
          de: "Professionelle Hämodialysekatheter aus langlebigen, biokompatiblen Materialien.",
          fr: "Cathéters d'hémodialyse professionnels fabriqués à partir de matériaux biocompatibles."
        },
        sidebar: { tr: [], en: [], de: [], fr: [] },
        createdAt: Date.now()
      },
      {
        id: "infuzyon-pompalari",
        name: { 
          tr: "İnfüzyon Pompaları", 
          en: "Infusion Pumps", 
          de: "Infusionspumpen", 
          fr: "Pompes à perfusion" 
        },
        description: { 
          tr: "Hassas doz ayarlaması sağlayan yeni nesil akıllı infüzyon pompası sistemleri.",
          en: "Next-generation smart infusion pump systems providing precise dose adjustments.",
          de: "Smart-Infusionspumpensysteme der nächsten Generation für präzise Dosisanpassungen.",
          fr: "Systèmes de pompes à perfusion intelligents assurant des ajustements de dose précis."
        },
        sidebar: { tr: [], en: [], de: [], fr: [] },
        createdAt: Date.now()
      },
      {
        id: "diyaliz-sarf-malzemeleri",
        name: { 
          tr: "Diyaliz Sarf Malzemeleri", 
          en: "Dialysis Consumables", 
          de: "Dialyse-Verbrauchsmaterialien", 
          fr: "Consommables de dialyse" 
        },
        description: { 
          tr: "Diyaliz süreçleri için gerekli yüksek sterilizasyona sahip sarf ürün grupları.",
          en: "Highly sterilized consumable product groups necessary for dialysis processes.",
          de: "Hochgradig sterilisierte Verbrauchsgüter, die für Dialyseprozesse erforderlich sind.",
          fr: "Consommables hautement stérilisés nécessaires aux processus de dialyse."
        },
        sidebar: { tr: [], en: [], de: [], fr: [] },
        createdAt: Date.now()
      },
      {
        id: "port-igneleri",
        name: { 
          tr: "Port İğneleri", 
          en: "Port Needles", 
          de: "Port-Nadeln", 
          fr: "Aiguilles de chambre" 
        },
        description: { 
          tr: "Hasta konforunu maksimize eden, atravmatik yapılı özel port iğneleri.",
          en: "Special atraumatic port needles maximizing patient comfort.",
          de: "Spezielle atraumatische Port-Nadeln, die den Patientenkomfort maximieren.",
          fr: "Aiguilles de port spéciales atraumatiques maximisant le confort du patient."
        },
        sidebar: { tr: [], en: [], de: [], fr: [] },
        createdAt: Date.now()
      }
    ];

    for (const cat of categories) {
      batch.set(doc(collection(db, "categories"), cat.id), cat);
    }

    // 3. CREATE PRODUCTS (3 Per Category)
    const mockFeatures = {
        tr: ["Kanıtlanmış güvenlik standartları", "Klinik ortamında test edilmiştir", "Uluslararası standart formunda", "Dayanıklı ve steril yapı"],
        en: ["Proven safety standards", "Clinically tested", "International standard form", "Durable and sterile structure"],
        de: ["Nachgewiesene Sicherheitsstandards", "Klinisch getestet", "Internationale Standardform", "Haltbare und sterile Struktur"],
        fr: ["Normes de sécurité éprouvées", "Testé cliniquement", "Formulaire standard international", "Structure durable et stérile"]
    };

    let pCount = 0;
    for (const cat of categories) {
      for (let i = 1; i <= 3; i++) {
        pCount++;
        const pId = `prod-${cat.id}-${i}`;
        batch.set(doc(collection(db, "products"), pId), {
          name: { 
            tr: `${cat.name.tr} Pro Model ${i}`, 
            en: `${cat.name.en} Pro Model ${i}`, 
            de: `${cat.name.de} Pro Modell ${i}`, 
            fr: `${cat.name.fr} Modèle Pro ${i}` 
          },
          description: { 
            tr: "Uzman hekim ve hastaneler için özel olarak geliştirilmiş endüstri standartlarında medikal ekipman. En yüksek sterilizasyon seviyesine sahiptir.",
            en: "Industry-standard medical equipment specially developed for expert physicians and hospitals. Has the highest sterilization level.",
            de: "Nach Industriestandards entwickeltes medizinisches Gerät für Fachärzte und Krankenhäuser. Höchste Sterilisationsstufe.",
            fr: "Équipement médical conforme aux normes de l'industrie, développé pour les médecins et les hôpitaux. Stérilisation maximale."
          },
          features: mockFeatures,
          categoryId: cat.id,
          images: ["/placeholder.png"],
          createdAt: Date.now() - (i * 100000)
        });
      }
    }

    // 4. SITE CONTENT
    batch.set(doc(collection(db, "site-content"), "main"), {
      hero: {
         title: { 
            tr: "Medikal Sektörde Güvenilir Tedarik Zinciri", 
            en: "Reliable Supply Chain in the Medical Field", 
            de: "Zuverlässige Lieferkette im Medizinbereich", 
            fr: "Chaîne d'approvisionnement fiable dans le domaine médical" 
         },
         subtitle: { 
            tr: "AZT Medikal, 15 yılı aşkın tecrübesiyle hemodiyaliz ve sarf malzemelerinde hastanelere yüksek standartlarda, kesintisiz ürün sağlar.", 
            en: "With over 15 years of experience, AZT Medical provides continuous high-standard products in hemodialysis and consumables to hospitals.", 
            de: "Mit über 15 Jahren Erfahrung bietet AZT Medical Krankenhäusern kontinuierlich hochwertige Produkte in der Hämodialyse und bei Verbrauchsmaterialien.", 
            fr: "Avec plus de 15 ans d'expérience, AZT Medical fournit en permanence des produits de haute qualité en hémodialyse et consommables aux hôpitaux." 
         },
         buttonText: { 
            tr: "Teklif Al", 
            en: "Get Quote", 
            de: "Angebot einholen", 
            fr: "Obtenir un devis" 
         },
         image: ""
      },
      about: {
         title: { 
            tr: "AZT Medikal Hakkında", 
            en: "About AZT Medical", 
            de: "Über AZT Medical", 
            fr: "À propos d'AZT Medical" 
         },
         description: { 
            tr: "Sektördeki en yenilikçi çözümleri ve kalite standartlarını bir araya getirerek, iş ortaklarımızın ve sağlık profesyonellerinin ilk tercihi olmaya devam ediyoruz. Geleceğin tıp teknolojilerini bugünden sunuyoruz.", 
            en: "By combining the most innovative solutions and quality standards in the sector, we continue to be the first choice of our business partners and healthcare professionals. We offer tomorrow's medical technologies today.", 
            de: "Indem wir die innovativsten Lösungen und Qualitätsstandards der Branche vereinen, bleiben wir die erste Wahl unserer Geschäftspartner und medizinischer Fachkräfte. Wir bieten die Medizintechnik von morgen schon heute.", 
            fr: "En combinant les solutions les plus innovantes et les normes de qualité du secteur, nous restons le premier choix de nos partenaires commerciaux et professionnels de santé. Nous offrons aujourd'hui les technologies médicales de demain." 
         },
         stats: [
            { label: { tr: "Yıllık Tecrübe", en: "Years Experience", de: "Jahre Erfahrung", fr: "Années d'expérience" }, value: "15+" },
            { label: { tr: "Kurumsal Müşteri", en: "Corporate Clients", de: "Firmenkunden", fr: "Clients institutionnels" }, value: "500+" },
            { label: { tr: "Etkin Medikal Ürün", en: "Active Medical Products", de: "Aktive Medizinprodukte", fr: "Produits médicaux actifs" }, value: "1000+" }
         ]
      },
      whyUs: [
         {
            title: { tr: "Teknoloji", en: "Technology", de: "Technologie", fr: "Technologie" },
            description: { 
              tr: "Sürekli güncellenen ürün portföyü ile modern tıp teknolojilerini yakından takip ediyoruz.", 
              en: "We closely follow modern medical technologies with our continuously updated product portfolio.",
              de: "Mit unserem kontinuierlich aktualisierten Produktportfolio verfolgen wir moderne Medizintechnologien genau.",
              fr: "Nous suivons de près les technologies médicales modernes grâce à notre portefeuille de produits."
            },
             icon: "✓"
         },
         {
            title: { tr: "Uzman Kadro", en: "Expert Staff", de: "Fachpersonal", fr: "Personnel expert" },
            description: { 
              tr: "Alanında deneyimli tıp ve saha temsilcilerimizle haftanın 7 günü hizmet sağlıyoruz.", 
              en: "We provide services 7 days a week with our experienced medical and field representatives.",
              de: "Mit unseren erfahrenen medizinischen Fach- und Außendienstmitarbeitern bieten wir unsere Dienste 7 Tage die Woche an.",
              fr: "Nous fournissons des services 7 jours sur 7 avec nos représentants médicaux et de terrain expérimentés."
            },
             icon: "✓"
         },
         {
            title: { tr: "Güvenilir Tedarik", en: "Reliable Supply", de: "Zuverlässige Versorgung", fr: "Approvisionnement fiable" },
            description: { 
              tr: "Uluslararası kalite belgelerine sahip üreticilerle güvene dayalı iş modelimiz mevcuttur.", 
              en: "We have a trust-based business model with manufacturers possessing international quality certificates.",
              de: "Wir haben ein auf Vertrauen basierendes Geschäftsmodell mit Herstellern, die über internationale Qualitätszertifikate verfügen.",
              fr: "Nous avons un modèle commercial basé sur la confiance avec des fabricants possédant des certificats de qualité internationaux."
            },
             icon: "✓"
         },
         {
            title: { tr: "Hızlı Teslimat", en: "Fast Delivery", de: "Schnelle Lieferung", fr: "Livraison rapide" },
            description: { 
              tr: "Stok takip sistemlerimiz ve lojistik ağımız sayesinde kurumunuza ürünleri eksiksiz ve en hızlı yoldan ulaştırıyoruz.", 
              en: "Thanks to our stock tracking systems and logistics network, we deliver products to your institution completely and in the fastest way.",
              de: "Dank unserer bestandsüberwachungssysteme und unseres Logistiknetzwerks liefern wir Produkte vollständig und auf dem schnellsten Weg an Ihre Einrichtung.",
              fr: "Grâce à nos systèmes de suivi des stocks et à notre réseau logistique, nous livrons les produits à votre institution de manière complète et rapide."
            },
             icon: "✓"
         }
      ],
      logo: { url: "" },
      footer: {
         description: {
            tr: "Sektördeki en yenilikçi çözümleri ve kalite standartlarını bir araya getirerek, iş ortaklarımızın ve sağlık profesyonellerinin ilk tercihi olmaya devam ediyoruz.",
            en: "By combining the most innovative solutions and quality standards in the sector, we continue to be the first choice of our business partners and healthcare professionals.",
            de: "Indem wir die innovativsten Lösungen und Qualitätsstandards der Branche vereinen, bleiben wir die erste Wahl unserer Geschäftspartner.",
            fr: "En combinant les solutions les plus innovantes et les normes de qualité du secteur, nous restons le premier choix de nos partenaires."
         },
         address: {
           tr: "Ankara Medikal İhtisas Bölgesi, 4. Kat No:123, Türkiye",
           en: "Ankara Medical Specialized Zone, 4th Floor No:123, Turkey",
           de: "Ankara Medizinisches Fachgebiet, 4. Stock Nr. 123, Türkei",
           fr: "Zone Spécialisée Médicale d'Ankara, 4ème étage n°123, Turquie"
         },
         phone: "+90 532 123 45 67",
         email: "sales@aztmedikal.com.tr",
         workingHours: {
            tr: "Pazartesi - Cuma: 08:30 - 18:00",
            en: "Monday - Friday: 08:30 AM - 06:00 PM",
            de: "Montag - Freitag: 08:30 - 18:00 Uhr",
            fr: "Lundi - Vendredi: 08:30 - 18:00"
         },
         copyright: {
            tr: "© 2026 AZT Medikal İthalat İhracat A.Ş. Tüm hakları saklıdır.",
            en: "© 2026 AZT Medical Import Export Inc. All rights reserved.",
            de: "© 2026 AZT Medical Import Export GmbH. Alle Rechte vorbehalten.",
            fr: "© 2026 AZT Medical Import Export SA. Tous droits réservés."
         },
         poweredBy: {
           tr: "Antigravity tarafından güçlendirilmiştir",
           en: "Powered by Antigravity",
           de: "Präsentiert von Antigravity",
           fr: "Propulsé par Antigravity"
         }
      }
    });

    await batch.commit();
    return Response.json({ success: true, message: "Full reset and seed completed successfully." });
  } catch (error: any) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
