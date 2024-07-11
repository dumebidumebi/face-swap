
import { NextRequest } from "next/server"
import { arrayUnion, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase";
import Replicate from 'replicate';
import * as Bytescale from "@bytescale/sdk";
import { uploadFromUrl } from "@/lib/uploadFromUrl";
import { auth, clerkClient } from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {
  const replicate = new Replicate();
  const body = await req.json()
  const avatar = body.targetVid
  const outputUrl = body.sourceAudio
  const { userId } = auth();
  const fileApi = new Bytescale.FileApi({
    apiKey: "public_12a1yvy634kYX3ss1W9DgV64CaeC"
  });


try {
  

    // process api
    const wavInput = async () => await fileApi.processFile({
      accountId: "12a1yvy",
      "filePath": outputUrl?.slice(28),
      "transformation": "audio",
      "transformationParams": [
        {
          'f': 'wav-rf64'
        }
      ]
    })
    .then(
      result => result.json(),
      error => console.error(error)
    );
    const wav = await wavInput()

    // job api
    const jobApi = new Bytescale.JobApi({
      apiKey: 'secret_12a1yvy9LWv31G6KXg8kRa1wpFnj',
    });
    let returnObj = wav
    while(returnObj?.status !== "Succeeded" && returnObj?.status !== "failed"){
    const jobStatus = async () => await jobApi.getJob({
        accountId: "12a1yvy",
        "jobId": wav.jobId,
        "jobType": wav.jobType
      })
      .then(
        result => result,
        error => console.error(error)
      );
      const job = await jobStatus()
      returnObj = job
    }
    
    // create retalk
    if(returnObj?.status == 'Succeeded'){
    console.log('wav input:', returnObj)
    const input = {
      face: avatar,
      input_audio: returnObj?.summary?.result?.artifactUrl
    }
    const videoRetalkPrediction = await replicate.deployments.predictions.create(
    "dumebidumebi",
    "dumebi-video-retalk",{
      input: input,
      webhook: 'https://www.createdeepfakes.com/api/replicate-webhook',
      webhook_events_filter: ["completed"]
    });
    if(videoRetalkPrediction?.error){
      return new Response(JSON.stringify(videoRetalkPrediction))
    }

    const storedPrediction = {id:videoRetalkPrediction.id, input:videoRetalkPrediction.input, created_at:videoRetalkPrediction.created_at, apiVersion: videoRetalkPrediction.version}
    
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef); 

  
    // check if the user has this prediction already stored, otherwise its not theirs
    if (docSnap.exists()) {
     await updateDoc(docRef, {predictions: arrayUnion(storedPrediction)});
    }

    return new Response(JSON.stringify(videoRetalkPrediction))
  }

} catch (error) {
  console.error('Error:', error.message);
  return new Response(null, { status: 500 });
}

  }

 
  
