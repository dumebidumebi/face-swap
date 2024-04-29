import { NextRequest } from "next/server"
import Replicate from 'replicate';


export async function POST(req: NextRequest) {

  const replicate = new Replicate();

  const body = await req.json()
    const userId = body.userId
    const targetVid = body.targetVid
    const sourceAud = body.sourceAud
   
    // inputs are custom and depend on the api
    const input = {
      face: targetVid,
      input_audio: sourceAud,
      audio_duration: 5
    }

    // const output = await replicate.run(
    //   "xiankgx/video-retalking:1e959997f54af5daa345d6c063f9abeef361029e730d4f57e876e2d5b31b5e9b",
    //   {
    //     input: {
    //       face: targetVid,
    //       input_audio: sourceAud,
    //       audio_duration: 5
    //     }
    //   }
    // );
    const prediction = await replicate.predictions.create({
      version: "1e959997f54af5daa345d6c063f9abeef361029e730d4f57e876e2d5b31b5e9b",
      input: input
    });
    

    if(prediction?.error){
      return new Response(JSON.stringify(prediction))
    }


  return new Response(JSON.stringify(prediction))


}
