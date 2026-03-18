import { NextResponse } from "next/server";
import { db } from "@/lib/firebase/config";
import { collection, addDoc, doc, updateDoc, deleteDoc } from "firebase/firestore";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    await addDoc(collection(db, "messages"), {
      ...data,
      isRead: false,
      createdAt: Date.now(),
    });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { id, isRead } = await request.json();
    const ref = doc(db, "messages", id);
    await updateDoc(ref, { isRead });
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
    const ref = doc(db, "messages", id);
    await deleteDoc(ref);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
