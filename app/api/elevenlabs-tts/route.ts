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
  console.log('body', body)
  const userId = body.userId
  const sourceText = body.sourceText
  const gender = body.gender

dotenv.config();

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;

if (!ELEVENLABS_API_KEY) {
  throw new Error("Missing ELEVENLABS_API_KEY in environment variables");
}

const client = new ElevenLabsClient({
  apiKey: ELEVENLABS_API_KEY,
});

const createAudioStreamFromText = async (text: string): Promise<Buffer> => {
  const audioStream = await client.generate({
    voice: (gender == "male")? "Brian" : "Rachel",
    model_id: "eleven_turbo_v2",
    text,
  });

  const chunks: Buffer[] = [];
  for await (const chunk of audioStream) {
    chunks.push(chunk);
  }

  const content = Buffer.concat(chunks);
  return content;
};

const stream = await createAudioStreamFromText(sourceText);

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


console.log(path)

return new Response(JSON.stringify(path))


}
