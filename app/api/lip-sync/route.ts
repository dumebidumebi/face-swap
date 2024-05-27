import { NextRequest } from "next/server"
import Replicate from 'replicate';
import * as Bytescale from "@bytescale/sdk";
import { uploadFromUrl } from "@/lib/uploadFromUrl";

export async function POST(req: NextRequest) {

  const replicate = new Replicate();
  const fileApi = new Bytescale.FileApi({
    apiKey: "public_12a1yvy634kYX3ss1W9DgV64CaeC"
  });


  const body = await req.json()
  console.log('body', body)
    const userId = body.userId
    const targetVid = body.targetVid
    const sourceAudio = body.audio
    const create_rvc_dataset = await replicate.run(
      "zsxkib/create-rvc-dataset:c445e27ff34574e92781c15c67db41835cedcdc27a19f527a7dcf37bd0ffe1ff",
      {
        input: {
          audio_name: "avatar",
          youtube_url: targetVid
        }
      }
    );
    console.log('create_rvc_dataset', create_rvc_dataset)
    const train_rvc_model = await replicate.run(
      "replicate/train-rvc-model:0397d5e28c9b54665e1e5d29d5cf4f722a7b89ec20e9dbf31487235305b1a101",
      {
        input: {
          epoch: 80,
          version: "v2",
          f0method: "rmvpe_gpu",
          batch_size: "7",
          dataset_zip: create_rvc_dataset,
          sample_rate: "48k"
        }
      }
    );
    console.log('train rvc model', train_rvc_model)
    const rvc = await replicate.run(
      "zsxkib/realistic-voice-cloning:0a9c7c558af4c0f20667c1bd1260ce32a2879944a0b9e44e1398660c077b1550",
      {
        input: {
          protect: 0.5,
          rvc_model: "CUSTOM",
          index_rate: 1,
          song_input: sourceAudio,
          reverb_size: 0.15,
          pitch_change: "no-change",
          rms_mix_rate: 0.25,
          filter_radius: 7,
          output_format: "mp3",
          reverb_damping: 0.7,
          reverb_dryness: 0.8,
          reverb_wetness: 0.2,
          crepe_hop_length: 32,
          pitch_change_all: 0,
          main_vocals_volume_change: 10,
          pitch_detection_algorithm: "mangio-crepe",
          instrumental_volume_change: 0,
          backup_vocals_volume_change: 0,
          custom_rvc_model_download_url: train_rvc_model
        }
      }
    );




  console.log('rvc', rvc)
  const outputUrl = await uploadFromUrl({
    accountId: "12a1yvy",
    apiKey: "public_12a1yvy634kYX3ss1W9DgV64CaeC",
    requestBody: {
      url: rvc
    }
  })
  return new Response(JSON.stringify(outputUrl?.fileUrl))


}
