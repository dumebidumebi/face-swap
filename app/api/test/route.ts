// import { Stripe } from "@stripe/stripe-js";
import { Metadata } from "@stripe/stripe-js";
import { headers } from "next/headers";
import { NextRequest } from "next/server"
import type  Stripe from "stripe";
import { arrayUnion, doc, getDoc, runTransaction, setDoc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { auth, clerkClient } from '@clerk/nextjs/server'


export async function POST(req: NextRequest) {

  // const body = await req.json()
  const { userId } = auth();

  console.log('user id' , userId)
  
 return new Response(JSON.stringify({status: 200}))

}


