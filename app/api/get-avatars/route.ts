import { db } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";
import { NextRequest } from "next/server"


export async function POST(req: NextRequest) {

  const body = await req.json()
  const userId = body.userId

  const docRef = doc(db, "users", userId);
  const docSnap = await getDoc(docRef); 

  if (docSnap.exists()) {
    const {avatars} = docSnap.data()
    console.log("avatars",avatars)
    return new Response(JSON.stringify(avatars))
  }else{return new Response("Database Error, Document does not exist", {status:400})}
}
