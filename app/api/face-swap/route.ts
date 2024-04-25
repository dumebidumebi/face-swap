import { readFile } from "fs/promises";
import { datastring } from "@/public/string";
import { NextRequest } from "next/server"
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/firebase";
import Replicate from 'replicate';


export async function POST(req: NextRequest) {
  const datar = (await readFile("public/arteta.mp4")).toString("base64");
  const image = `data:application/octet-stream;base64,${datar}`;
  const replicate = new Replicate();

  const body = await req.json()
    const userId = body.userId
    const targetVid = body.targetVid
    const sourceVid = body.sourceVid

    const input = {
      swap_image: datastring,
      target_video: image
  };

    // const output = await replicate.run("cloversid099/deepfake:02fe0b57b6505cc04fd71204787d45392a25b26bd8d2c5af4ff4c932e138d4fb", { input });
    // console.log(output)

    // let prediction = await replicate.predictions.create({
    //   version: "02fe0b57b6505cc04fd71204787d45392a25b26bd8d2c5af4ff4c932e138d4fb",
    //   input: input,
    //   output_file_prefix: "https://console.firebase.google.com/u/0/project/face-swap-6ae06/storage/face-swap-6ae06.appspot.com/files/~2Foutputs",
    // });

    const url = `https://api.replicate.com/v1/predictions`;

    const options = {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'authorization': `Bearer ${process.env.REPLICATE_API_TOKEN}`,
      },
      body: JSON.stringify({
        version:"02fe0b57b6505cc04fd71204787d45392a25b26bd8d2c5af4ff4c932e138d4fb",
        input: input,
        "webhook": "https://localhost:3000/api/face-swap-webhook",
        "webhook_events_filter": ["start", "completed"],
        "--upload-url": "gs://face-swap-6ae06.appspot.com/outputs/ten-hag-4k.jpeg"
      })
    };

    const data = await fetch(url, options)
    .then(async res => {
     return await res
    })
    .catch(err => console.error('error:' + err));


    console.log(data)
    console.log(data?.body)


  return new Response(JSON.stringify(null))


}
