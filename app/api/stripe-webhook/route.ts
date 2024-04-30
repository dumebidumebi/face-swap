// import { Stripe } from "@stripe/stripe-js";
import { Metadata } from "@stripe/stripe-js";
import { headers } from "next/headers";
import { NextRequest } from "next/server"
import type  Stripe from "stripe";
import { doc, runTransaction } from "firebase/firestore";
import { db } from "@/firebase";
import { clerkClient } from "@clerk/nextjs";


const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// This is your Stripe CLI webhook secret for testing your endpoint locally.
const endpointSecret = "whsec_fKHyuy90noZEn1RgTBkfOteCSsCdIlX3";

async function addToCredits(userId:string, amount:number) {
  try {
    await runTransaction(db, async (transaction) => {
      const docRef = doc(db, "users", userId);
      const myDoc = await transaction.get(docRef);
      if (!myDoc.exists()) {
        throw "Document does not exist!";
      }
  
      const newCredits = myDoc.data().credits + amount;
      transaction.update(docRef, { credits: newCredits });

      // set metadata
      await clerkClient.users.updateUserMetadata(userId, {
        publicMetadata: {
          credits: newCredits
        }
      })
      
    });
    console.log("Transaction successfully committed!");
  } catch (e) {
    console.log("Transaction failed: ", e);
  }
}

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = headers().get("Stripe-Signature") ?? ''

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, endpointSecret);
  } catch (err) {
    return new Response(`Webhook Error: ${err.message}`, {status:400});
    
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const completedEvent = event.data.object as Stripe.Checkout.Session & { 
        metadata: Metadata
      }
      // Then define and call a function to handle the event payment_intent.succeeded
      const userId = completedEvent.metadata.userId
      const credits = completedEvent.metadata.credits

      // firebase incrementation here
      // this should be the 
      
      addToCredits(userId, parseInt(credits))
      

      console.log(`useId:`,userId)
      console.log(`metadata:`, credits)
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }


  return new Response(null, {status: 200})

}


