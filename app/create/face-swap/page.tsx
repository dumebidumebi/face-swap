"use client"
import { Button } from '@/components/ui/button';
import { SignedIn, SignedOut, useUser } from '@clerk/nextjs';
import React, { useEffect, useState } from 'react'
import Link from 'next/link';
import PricingPage from '@/components/PricingPage';
import { UploadButton } from "@bytescale/upload-widget-react"
import { Upload } from 'lucide-react';
import ReactPlayer from 'react-player'
import { zoomies } from 'ldrs'

zoomies.register()

// Default values shown



async function cancelPrediction(predict: Object) {
  const cancel = await fetch("/api/face-swap-cancel", {
    method: "POST",
    body: JSON.stringify({predictionId: predict?.id}),
  }).then((res) => res.json());

  window.location.reload()
  return cancel
}

async function RunDeepFake(userId: string, targetVid:string, sourceVid:string) {
  const refreshedCompany = await fetch("/api/face-swap", {
    method: "POST",
    body: JSON.stringify({userId: userId, targetVid: targetVid, sourceVid: sourceVid}),
  }).then((res) => res.json());
  return refreshedCompany
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function FaceSwap() {
  const options = {
    apiKey: "public_12a1yvy634kYX3ss1W9DgV64CaeC", // This is your API key.
    maxFileCount: 1
  }; 
  const { user } = useUser();
  const [targetVid, setTargetVid] = useState(null)
  const [sourceVid, setSourceVid] = useState(null)
  const [sourceInputText, setSourceInputText] = useState('')
  const [targetInputText, setTargetInputText] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null);
  const [prediction, setPrediction] = useState(null);

  
  async function cancel(){
    cancelPrediction(prediction)
  }
  async function uploadFile(){
    if (targetVid == null) return;
    if (sourceVid == null) return
    setLoading(true)
    const predict = await RunDeepFake(user?.id, targetVid, sourceVid)
    setPrediction(predict)
    if (prediction?.error) {
      setError(prediction.error);
      return;
    }

    while (
      prediction?.status !== "succeeded" &&
      prediction?.status !== "failed"
    ) {
      await sleep(1000);
      const response = await fetch("/api/face-swap-predictions",{
        method: "POST",
        body: JSON.stringify({predictionId: predict?.id, userId:user?.id}),
      }).then((res) => res.json());

      let getPredict = await response
      setPrediction(getPredict);
      if (getPredict?.error) {
        setError(getPredict?.error);
        setLoading(false)
        break
      }
      if(getPredict?.status === "succeeded"){
        setLoading(false)
        break
      }  
    }}
  

  return (
    <>
    <h1 className='text-xl font-bold m-5'>Face Swap</h1>
    <div className='flex flex-col m-5 md:flex-row max-w-full border-t border-b pt-5 pb-5'>
    <div className='flex flex-col h-full gap-2 mb-5 min-w-80'>
     <h1 className='font-semibold text-lg mb-5'>Input</h1>
     <h1 >Target Video</h1>
     <UploadButton options={options}
                onComplete={files => {setTargetVid(files.map(x => x.fileUrl).join("\n")); setTargetInputText(files.map(x => x.originalFile.originalFileName).join("\n"))}}>
    {({onClick}) =>
    <>
    <div onClick={onClick} className='max-w-80 border rounded-sm flex justify-left text-center content-center'>
      <Button variant='ghost' size='sm' className='w-fit rounded-sm'>
      <Upload />
      </Button>
      <p className='text-center truncate pt-1.5'>
      {targetInputText}
      </p>
      </div>
      </>
    }
  </UploadButton>
  <h1 className='mt-5'>Source Image</h1>
     <UploadButton options={options}
                onComplete={files => {setSourceVid(files.map(x => x.fileUrl).join("\n")); setSourceInputText(files.map(x => x.originalFile.originalFileName).join("\n"))}}>
    {({onClick}) =>
      <>
      <div onClick={onClick} className='max-w-80 mb-5 border rounded-sm flex justify-left text-center content-center'>
        <Button variant='ghost' size='sm' className='w-fit rounded-sm' >
        <Upload />
        </Button>
        <p className='text-center truncate pt-1.5'>
        {sourceInputText}
        </p>
        </div>
        </>
    }
  </UploadButton>
     <div className='flex flex-row gap-5'>
     <SignedIn>
      {!user?.publicMetadata?.subscription ? <Button size='sm' className='w-20 rounded-sm' onClick={uploadFile}> Run </Button> 
      : <PricingPage title={"Pricing"}/> } 
      {prediction && <Button  variant='outline' size='sm' className='w-20 rounded-sm' onClick={cancel}>Cancel</Button>}
     </SignedIn>
     <SignedOut>
      <Link href={"/clerk/sign-in"}>
     <Button size='sm' className='w-20 rounded-sm'> Run </Button>
     </Link>
     </SignedOut>
     </div>
    </div>
    <div className='sm:ml-5 mb:5 border'/>
    <div className='flex flex-col h-full gap-2 sm:ml-5'>
     <h1 className='font-semibold text-lg mb-5 mt-5 sm:mt-0'>Output</h1>
    {loading &&(
      <div className='min-w-350  min-h  rounded'>
        <l-zoomies
          size="100"
          stroke="5"
          bg-opacity="0.1"
          speed="1.4" 
          color="black" 
        ></l-zoomies>
      </div>)
      }
     {error && <div className='text-[#ff0000] font-extralight'>Error:{error}</div>}
     {prediction && (
            <div className='font-extralight'>Prediction {prediction?.status}...</div>
            )}
     {prediction?.output && (<ReactPlayer controls style={{maxWidth:"400px", minInlineSize:"200px"}} url={prediction?.output} />)}
    </div>
    </div>
    </>
  );
}



export default FaceSwap