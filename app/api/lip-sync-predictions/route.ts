
import { NextRequest } from "next/server"
import { arrayUnion, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase";
import Replicate from 'replicate';
import { uploadFromUrl } from "@/lib/uploadFromUrl";

export async function POST(req: NextRequest) {
  const body = await req.json()
  const predictionId = body?.predictionId
  const userId = body?.userId

  const replicate = new Replicate();
  
  const prediction = await replicate.predictions.get(predictionId)
  console.log(prediction?.status)

  if(prediction?.output){
    const outputUrl = await uploadFromUrl({
      accountId: "12a1yvy",
      apiKey: "public_12a1yvy634kYX3ss1W9DgV64CaeC",
      requestBody: {
        url: prediction?.output
      }
    })
    const storedPrediction = {id:prediction.id, input:prediction.input, outputUrl:outputUrl?.fileUrl, created_at:prediction.created_at, completed_at:prediction.completed_at, metrics:prediction.metrics}
    console.log("stored prediction", storedPrediction)
    // send prediction with new output to firebase
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef); 

    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      await updateDoc(docRef, {predictions: arrayUnion(storedPrediction)});
    }else{ await setDoc(docRef, {predictions: [storedPrediction]}, {merge: true}); }

  }
    
  
  
  return new Response(JSON.stringify(prediction))
}

