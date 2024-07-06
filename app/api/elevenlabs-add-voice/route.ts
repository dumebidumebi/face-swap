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
  try {
    const body = await req.json();
    const { sourceText, voiceName, description } = body;
    const sourceVid =  body.voiceFile

    const fileApi = new Bytescale.FileApi({
      fetchApi: nodeFetch as any,
      apiKey: "public_12a1yvy634kYX3ss1W9DgV64CaeC",
    });

    const jobApi = new Bytescale.JobApi({
      apiKey: 'secret_12a1yvy9LWv31G6KXg8kRa1wpFnj',
    });

    console.log('sourcevid', sourceVid);

    // Process API
    const vidInput = async () => {
      try {
        const response = await fileApi.processFile({
          accountId: "12a1yvy",
          filePath: sourceVid.slice(28),
          transformation: "audio",
          transformationParams: [{ f: 'mp3' }],
        });
        return response.json();
      } catch (error) {
        throw new Error(`Failed to process file: ${error.message}`);
      }
    };

    const mp3 = await vidInput();
    let returnObj = mp3;

    // Job API
    while (returnObj?.status !== "Succeeded" && returnObj?.status !== "failed") {
      try {
        const jobStatus = async () => {
          const result = await jobApi.getJob({
            accountId: "12a1yvy",
            jobId: mp3.jobId,
            jobType: mp3.jobType,
          });
          return result;
        };

        const job = await jobStatus();
        returnObj = job;
      } catch (error) {
        throw new Error(`Failed to get job status: ${error.message}`);
      }
    }

    const fileUrl = returnObj?.summary?.result?.artifactUrl;

    // Fetch the actual file from the URL
    const fileResponse = await fetch(fileUrl);
    const mp3Blob = await fileResponse.blob();

    // Add voice to ElevenLabs
    const form = new FormData();
    form.append("files", mp3Blob, "voice.mp3");
    form.append("name", voiceName);
    form.append("description", description);

    const options = {
      method: 'POST',
      headers: { 'xi-api-key': 'd926eab35c7e400f832609912e2920b0' },
      body: form,
    };

    const voiceId = await fetch('https://api.elevenlabs.io/v1/voices/add', options)
      .then(response => response.json())
      .catch(err => {
        throw new Error(`Failed to add voice to ElevenLabs: ${err.message}`);
      });

    console.log('jpg', mp3);
    console.log('blob variable', mp3Blob);
    console.log('data', voiceId);

    const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
    if (!ELEVENLABS_API_KEY) {
      throw new Error("Missing ELEVENLABS_API_KEY in environment variables");
    }

    const client = new ElevenLabsClient({
      apiKey: ELEVENLABS_API_KEY,
    });

    const createAudioStreamFromText = async (text: string): Promise<Blob> => {
      try {
        const bod = {
          text: sourceText,
          model_id: "eleven_turbo_v2",
          voice_settings: { stability: 1, similarity_boost: 1, style: 1, use_speaker_boost: true },
          seed: 3,
        };

        const options = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'xi-api-key': ELEVENLABS_API_KEY },
          body: JSON.stringify(bod),
        };

        const url = 'https://api.elevenlabs.io/v1/text-to-speech/' + voiceId?.voice_id;
        const audioStream = await fetch(url, options);
        const blb = await audioStream.blob();

        console.log("audioStream", blb);
        return blb;
      } catch (error) {
        throw new Error(`Failed to create audio stream from text: ${error.message}`);
      }
    };

    const stream = await createAudioStreamFromText(sourceText);

    // Upload to Bytescale
    const path = await uploadManager.upload({
      data: stream,
      mime: "audio/mpeg",
      originalFileName: "ttsstream",
    }).then(
      ({ fileUrl, filePath }) => fileUrl,
      error => {
        throw new Error(`Failed to upload file: ${error.message}`);
      }
    );

    console.log('path', path);
    console.log('stream type', stream.type);

    const optionsdel = {
      method: 'DELETE',
      headers: { 'xi-api-key': ELEVENLABS_API_KEY },
    };
    const url2 = 'https://api.elevenlabs.io/v1/voices/' + voiceId?.voice_id;

    const deleted = await fetch(url2, optionsdel)
      .then(response => response.json())
      .then(response => {
        console.log(response);
        return response;
      })
      .catch(err => {
        throw new Error(`Failed to delete voice: ${err.message}`);
      });

    console.log(deleted, 'deleted');

    return new Response(JSON.stringify(path));
  } catch (error) {
    console.error('Error:', error.message);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}