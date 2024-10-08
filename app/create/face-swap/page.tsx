"use client"
import { Button } from '@/components/ui/button';
import { SignedIn, SignedOut, useUser } from '@clerk/nextjs';
import React, { useEffect, useState } from 'react'
import Link from 'next/link';
import PricingPage from '@/app/pricing-page/page';
import { UploadButton } from "@bytescale/upload-widget-react"
import { Upload } from 'lucide-react';
import ReactPlayer from 'react-player'
import Image from 'next/image';
import MyLoader from '@/components/loader';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import ScrollToBottom from 'react-scroll-to-bottom';
// Default values shown



async function cancelPrediction(predict: string) {
  const cancel = await fetch("/api/face-swap-cancel", {
    method: "POST",
    body: JSON.stringify({predictionId: predict}),
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

function Page() {
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

  const preventRefresh = (e) => {
    return alert("data will get lost")
};

useEffect(() => {
    window.addEventListener('beforeunload', preventRefresh);

    return () => {
        window.removeEventListener('beforeunload', preventRefresh);
    }
}, [])

  async function cancel(){
    cancelPrediction(prediction?.id)
  }
  async function uploadFile(){
    if (targetVid == null) return alert('input target video');
    if (sourceVid == null) return alert('input source image')
    if(error){
      setError(null)
      setPrediction(null)
      }
    setError(null)
    setPrediction(null)
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
      {user?.publicMetadata?.credits ? (<Button size='sm' className='w-20 rounded-sm' onClick={uploadFile}> Run </Button>) : (<Button size='sm' className='w-fit rounded-sm'><Link href={"/pricing-page"}>Buy Credits</Link></Button>)}
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
    <div className='flex flex-col h-full gap-2 sm:ml-10'>
     <h1 className='font-semibold text-lg mb-5 mt-5 sm:mt-0'>Output</h1>
    {loading &&(
      <div className='min-w-350 min-h  rounded'>
      <MyLoader/> 
      </div>)
      }
     {error && <div className='text-[#ff0000] font-extralight'>Error:{error}</div>}
     {prediction && (
            <div className='font-extralight'>Prediction {prediction?.status}...</div>
            )}
     {prediction?.output && (<ReactPlayer controls style={{maxWidth:"400px", minWidth:"200px"}} url={prediction?.output} />)}
     <Accordion type="single" collapsible className='w-fit max-w-96'>
      <AccordionItem value="item-1">
        <AccordionTrigger >Show Logs</AccordionTrigger>
        <AccordionContent className='bg-slate-200 overflow-y-scroll h-20'>
        <ScrollToBottom style={{maxHeight: 300, width:400}} >
        {prediction?.logs && (<p>{prediction?.logs}
        </p>)}
        </ScrollToBottom>
        </AccordionContent>
      </AccordionItem>
    </Accordion>

    </div>
    </div>
    <h1 className='text-xl font-bold mb-5 ml-5 mt-10'>Examples</h1>
    <div className='flex flex-col m-5 sm:flex-row max-w-full border-t border-b pt-5 pb-5'>
    <div className='flex flex-col h-full gap-2 mb-5 min-w-80 sm:pr-10 sm:border-r'>
     <h1 className='font-semibold text-lg mb-5'>Input</h1>
     <h1 >Example Source Image</h1>
     <Image alt='thumbnails' className='rounded-top-sm mb-10' width={300} height={200} src={"https://upcdn.io/12a1yvy/raw/uploads/2024/05/01/4keRocjt3q-mark.jpg"+"?w=300&h=200&fit=crop&f=webdp"} />
     <h1 >Example Target Video </h1>
     <ReactPlayer controls style={{maxWidth:"300px", maxHeight:"200px"}} url={"https://upcdn.io/12a1yvy/raw/uploads/2024/05/01/4keRoh2kGb-heygen-talking-vid.mp4"} />
    </div>
    <div className='flex flex-col h-full sm:pl-10 sm:ml-0'>
     <h1 className='font-semibold text-lg mb-10 pb-5 mt-5  ml-0 sm:mt-0'>Output</h1>
     <ReactPlayer controls style={{maxWidth:"300px", maxHeight:"200px"}} url={"https://upcdn.io/12a1yvy/raw/uploads/2024/05/01/4keRnQo86H-file.mp4"} />
    </div>
    </div>
    
    </>
  );
}



export default Page