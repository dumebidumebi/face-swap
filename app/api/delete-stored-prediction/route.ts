import { db } from "@/firebase";
import { arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";
import { NextRequest } from "next/server"


export async function POST(req: NextRequest) {

  const body = await req.json()
  const userId = body.userId
  const predictionId = body.predictionId

  const docRef = doc(db, "users", userId);
  const docSnap = await getDoc(docRef); 

  const { predictions } = docSnap.data()
  let newArray = []
  predictions.map(object =>{
    if(object.id !== predictionId){newArray.push(object)}
  } )

  await updateDoc(docRef, {predictions: newArray});

  if (docSnap.exists()) {
    // const {avatars} = docSnap.data()
    // console.log("avatars",avatars)
    return new Response(JSON.stringify(newArray))
  }else{return new Response("Database Error, Document does not exist", {status:400})}
}
