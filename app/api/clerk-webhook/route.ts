// import { Stripe } from "@stripe/stripe-js";
import { Metadata } from "@stripe/stripe-js";
import { headers } from "next/headers";
import { NextRequest } from "next/server"
import type  Stripe from "stripe";
import { arrayUnion, doc, getDoc, runTransaction, setDoc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { clerkClient } from '@clerk/nextjs/server'


export async function POST(req: NextRequest) {

  const starterCredits = 20
  const data =  await req.json()
  const userId = await data?.data.id
  console.log("clerk webhook user", userId)

  const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef); 

    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      await setDoc(docRef, {predictions: [], credits: starterCredits}, {merge: true});
      await clerkClient.users.updateUserMetadata(userId, {
        publicMetadata: {
          credits: starterCredits
        }
      })
    }else{ await setDoc(docRef, {predictions: [], credits:starterCredits}, {merge: true}); 
    await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: {
        credits: starterCredits
      }
    })
  }

  
  return new Response(null, {status: 200})

}


