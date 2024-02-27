import CreateCompany from "@/lib/CreateCompany"
import { NextRequest } from "next/server"
import { collection, addDoc, setDoc, doc } from "firebase/firestore"; 
import { db } from "@/firebase";

export async function POST(req: NextRequest) {

  const body = await req.json()
  const data = await CreateCompany(body)

try {
  const foo = {...data}
if(data&&body){

  const docRef = collection(db, "users")
  const userRef = await setDoc(doc(docRef, body.user.id),
  {companies: [{
    orgId:body.organization.id, 
    orgName: body.organization.name,
    gustoData: foo}]
  })
    
  return new Response(JSON.stringify(data))
}
 
} catch (e) {
  console.error("Error adding document: ", e);
  return Response.error()
}
  
}