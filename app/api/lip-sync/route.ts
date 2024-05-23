import { NextRequest } from "next/server"
import Replicate from 'replicate';
import * as Bytescale from "@bytescale/sdk";

export async function POST(req: NextRequest) {

  const replicate = new Replicate();
  const fileApi = new Bytescale.FileApi({
    apiKey: "public_12a1yvy634kYX3ss1W9DgV64CaeC"
  });


  const body = await req.json()
  console.log('body', body)
    const userId = body.userId
    const targetVid = body.targetVid
    const sourceText = body.sourcetext
    const targetVidmp3 = await fetch("https://upcdn.io/12a1yvy/audio" + targetVid.slice(28) + "?f=mp3").then(res => res.json())
    const mp3Input = async () => await fileApi.processFile({
      accountId: "12a1yvy",
      "filePath": targetVid?.slice(28),
      "transformation": "audio",
      "transformationParams": [
        {
          'f': 'mp3'
        }
      ]
    })
    .then(
      result => result.json(),
      error => console.error(error)
    );
    const mp3 = await mp3Input()

    // job api
    const jobApi = new Bytescale.JobApi({
      apiKey: 'secret_12a1yvy9LWv31G6KXg8kRa1wpFnj',
    });
    let returnObj = mp3
    while(returnObj?.status !== "Succeeded" && returnObj?.status !== "failed"){
    const jobStatus = async () => await jobApi.getJob({
        accountId: "12a1yvy",
        "jobId": mp3.jobId,
        "jobType": mp3.jobType
      })
      .then(
        result => result,
        error => console.error(error)
      );
      const job = await jobStatus()
      returnObj = job
    }
    if(returnObj?.status == 'Succeeded'){
    console.log('source text:', sourceText)
    // inputs are custom and depend on the api
    const textToSpeechInput = {
      "text": sourceText,
      "seed": 6,
      "preset": "high_quality",
      "voice_a": "custom_voice",
      "voice_b": "custom_voice",
      "voice_c": "custom_voice",
      "custom_voice": returnObj.summary.result.artifactUrl,
      "cvvp_amount": 0.1,
    }
  
    const prediction = await replicate.predictions.create({
      version: "e9658de4b325863c4fcdc12d94bb7c9b54cbfe351b7ca1b36860008172b91c71",
      input: textToSpeechInput
    });
    if(prediction?.error){
      return new Response(JSON.stringify(prediction))
    }


  return new Response(JSON.stringify(prediction))

  }
}
