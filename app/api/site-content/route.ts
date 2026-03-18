import { NextResponse } from "next/server";
import { db } from "@/lib/firebase/config";
import { doc, getDoc, setDoc } from "firebase/firestore";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const ref = doc(db, "site-content", "main");
    const snap = await getDoc(ref);

    const defaultContent = {
      hero: { title: { tr: "", en: "", de: "", fr: "" }, subtitle: { tr: "", en: "", de: "", fr: "" }, buttonText: { tr: "", en: "", de: "", fr: "" } },
      about: { title: { tr: "", en: "", de: "", fr: "" }, description: { tr: "", en: "", de: "", fr: "" }, stats: [] },
      logo: { url: "" },
      whyUs: [],
      footer: { address: "", phone: "", email: "", workingHours: { tr: "", en: "", de: "", fr: "" }, copyright: { tr: "", en: "", de: "", fr: "" } }
    };

    if (!snap.exists()) {
      return NextResponse.json(defaultContent);
    }

    // Merge snap.data() with defaultContent to ensure all fields exist
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
