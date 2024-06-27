"use client"
import { useEffect, useState } from 'react'
import { useOrganization, useUser } from '@clerk/nextjs';
import { redirect, useRouter } from 'next/navigation';
import { AVATARS } from '@/constants';
import AvatarCards from '@/components/AvatarCards';
import { State, create } from 'zustand'

export type PredictionAvatar = {
  title: string,
  videoUrl: string,
  customThumbnail?: string,
  createdBy: string,
  gender: string
} 
type Store = {
  predictionAvatar: {
    title: string,
    videoUrl: string,
    customThumbnail?: string,
    createdBy: string,
    gender:string
  } , 
  text: string, 
  customAvatar:string,
  setAvatar: (newstring: PredictionAvatar)=> void,
  setText: (newstring: string)=> void,
  setCustomAvatar: (newstring:string)=>void
}

export const useAvatarStore = create<Store>()((set) => ({
  predictionAvatar: {
    title: '',
    videoUrl: '',
    customThumbnail: '',
    createdBy: '',
    gender: ''
  },
  text : '',
  customAvatar: '',
  setAvatar: (newobj) => set(() => ({ predictionAvatar: newobj })),
  setText: (newtext) => set(() => ({ text: newtext })),
  setCustomAvatar: (newstring) => set(() => ({customAvatar: newstring}))
}))


export default function Page() {;


  const { user } = useUser();
  const router  = useRouter()
  const [predictions, setPredictions] = useState([])
  const { predictionAvatar, setAvatar } = useAvatarStore()
  

return(
<>
<h1 className='text-xl font-bold m-5'>Avatars</h1>
<div className='flex border-t pt-10 flex-wrap gap-5'>
{AVATARS.map(item => (<AvatarCards key={item.title} title={item.title} videoUrl={item.videoUrl} image={item.customThumbnail} obj={item} />))}
</div>
{/* <div><p>{item.input.target_video}</p><p>{item.input.swap_image}</p><p>{item.outputUrl}</p></div> */}
</>
)
}
