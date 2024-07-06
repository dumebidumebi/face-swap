import { NextRequest } from "next/server"
import Replicate from 'replicate';
import { ElevenLabsClient } from "elevenlabs";
import * as dotenv from "dotenv";
import * as Bytescale from "@bytescale/sdk";
import nodeFetch from "node-fetch";
import { arrayUnion, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { clerkClient } from "@clerk/nextjs/server";


const uploadManager = new Bytescale.UploadManager({
  fetchApi: nodeFetch as any, // import nodeFetch from "node-fetch"; // Only required for Node.js. TypeScript: 'nodeFetch as any' may be necessary.
  apiKey: 'secret_12a1yvy9LWv31G6KXg8kRa1wpFnj', // Get API key: https://www.bytescale.com/get-started
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { voiceName, description } = body;
    const sourceVid =  body.voiceFile
    const userId = body?.userId
    const avatarId = body?.avatarId
    const docRef = doc(db, "users", userId);
 
    const avatarObj = {id:avatarId, voiceName:voiceName, videoUrl: sourceVid, description:description}

          
    await updateDoc(docRef, {avatars: arrayUnion(avatarObj)});
      
    // send prediction with new output to firebase
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      // console.log("Document data:", docSnap.data());
     

      const { avatars } = docSnap.data()
      
      return new Response(JSON.stringify(avatars))
    }else{return new Response("Database Error, Document does not exist", {status:400})}

  } catch (error) {
    console.error('Error:', error.message);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}