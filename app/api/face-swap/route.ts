import { NextRequest } from "next/server"
import Replicate from 'replicate';
import * as Bytescale from "@bytescale/sdk";
import nodeFetch from "node-fetch";


export async function POST(req: NextRequest) {

  const replicate = new Replicate();
  const body = await req.json()
    const userId = body.userId
    const targetVid = body.targetVid
    const sourceVid = body.sourceVid
    const fileApi = new Bytescale.FileApi({
      fetchApi: nodeFetch as any,
      apiKey: "public_12a1yvy634kYX3ss1W9DgV64CaeC"
    });
    const jobApi = new Bytescale.JobApi({
      apiKey: 'secret_12a1yvy9LWv31G6KXg8kRa1wpFnj',
    });
  
  
      console.log("https://upcdn.io/12a1yvy/image" + sourceVid.slice(28) + '?f=jpeg' )
      // process api
      const jpgInput = async ( ) => await fileApi.processFile({
        accountId: "12a1yvy",
        "filePath": sourceVid.slice(28),
        "transformation": "image",
        "transformationParams": [
          {
            'f': 'jpeg'
          }
        ]
      })
      .then(
        result => result.raw.url,
        error => console.error(error)
      );
      const jpg = await jpgInput()
      console.log('jpg', (jpg))
  
      // job api
      // let returnObj = jpg
      // while(returnObj?.status !== "Succeeded" && returnObj?.status !== "failed"){
      // const jobStatus = async () => await jobApi.getJob({
      //     accountId: "12a1yvy",
      //     "jobId": jpg.jobId,
      //     "jobType": jpg.jobType
      //   })
      //   .then(
      //     result => result,
      //     error => console.error(error)
      //   );
      //   const job = await jobStatus()
      //   returnObj = job
      // }
      // if(returnObj?.status == 'Succeeded'){
      
   
          const input = {
            swap_image:  jpg,
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
