import { NextResponse } from "next/server";
import { db } from "@/lib/firebase/config";
import { collection, addDoc, doc, setDoc, deleteDoc, getDoc } from "firebase/firestore";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const docRef = await addDoc(collection(db, "products"), {
      ...data,
      createdAt: Date.now(),
    });
    const snap = await getDoc(docRef);
    return NextResponse.json({ id: snap.id, ...snap.data() });
  } catch (error: any) {
    console.error("POST Product Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { id, ...data } = await request.json();
    
    if (!id) {
       return NextResponse.json({ error: "ID required" }, { status: 400 });
    }

    console.log("UPDATING PRODUCT:", id, data);
    const ref = doc(db, "products", id);
    
    // Using setDoc with merge: true for reliable updates
    await setDoc(ref, data, { merge: true });
    
    return NextResponse.json({ success: true, id, ...data });
  } catch (error: any) {
    console.error("PUT Product Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
    
    console.log("DELETE PRODUCT:", id);
    const ref = doc(db, "products", id);
    
    await deleteDoc(ref);
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("DELETE Product Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
