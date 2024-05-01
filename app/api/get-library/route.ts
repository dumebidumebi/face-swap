import { db } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";
import { NextRequest } from "next/server"


export async function POST(req: NextRequest) {

  const body = await req.json()
  const userId = body.userId

  const docRef = doc(db, "users", userId);
  const docSnap = await getDoc(docRef); 

  if (docSnap.exists()) {
    const {predictions} = docSnap.data()
    console.log(predictions)
    return new Response(JSON.stringify(predictions))
  }else{return new Response("Database Error, Document does not exist", {status:400})}
}
