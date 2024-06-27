import { NextRequest } from "next/server"
import Replicate from 'replicate';
import { ElevenLabsClient } from "elevenlabs";
import * as dotenv from "dotenv";
import * as Bytescale from "@bytescale/sdk";
import nodeFetch from "node-fetch";

const uploadManager = new Bytescale.UploadManager({
  fetchApi: nodeFetch as any, // import nodeFetch from "node-fetch"; // Only required for Node.js. TypeScript: 'nodeFetch as any' may be necessary.
  apiKey: 'secret_12a1yvy9LWv31G6KXg8kRa1wpFnj', // Get API key: https://www.bytescale.com/get-started
});


export async function POST(req: NextRequest) {
const body = await req.json()
const sourceText = body.sourceText
const sourceVid = body.voiceFile
const voiceName = body.voiceName
const description = body.description
const fileApi = new Bytescale.FileApi({
  fetchApi: nodeFetch as any,
  apiKey: "public_12a1yvy634kYX3ss1W9DgV64CaeC"
});
const jobApi = new Bytescale.JobApi({
  apiKey: 'secret_12a1yvy9LWv31G6KXg8kRa1wpFnj',
});


  console.log('sourcevid', sourceVid)
  // process api
  const vidInput = async ( ) => await fileApi.processFile({
    accountId: "12a1yvy",
    "filePath": sourceVid.slice(28),
    "transformation": "audio",
    "transformationParams": [
      {
        'f': 'mp3'
      }
    ]
  })
  .then(response => response.json()) // .text() | .json() | .blob() | .stream()
  const mp3 = await vidInput()

  // job api
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
  
  const fileUrl = mp3.summary.result.artifactUrl

    // Fetch the actual file from the URL
    const fileResponse = await fetch(fileUrl);
    const mp3Blob = await fileResponse.blob();

  // add voice to elevenlabs
  const form = new FormData();
  form.append("files", mp3Blob, "voice.mp3");
  form.append("name", voiceName);
  form.append("description", description);

  const options = {method: 'POST', headers: {'xi-api-key': 'd926eab35c7e400f832609912e2920b0'}, body: form};

  const voiceId = await fetch('https://api.elevenlabs.io/v1/voices/add', options)
    .then(response => response.json())
    // .then(response => console.log(response))
    .catch(err => console.error(err));
  
  console.log('jpg', (mp3))
  console.log('blob variable', (mp3Blob))
  console.log('data', (voiceId))

// save voice id and information to firebase 



const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;

if (!ELEVENLABS_API_KEY) {
  throw new Error("Missing ELEVENLABS_API_KEY in environment variables");
}



const client = new ElevenLabsClient({
  apiKey: ELEVENLABS_API_KEY,
});

const createAudioStreamFromText = async (text: string): Promise<Blob> => {
  const bod = {"text":sourceText,
    "model_id": "eleven_turbo_v2",
    "voice_settings":{"stability":1,"similarity_boost":1,"style":1,"use_speaker_boost":true},
    "seed":3}
  const options = {
    method: 'POST',
    headers: {'Content-Type': 'application/json', 'xi-api-key': ELEVENLABS_API_KEY},
    body: JSON.stringify(bod)
  };
  
  const url = 'https://api.elevenlabs.io/v1/text-to-speech/' + voiceId?.voice_id 
  // 
  const audioStream = await fetch(url, options)
  const blb = await audioStream.blob()
  console.log("audioStream" + blb)

  if(!audioStream) return
  return blb;
};

const stream = await createAudioStreamFromText(sourceText);

// upload to bytescale
const path = await uploadManager.upload({
  data: stream,
  
  // Required if 'data' is a stream, buffer, or string.
  mime: "audio/mpeg",
  // Required if 'data' is a stream, buffer, or string.
  originalFileName: "ttsstream",
  // Required if 'data' is a stream.
  // size: 5098, // e.g. fs.statSync("file.txt").size
})
.then(
  ({ fileUrl, filePath }) => {
    return fileUrl
  },
  error => console.error(`Error: ${error.message}`, error)
);


console.log('path', path)
console.log( 'stream type',  stream.type)

const optionsdel = {method: 'DELETE', headers: {'xi-api-key': ELEVENLABS_API_KEY}};
const url2 = 'https://api.elevenlabs.io/v1/voices/' + voiceId?.voice_id

const deleted = await fetch(url2, optionsdel)
  .then(response => response.json())
  .then(response => console.log(response))
  .catch(err => console.error(err));

console.log(deleted)
return new Response(JSON.stringify(path))
}
