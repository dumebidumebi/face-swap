"use client"
import { Button } from '@/components/ui/button';
import { SignedIn, SignedOut, useUser } from '@clerk/nextjs';
import React, { Suspense, useEffect, useState } from 'react'
import Link from 'next/link';
import PricingPage from '@/app/pricing-page/page';
import { UploadButton, UploadDropzone } from "@bytescale/upload-widget-react"
import { Upload } from 'lucide-react';
import ReactPlayer from 'react-player';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';
import MyLoader from '@/components/loader';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import ScrollToBottom from 'react-scroll-to-bottom';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@radix-ui/react-dropdown-menu';
import { Slider } from "@/components/ui/slider"
import { CarouselComponent } from '@/components/AvatarCarousel';
import { Badge } from '@/components/ui/badge';
import { PredictionAvatar, useAvatarStore } from '@/app/avatars/page';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import * as Bytescale from "@bytescale/sdk";
import nodeFetch from "node-fetch";
import { v4 } from "uuid";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DialogClose } from '@radix-ui/react-dialog';


// Default values shown


async function cancelPrediction(predict: string) {
  const cancel = await fetch("/api/lip-sync-cancel", {
    method: "POST",
    body: JSON.stringify({predictionId: predict}),
  }).then((res) => res.json());

  window.location.reload()
  return cancel
}

