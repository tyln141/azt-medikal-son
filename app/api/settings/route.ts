import { NextResponse } from "next/server";
import { db } from "@/lib/firebase/config";
import { doc, setDoc } from "firebase/firestore";

export const dynamic = "force-dynamic";

export async function PUT(request: Request) {
  try {
    const data = await request.json();
    const ref = doc(db, "settings", "main");
    await setDoc(ref, data, { merge: true });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
