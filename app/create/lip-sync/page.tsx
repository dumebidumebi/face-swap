"use client"
import { Button } from '@/components/ui/button';
import { SignedIn, SignedOut, useUser } from '@clerk/nextjs';
import React, { Suspense, useEffect, useState } from 'react'
import Link from 'next/link';
import PricingPage from '@/app/pricing-page/page';
import { UploadButton } from "@bytescale/upload-widget-react"
import { Upload } from 'lucide-react';
import ReactPlayer from 'react-player';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';
import MyLoader from '@/components/loader';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import ScrollToBottom from 'react-scroll-to-bottom';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@radix-ui/react-dropdown-menu';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { CarouselComponent } from '@/components/AvatarCarousel';
import { Badge } from '@/components/ui/badge';
import { PredictionAvatar, useAvatarStore } from '@/app/avatars/page';

// Default values shown


async function cancelPrediction(predict: string) {
  const cancel = await fetch("/api/lip-sync-cancel", {
    method: "POST",
    body: JSON.stringify({predictionId: predict}),
  }).then((res) => res.json());

  window.location.reload()
  return cancel
}

async function RunLipSync(userId: string, avatar:string, text:string) {
  const refreshedCompany = await fetch("/api/lip-sync", {
    method: "POST",
    body: JSON.stringify({userId: userId, targetVid: avatar, sourcetext: text}),
  }).then((res) => res.json());
  return refreshedCompany
}