async function RunLipSync(userId: string, avatar:string, audio:string, pitch:number) {
  const refreshedCompany = await fetch("/api/lip-sync", {
    method: "POST",
    body: JSON.stringify({userId: userId, targetVid: avatar, audio: audio, pitch: pitch}),
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

async function Test() {
  const refreshedCompany = await fetch("/api/test", {
    method: "POST",
  })
  return refreshedCompany
}

const uploadManager = new Bytescale.UploadManager({
  fetchApi: nodeFetch as any, // import nodeFetch from "node-fetch"; // Only required for Node.js. TypeScript: 'nodeFetch as any' may be necessary.
  apiKey: 'secret_12a1yvy9LWv31G6KXg8kRa1wpFnj', // Get API key: https://www.bytescale.com/get-started
});




async function AddVoice(voiceName:string, description:string, voiceFile, text:string) {
  const refreshedCompany = await fetch("/api/elevenlabs-add-voice", {
    method: "POST",
    body: JSON.stringify({voiceName: voiceName, description: description, voiceFile: voiceFile, sourceText:text}),
  }).then((res) => res.json());
console.log(refreshedCompany)

  return refreshedCompany
}

async function StoreVoice(userId:string, voiceName:string, description:string, voiceFile:string) {
  const avatarId = v4()
  const refreshedCompany = await fetch("/api/add-voice", {
    method: "POST",
    body: JSON.stringify({userId:userId, voiceName: voiceName, description: description, voiceFile: voiceFile, avatarId:avatarId}),
  }).then((res) => res.json());
console.log(refreshedCompany)

  return refreshedCompany
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function Page() {
  const options = {
    apiKey: 'public_12a1yvy634kYX3ss1W9DgV64CaeC', // This is your API key.
    maxFileCount: 1
  }; 

  const { user } = useUser();
  const [targetInputText, setTargetInputText] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const setAvatar = useAvatarStore((state) => state.setAvatar)
  const predictionAvatar = useAvatarStore((state) => state.predictionAvatar)
  const text = useAvatarStore((state) => state.text)
  const setText = useAvatarStore((state) => state.setText)
  const customAvatar = useAvatarStore((state) => state.customAvatar)
  const setCustomAvatar = useAvatarStore((state) => state.setCustomAvatar)
  const [voiceName, setVoiceName] = useState('')
  const [description, setDescription] = useState('')


  async function cancel(){
    cancelPrediction(prediction?.id)
  }

  const preventRefresh = (e) => {
    return alert("data will get lost")
};

useEffect(() => {
    window.addEventListener('beforeunload', preventRefresh);

    return () => {
        window.removeEventListener('beforeunload', preventRefresh);
    }
}, [])

  async function uploadFile(){
    if ((predictionAvatar == null) && (customAvatar == '')) return alert('select or create avatar');
    if (text.trim() === '') {
      return alert('Enter input text');
    }
    
    // if (voiceId == null) return
    if(error){
      setError(null)
      setPrediction(null)
      }
    setError(null)
    setPrediction(null)
    setLoading(true)
    // create voice
    // run tts
    // delete created voice, but dont delete premade
    // const audio = await RunTts(user.id, text, voiceId)
    // await StoreVoice(user?.id, voiceName, description, customAvatar)
    const audio = await AddVoice(voiceName, description, customAvatar? customAvatar: predictionAvatar?.videoUrl, text)
    console.log(audio)

    // if(!audio) return
    // const lsAudio = await RunLipSync(user?.id, customAvatar? customAvatar: predictionAvatar?.videoUrl, audio, pitch )
    if(audio.error){
      return setError(`Upload Error ${audio.error}`)
    } 
          const predict = await RunRetalk(user?.id, customAvatar? customAvatar: predictionAvatar?.videoUrl , audio)
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
      
          
      }  
    
  
    function handleClick(obj: PredictionAvatar){
      setAvatar(obj)
      
    }
    const handleChange = (event) => {
      setText(event.target.value);
    
    };
    
    const handleNameChange = (event) => {
      setVoiceName(event.target.value);
    };

    const handleDescriptionChange = (event) => {
      setDescription(event.target.value);
    };


    const handleAvatarSubmit = () => {
      if(customAvatar == '') return alert('upload files or cancel')
      if (voiceName.trim() === '') {
        return alert('Enter name or cancel');
      }  
      StoreVoice(user?.id, voiceName, description, customAvatar)
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
     <div><h1 className='mt-5 font-medium'>Selected Avatar:  {voiceName? voiceName : (predictionAvatar?.voiceName ? predictionAvatar?.voiceName: '')}</h1></div>
     <CarouselComponent onClick={handleClick} />
     <Link className='flex mt-2 flex-row gap-2' href={"/avatars"}><p className=" underline ">Browse trending avatars</p><span><Badge>new</Badge></span></Link>
      <Dialog>
        <DialogTrigger className='text-left'><Button className='w-fit mb-10  rounded-sm'>Create Custom Avatar</Button></DialogTrigger>
        <DialogContent className='mx-0'>
          <DialogHeader>
            <DialogTitle>Create Custom Avatar</DialogTitle>
            <DialogDescription>
            Create your own custom avatar. Upload a video of someone and make them say anything!
            </DialogDescription>
          </DialogHeader>
          <div className=' mb-15'>
                <Label className='font-medium mt-5 mb-2'>Name</Label>
                <Input className='bg-white outline-none mb-5 ' 
                  value={voiceName}
                  onChange={handleNameChange} />
              <Label className='font-medium mb-2'>Source File</Label>
              <Label className='font-extralight m-2'> - Upload a video of someone talking for 1 minute</Label>
                  <UploadDropzone options={options}
                      onUpdate={({ uploadedFiles }) => {setCustomAvatar(uploadedFiles.map(x => x.fileUrl).join("\n"));setTargetInputText(uploadedFiles.map(x => x.originalFile.originalFileName).join("\n"));}}
                        height="200px" />
                <Label className='font-medium mb-2'>Description</Label>
                <Textarea className='bg-white outline-none mb-5 ' placeholder="how would you describe the voice" 
                  value={description}
                  onChange={handleDescriptionChange} />
              </div>
              <div className='flex justify-center'>
                <DialogClose>
              <Button className='w-fit m-5 rounded-sm' onClick={handleAvatarSubmit}>Submit</Button>
              <Button className='w-fit  rounded-sm' variant='secondary'>Cancel</Button>
              </DialogClose>
              </div>
        </DialogContent>
      </Dialog>

      <Button className='w-fit mb-10  rounded-sm' onClick={() => Test()}>Test</Button>

  <div className='flex flex-row gap-5'>
     <SignedIn>
      {user?.publicMetadata?.credits ? <Button size='sm' className='w-20 rounded-sm' onClick={uploadFile}> Run </Button>  : (<Button size='sm' className='w-fit rounded-sm'><Link href={"/pricing-page"}>Buy Credits</Link></Button>)} 
      {prediction && <Button  variant='outline' size='sm' className='w-20 rounded-sm' onClick={cancel}>Cancel</Button>}
     
      {/* <Button size='sm' className='w-20 rounded-sm' onClick={handleTest}> Test </Button> */}

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
        <MyLoader/> training avatar...
      </div>)
      }
     {error && <div className='text-[#ff0000] font-extralight'>Error:{error}</div>}
     {prediction && (
            <div className='font-extralight'>Prediction {prediction?.status}...</div>
            )}
     {prediction?.output && (<Suspense fallback={<Skeleton className="h-[125px] w-[250px] rounded-xl" />}><ReactPlayer controls style={{maxWidth:"400px", minInlineSize:"200px"}} url={prediction?.output} /></Suspense>)}
     <Accordion type="single" collapsible className=' w-96'>
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
     <p className='max-w-96 italic font-light'>and to be honest, um, im not sure I can be doing this for much longer. um, I mean, its been over 20 years and uh, you know, my body is aging.</p>
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