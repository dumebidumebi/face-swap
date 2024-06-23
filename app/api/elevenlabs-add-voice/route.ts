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
  // const body = await req.json()


const form = new FormData();
form.append("files", `["tatum.mp3"]`);
form.append("name", "tatum");
form.append("description", "athletic man , deep voice");

const options = {method: 'POST', headers: {'xi-api-key': 'd926eab35c7e400f832609912e2920b0'}, body: form};

const data = fetch('https://api.elevenlabs.io/v1/voices/add', options)
  .then(response => response.json())
  .then(response => console.log(response))
  .catch(err => console.error(err));



return new Response(JSON.stringify(data))
}
