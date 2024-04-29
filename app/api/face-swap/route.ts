import { NextRequest } from "next/server"
import Replicate from 'replicate';


export async function POST(req: NextRequest) {

  const replicate = new Replicate();

  const body = await req.json()
    const userId = body.userId
    const targetVid = body.targetVid
    const sourceVid = body.sourceVid
   
    const input = {
      swap_image:  sourceVid,
      target_video: targetVid
  };

    const prediction = await replicate.predictions.create({
      version: "02fe0b57b6505cc04fd71204787d45392a25b26bd8d2c5af4ff4c932e138d4fb",
      input: input
    });
    
    if(prediction?.error){
      return new Response(JSON.stringify(prediction))
    }

    
  return new Response(JSON.stringify(prediction))


}
