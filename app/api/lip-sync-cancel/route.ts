
import { NextRequest } from "next/server"
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/firebase";
import Replicate from 'replicate';
import { Server } from "socket.io";

export async function POST(req: NextRequest) {
  const body = await req.json()
  const predictionId = body?.predictionId

  const replicate = new Replicate();
  
  const prediction = await replicate.predictions.cancel(predictionId)
  console.log(prediction?.status)
  return new Response(JSON.stringify(prediction))


}
