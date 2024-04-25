"use client"
import { Button } from '@/components/ui/button';
import { SignedIn, SignedOut, useUser } from '@clerk/nextjs';
import React, { useEffect, useState } from 'react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from 'next/link';
import PricingPage from '@/components/PricingPage';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from '@/firebase';
import { v4 } from "uuid";
import { UploadButton } from "@bytescale/upload-widget-react"

async function RunDeepFake(userId: string, targetVid:string, sourceVid:string) {
  const refreshedCompany = await fetch("/api/face-swap", {
    method: "POST",
    body: JSON.stringify({userId: userId, targetVid: targetVid, sourceVid: sourceVid}),
  }).then((res) => res.json());
  return refreshedCompany
}

function FaceSwap() {
  const options = {
    apiKey: "public_12a1yvy634kYX3ss1W9DgV64CaeC", // This is your API key.
    maxFileCount: 1
  }; 

  const { user } = useUser();
  const refresh2  = (user?.id)

  const [targetVid, setTargetVid] = useState(null)
  const [sourceVid, setSourceVid] = useState(null)
  const [loading, setLoading] = useState(false)
  const targetOnChange = e => {
    setTargetVid(e.target.files[0]);
    console.log(e.target.files[0])
  }
  const sourceOnChange = e =>{
    setSourceVid(e.target.files[0]);
    console.log(e.target.files[0])
  }

  async function firebaseUpload(file: File) {
    const imageRef = ref(storage, `inputs/${file.name + v4()}`);
    const link = await uploadBytes(imageRef, file).then(async (snapshot)  => {
    return await getDownloadURL(snapshot.ref)})
    return link
}; 

  async function uploadFile(){
    if (targetVid == null) return;
    if (sourceVid == null) return
    setLoading(true)
    const targetlink = await firebaseUpload(targetVid)
    const sourcelink = await firebaseUpload(sourceVid)

    console.log("target link" ,targetlink)
    console.log("source link" ,sourcelink)
    RunDeepFake(user?.id, targetlink, sourcelink)
    setLoading(false)
    }
  

  return (
    <>
    <div className='flex h-full grid-flow-row grid gap-5'>
     <h1 className=''>Input</h1>
     <UploadButton options={options}
                onComplete={files => setTargetVid(files.map(x => x.fileUrl).join("\n"))}>
    {({onClick}) =>
      <button onClick={onClick}>
        Upload a file...
      </button>
    }
  </UploadButton>
     <form>
     <Label htmlFor="fs-target">Target Video</Label>
     <Input onChange={targetOnChange} id="fs-target" type="file" />
     </form>
     <Label htmlFor="fs-source">Face Source</Label>
     <Input onChange={sourceOnChange} id="fs-source" type="file" />
     <SignedIn>
      {!user?.publicMetadata?.subscription ? <Button size='sm' className='w-20 rounded-sm' onClick={uploadFile}> Run </Button> 
      : <PricingPage title={"Pricing"}/>} 
      {loading? <h1>loading</h1>: null}
     </SignedIn>
     <SignedOut>
      <Link href={"/clerk/sign-in"}>
     <Button size='sm' className='w-20 rounded-sm'> Run </Button>
     </Link>
     </SignedOut>
    </div>
    </>
  );
}



export default FaceSwap