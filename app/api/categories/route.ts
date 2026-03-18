import { NextResponse } from "next/server";
import { db } from "@/lib/firebase/config";
import { collection, addDoc, doc, updateDoc, deleteDoc, getDoc } from "firebase/firestore";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const docRef = await addDoc(collection(db, "categories"), {
      ...data,
      createdAt: Date.now(),
    });
    const snap = await getDoc(docRef);
    return NextResponse.json({ id: snap.id, ...snap.data() });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { id, ...data } = await request.json();
    const ref = doc(db, "categories", id);
    await updateDoc(ref, data);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
    const ref = doc(db, "categories", id);
    await deleteDoc(ref);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
