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
        title: { tr: "A'dan Z'ye Medikal Çözümler", en: "Medical Solutions from A to Z", de: "Medizinische Lösungen von A bis Z", fr: "Solutions médicales de A à Z" }, 
        subtitle: { tr: "Sağlık sektöründe güvenilir çözüm ortağınız", en: "Your trusted partner in healthcare", de: "Ihr zuverlässiger Partner im Gesundheitswesen", fr: "Votre partenaire de confiance dans le secteur de la santé" }, 
        buttonText: { tr: "Ürünlerimizi İnceleyin", en: "Explore Our Products", de: "Unsere Produkte entdecken", fr: "Découvrez nos produits" } 
      },
      about: { 
        title: { tr: "Hakkımızda", en: "About Us", de: "Über uns", fr: "À propos" }, 
        description: { 
          tr: "2010 yılından bu yana sağlık sektöründe faaliyet gösteren firmamız...", 
          en: "Since 2010, our company has been providing high-quality medical products...", 
          de: "Seit 2010 bietet unser Unternehmen hochwertige medizinische Produkte...", 
          fr: "Depuis 2010, notre entreprise fournit des produits médicaux de haute qualité..." 
        } 
      },
      logo: { url: "", objectFit: "contain" },
      whyUs: [
        { title: { tr: "Teknoloji", en: "Technology" }, description: { tr: "En son teknoloji...", en: "Latest technology..." }, icon: "⚙️" },
        { title: { tr: "Uzman Kadro", en: "Expert Team" }, description: { tr: "Alanında uzman...", en: "Expert team..." }, icon: "👥" }
      ],
      stats: [
        { label: { tr: "Yıllık Tecrübe", en: "Experience" }, value: "15+" },
        { label: { tr: "Mutlu Müşteri", en: "Clients" }, value: "500+" }
      ],
      footer: { 
        address: { tr: "Ankara, Türkiye", en: "Ankara, Turkey" }, 
        phone: "+90 555 555 55 55", 
        email: "info@aztmedikal.com", 
        workingHours: { tr: "09:00 - 18:00", en: "09:00 - 18:00" }, 
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
