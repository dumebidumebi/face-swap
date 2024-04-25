
import { NextRequest } from "next/server"
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/firebase";
import Replicate from 'replicate';

export async function POST(req: NextRequest) {
  const replicate = new Replicate();
  
  const body = await req.json()
  console.log("incoming webhook req", req.json())


  return new Response(JSON.stringify(null))


}