async function RunRetalk(userId: string, avatar:string, outputUrl:string) {
  const refreshedCompany = await fetch("/api/retalk", {
    method: "POST",
    body: JSON.stringify({userId: userId, targetVid: avatar, sourceAudio: outputUrl}),
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
  const [targetInputText, setTargetInputText] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const setAvatar = useAvatarStore((state) => state.setAvatar)
  const predictionAvatar = useAvatarStore((state) => state.predictionAvatar)
  const [text, setText] = useState('');
  const [customAvatar, setCustomAvatar] = useState(null);



  async function cancel(){
    cancelPrediction(prediction?.id)
  }



  async function uploadFile(){
    if (predictionAvatar == null) return;
    if (text == null) return
    if(error){
      setError(null)
      setPrediction(null)
      }
    setLoading(true)
    const predict = await RunLipSync(user?.id, customAvatar? customAvatar: predictionAvatar?.videoUrl, text)
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
      const response = await fetch("/api/lip-sync-predictions",{
        method: "POST",
        body: JSON.stringify({predictionId: prediction? prediction?.id : predict?.id, userId:user?.id, avatar: (customAvatar? customAvatar: predictionAvatar?.videoUrl)}),
      }).then((res) => res.json());

      let getPredict = await response
      setPrediction(getPredict);
      if (getPredict?.error) {
        setError(getPredict?.error);
        setLoading(false)
        break
      }
      if(getPredict?.status === "succeeded"){
        // setLoading(false)
        
          const predict = await RunRetalk(user?.id, customAvatar? customAvatar: predictionAvatar?.videoUrl , getPredict?.output)
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
            const response = await fetch("/api/retalk-predictions",{
              method: "POST",
              // recheck this
              body: JSON.stringify({predictionId: predict?.id, userId:user?.id, avatar:(customAvatar? customAvatar: predictionAvatar?.videoUrl)}),
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
            }}
              break
      }  
    }}
  
    function handleClick(obj: PredictionAvatar){
      setAvatar(obj)
      
    }
    const handleChange = (event) => {
      setText(event.target.value);
    };

  return (
    <>
    <h1 className='text-xl font-bold m-5'>Lip Sync</h1>
    <div className='flex flex-col m-5 md:flex-row max-w-full border-t border-b pt-5 pb-5'>
    <div className='flex flex-col h-full gap-2 mb-5 min-w-80'>
     <h1 className='font-bold text-lg mb-5'>Input</h1>
     <Label className='font-medium'>Input Text</Label>
      <Textarea className='bg-white outline-none max-w-80 md:max-w-96' placeholder="what do you want them to say..." id="message" 
        value={text}
        onChange={handleChange} />
     <div><h1 className='mt-5 font-medium'>Selected Avatar:  {predictionAvatar?.title ? predictionAvatar?.title: ''}</h1></div>
     <CarouselComponent onClick={handleClick} />
     <Link className='flex mt-2 flex-row gap-2' href={"/avatars"}><p className=" underline ">Browse trending avatars</p><span><Badge>new</Badge></span></Link>
      <Accordion type="single" collapsible className='w-fit mt-0 mb-5'>
          <AccordionItem value="item-1">
            <AccordionTrigger>Create Custom Avatar</AccordionTrigger>
            <AccordionContent className='overflow-y-scroll h-20'>
            <p className='font-light'>Upload Video of Person talking</p>
            <UploadButton options={options}
                          onComplete={files => {setCustomAvatar(files.map(x => x.fileUrl).join("\n"));setTargetInputText(files.map(x => x.originalFile.originalFileName).join("\n"))}}>
              {({onClick}) =>
                <>
                <div onClick={onClick} className='max-w-full border-2 mb-5 rounded-sm flex justify-left text-center content-center'>
                  <Button variant='ghost' size='sm' className='w-fit rounded-sm' >
                  <Upload />
                  </Button>
                  <p className='text-center truncate pt-1.5'>
                  {targetInputText}
                  </p>
                  </div>
                  </>
              }
            </UploadButton>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
  
  <div className='flex flex-row gap-5'>
     <SignedIn>
      {user?.publicMetadata?.credits ? <Button size='sm' className='w-20 rounded-sm' onClick={uploadFile}> Run </Button>  : (<Button size='sm' className='w-fit rounded-sm'><Link href={"/pricing-page"}>Buy Credits</Link></Button>)} 
      {prediction && <Button  variant='outline' size='sm' className='w-20 rounded-sm' onClick={cancel}>Cancel</Button>}
     </SignedIn>
     <SignedOut>
      <Link href={"/clerk/sign-in"}>
     <Button size='sm' className='w-20 rounded-sm'> Run </Button>
     </Link>
     </SignedOut>
     </div>
    </div>
    <div className='sm:ml-10 mb:5 border'/>
    <div className='flex flex-col h-full gap-2 sm:ml-10'>
     <h1 className='font-semibold text-lg mb-5 mt-5 sm:mt-0'>Output</h1>
    {loading &&(
      <div className='min-w-350  min-h  rounded'>
        <MyLoader/> 
      </div>)
      }
     {error && <div className='text-[#ff0000] font-extralight'>Error:{error}</div>}
     {prediction && (
            <div className='font-extralight'>Prediction {prediction?.status}...</div>
            )}
     {prediction?.output && (<Suspense fallback={<Skeleton className="h-[125px] w-[250px] rounded-xl" />}><ReactPlayer controls style={{maxWidth:"400px", minInlineSize:"200px"}} url={prediction?.output} /></Suspense>)}
     <Accordion type="single" collapsible className='w-fit max-w-80'>
      <AccordionItem value="item-1">
        <AccordionTrigger>Show Logs</AccordionTrigger>
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
     <h1 >Example Text</h1>
     <p className='w-96 italic font-light'>and to be honest, um, im not sure I can be doing this for much longer. um, I mean, its been over 20 years and uh, you know, my body is aging.</p>
    </div>
    <div className='flex flex-col h-full sm:pl-10 sm:ml-0'>
     <h1 className='font-semibold text-lg mb-10 pb-5 mt-5  ml-0 sm:mt-0'>Output</h1>
     <Suspense fallback={<Skeleton className="h-[125px] w-[250px] rounded-xl" />}>
     <ReactPlayer controls style={{maxWidth:"300px", maxHeight: "200px"}} url={"https://upcdn.io/12a1yvy/raw/uploads/2024/05/23/4kbXxmhJ43-file.mp4"} />
     </Suspense>
    </div>
    </div>
    </>
  );
}



export default Page