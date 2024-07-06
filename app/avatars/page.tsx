"use client"
import { useEffect, useState } from 'react'
import { useOrganization, useUser } from '@clerk/nextjs';
import { redirect, useRouter } from 'next/navigation';
import { AVATARS } from '@/constants';
import AvatarCards from '@/components/AvatarCards';
import { State, create } from 'zustand'
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { UploadButton, UploadDropzone } from '@bytescale/upload-widget-react';
import { Upload } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { v4 } from "uuid";


export type PredictionAvatar = {
  voiceName: string,
  videoUrl: string,
  customThumbnail?: string,
  createdBy?: string,
} 
type Store = {
  predictionAvatar: {
    voiceName: string,
    videoUrl: string,
    customThumbnail?: string,
    createdBy?: string,
  } , 
  text: string, 
  customAvatar:string,
  setAvatar: (newstring: PredictionAvatar)=> void,
  setText: (newstring: string)=> void,
  setCustomAvatar: (newstring:string)=>void
}

export const useAvatarStore = create<Store>()((set) => ({
  predictionAvatar: {
    voiceName: '',
    videoUrl: '',
    customThumbnail: '',
    createdBy: '',
  },
  text : '',
  customAvatar: '',
  setAvatar: (newobj) => set(() => ({ predictionAvatar: newobj })),
  setText: (newtext) => set(() => ({ text: newtext })),
  setCustomAvatar: (newstring) => set(() => ({customAvatar: newstring}))
}))

async function StoreVoice(userId:string, voiceName:string, description:string, voiceFile:string) {
  const avatarId = v4()
  const refreshedCompany = await fetch("/api/add-voice", {
    method: "POST",
    body: JSON.stringify({userId:userId, voiceName: voiceName, description: description, voiceFile: voiceFile, avatarId:avatarId}),
  }).then((res) => res.json());
console.log(refreshedCompany)

  return refreshedCompany
}

async function DeleteAvatar(userId:string, voiceId:string) {
  const refreshedCompany = await fetch("/api/delete-avatar", {
    method: "POST",
    body: JSON.stringify({userId:userId, voiceId: voiceId}),
  }).then((res) => res.json());
console.log(refreshedCompany)

  return refreshedCompany
}

export default function Page() {;


  const { user } = useUser();
  const router  = useRouter()
  const [predictions, setPredictions] = useState([])
  const { predictionAvatar, setAvatar } = useAvatarStore()
  const customAvatar = useAvatarStore((state) => state.customAvatar)
  const setCustomAvatar = useAvatarStore((state) => state.setCustomAvatar)
  const [voiceName, setVoiceName] = useState('')
  const [description, setDescription] = useState('')
  const [targetInputText, setTargetInputText] = useState('')

  // const apiKey = process.env.BYTESCALE_PUBLIC_KEY
  const options = {
    apiKey: 'public_12a1yvy634kYX3ss1W9DgV64CaeC', // This is your API key.
    maxFileCount: 1,
    styles: {
      colors: {
        primary: '#2563eb'
      }
    }
  }; 

  async function GetAvatars(userId:string) {
    const refreshedCompany = await fetch("/api/get-avatars", {
      method: "POST",
      body: JSON.stringify({userId: userId}),
    }).then((res) =>  res.json());
    return refreshedCompany
  }
  useEffect(() => {
    if(user){
  GetAvatars(user?.id).then(
    (data)  => setPredictions(data)
  )
  
    } 
  },[user])


    
const handleNameChange = (event) => {
  setVoiceName(event.target.value);
};

const handleDescriptionChange = (event) => {
  setDescription(event.target.value);
};


const handleSubmit = () => {
  if(customAvatar == '') return alert('upload files or cancel')
  if (voiceName.trim() === '') {
    return alert('Enter name or cancel');
  }  
  StoreVoice(user?.id, voiceName, description, customAvatar).then(result => setPredictions(result))
};

function handleDelete(id:string){
  DeleteAvatar(user?.id, id).then(result => setPredictions(result))
  
}

return(
<>
<div className='flex flex-row justify-between'>
<h1 className='text-xl font-bold m-5'>Avatars</h1>
<Dialog>
  <DialogTrigger><Button className='w-fit m-5 rounded-sm'>Create Custom Avatar</Button></DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Create Custom Avatar</DialogTitle>
      <DialogDescription>
       Create your own custom avatar. Upload a video of someone and make them say anything!
      </DialogDescription>
    </DialogHeader>
    <div className='mx-5 mb-15'>
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
        <Button className='w-fit m-5 rounded-sm' onClick={handleSubmit}>Submit</Button>
        <Button className='w-fit  rounded-sm' variant='secondary'>Cancel</Button>
        </DialogClose>
        </div>
  </DialogContent>
</Dialog>
</div>
<div className='flex border-t p-10 flex-wrap gap-5'>
{AVATARS.map(item => (<AvatarCards key={item.voiceName} title={item.voiceName} custom={false} videoUrl={item.videoUrl} image={item.customThumbnail} obj={item} />))}
</div>
<h1 className='text-xl font-bold  m-5'>Custom Avatars</h1>
<div className='flex border-t p-10 mt-10 flex-wrap gap-5'>
{predictions && predictions.slice(0).reverse().map(item => (
  <AvatarCards key={item.voiceName} custom={true} id={item.id} title={item.voiceName} videoUrl={item.videoUrl} image={item.customThumbnail} obj={item} handleDelete={handleDelete} />
))}</div>
{/* <div><p>{item.input.target_video}</p><p>{item.input.swap_image}</p><p>{item.outputUrl}</p></div> */}
</>
)
}
