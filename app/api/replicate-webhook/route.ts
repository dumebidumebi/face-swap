// import { Stripe } from "@stripe/stripe-js";
import { Metadata } from "@stripe/stripe-js";
import { headers } from "next/headers";
import { NextRequest } from "next/server"
import type  Stripe from "stripe";
import { arrayUnion, doc, getDoc, runTransaction, setDoc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { auth, clerkClient } from '@clerk/nextjs/server'


export async function POST(req: NextRequest) {

  const starterCredits = 20
  const data =  await req.json()
  // const userId = await data?.data.id
  const { userId } = auth();
  console.log("clerk webhook user", userId)
  console.log("🪝 incoming webhook!", data.id);
  const prediction = data;
  const storedPrediction = {id:prediction.id, input:prediction.input, outputUrl:prediction.ouput, created_at:prediction.created_at, completed_at:prediction.completed_at, metrics:prediction.metrics, apiVersion: prediction.version}
  const lipSyncApiPrice = 0.000725
  const ttsApiPrice = 0.000225
  const faceSwapApiPrice = 0.000725
  // await saveToMyDatabase(prediction);
  // await sendSlackNotification(prediction);
  // res.end();
 
  const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef); 
    let newArray = []

  
    // check if the user has this prediction already stored, otherwise its not theirs

    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      const { credits } = docSnap.data()
      let newCredits = credits - (Math.ceil((lipSyncApiPrice * storedPrediction?.metrics?.predict_time)/0.1))
      if(newCredits <= 0){ newCredits = 0}

      const { predictions } = docSnap.data()


    // switch out prediction if it is the right one, determined by id  
    predictions.map(item => {
      if (prediction.id !== item.id) { newArray.push(item)} 
      else if (prediction.id === item.id) { newArray.push(storedPrediction)}

    updateDoc(docRef, {predictions: newArray, credits: newCredits});

    clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: {
        credits: newCredits
      }
    })

    })

  }else{return new Response("Database Error, Document does not exist", {status:400})}

  return new Response(null, {status:200})
}

  
 



