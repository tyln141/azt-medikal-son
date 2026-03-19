import { NextResponse } from "next/server";
import { db } from "@/lib/firebase/config";
import { doc, getDoc, setDoc } from "firebase/firestore";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const ref = doc(db, "site-content", "main");
    const snap = await getDoc(ref);

    const defaultContent = {
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
        }
      },
      about: { 
        title: {
          tr: "15 Yılı Aşkın Tecrübe ile Sağlık Sektöründe Küresel Bir Güç",
          en: "A Global Power in the Healthcare Sector with Over 15 Years of Experience",
          de: "Eine globale Kraft im Gesundheitssektor mit über 15 Jahren Erfahrung",
          fr: "Une puissance mondiale dans le secteur de la santé avec plus de 15 ans d'expérience"
        },
        description: {
          tr: "2010 yılında kurulan AZT Medikal, kuruluşundan bu yana tıbbi teknoloji alanında öncü roller üstlenmiş, yenilikçi ve güvenilir bir çözüm ortağıdır.",
          en: "Founded in 2010, AZT Medical has been an innovative and reliable solution partner globally.",
          de: "Das 2010 gegründete Unternehmen AZT Medical ist seit seiner Gründung ein innovativer Partner.",
          fr: "Fondée en 2010, AZT Médical est un partenaire de solutions innovant."
        }
      },
      logo: { url: "", objectFit: "contain" },
      whyUs: [
        { title: { tr: "Üstün Kalite", en: "Superior Quality" }, description: { tr: "ISO ve CE belgeli...", en: "ISO and CE certified..." }, icon: "🛡️" },
        { title: { tr: "Güven", en: "Trust" }, description: { tr: "Dürüstlük ve tam şeffaflık...", en: "Honesty and full transparency..." }, icon: "🤝" }
      ],
      stats: [
        { label: { tr: "Tecrübe", en: "Experience" }, value: "15+" },
        { label: { tr: "Mutlu Müşteri", en: "Happy Clients" }, value: "500+" }
      ],
      footer: { 
        address: { 
          tr: "Kırkkonaklar Mah. 316. Cad. 335 Sok. No:13/A, Çankaya / Ankara", 
          en: "Ankara, Turkey"
        }, 
        phone: "+90 555 555 55 55", 
        email: "info@aztmedikal.com", 
        workingHours: { tr: "Pazartesi - Cuma: 09:00 - 17:00", en: "Mon - Fri: 09:00 - 17:00" }, 
        copyright: { tr: "© 2026 AZT Medikal.", en: "© 2026 AZT Medical." } 
      }
    };

    if (!snap.exists()) {
      return NextResponse.json(defaultContent);
    }

    const data = snap.data();
    return NextResponse.json({
      ...defaultContent,
      ...data,
      hero: { ...defaultContent.hero, ...data?.hero },
      about: { ...defaultContent.about, ...data?.about },
      footer: { ...defaultContent.footer, ...data?.footer },
      logo: { ...defaultContent.logo, ...data?.logo }
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json();
    
    // Create safe structure before saving to prevent crashes and ensure Firestore document size is minimal (Storage URLs only)
    const safeData = {
      ...data,
      hero: data?.hero || {},
      about: data?.about || {},
      whyUs: Array.isArray(data?.whyUs) ? data.whyUs : [],
      footer: data?.footer || {},
      logo: data?.logo || null
    };

    const ref = doc(db, "site-content", "main");
    // We replace the document to ensure old image data (Base64) is completely wiped from Firestore
    await setDoc(ref, safeData);
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("FIREBASE PUT ERROR:", error);
    return NextResponse.json({ 
      error: error.message || "failed",
      success: false 
    }, { status: 500 });
  }
}
