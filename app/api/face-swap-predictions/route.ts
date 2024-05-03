
import { NextRequest } from "next/server"
import { arrayUnion, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase";
import Replicate from 'replicate';
import { uploadFromUrl } from "@/lib/uploadFromUrl";
import { clerkClient } from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {
  const body = await req.json()
  const predictionId = body?.predictionId
  const userId = body?.userId
  const docRef = doc(db, "users", userId);
  const docSnap = await getDoc(docRef); 
  const replicate = new Replicate();
  const faceSwapApiPrice = 0.000725
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
 


    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      const { credits } = docSnap.data()
      let newCredits = credits - (Math.ceil((faceSwapApiPrice * storedPrediction?.metrics?.predict_time)/0.1))
      // 0.1 is the price o standard credit
      if(newCredits <= 0){ 
        newCredits = 0
        await updateDoc(docRef, {predictions: arrayUnion(storedPrediction), credits: newCredits});
        await clerkClient.users.updateUserMetadata(userId, {
          publicMetadata: {
            credits: newCredits
          }
        })
      }else { await updateDoc(docRef, {predictions: arrayUnion(storedPrediction), credits: newCredits}); 
      await clerkClient.users.updateUserMetadata(userId, {
        publicMetadata: {
          credits: newCredits
        }
      })}

    }else{return new Response("Database Error, Document does not exist", {status:400})}

  }
    
  
  
  return new Response(JSON.stringify(prediction))
}

