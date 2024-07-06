"use client"
import React, { Suspense, useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from './ui/button'
import { Delete, DownloadCloud, Expand, Fullscreen, Trash } from 'lucide-react'
import Image from 'next/image'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import ReactPlayer from 'react-player'
import { useStore } from 'zustand'
import { PredictionAvatar, useAvatarStore } from '@/app/avatars/page'
import { redirect, useRouter } from 'next/navigation'
import profilePic from '/public/profile.jpg'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useUser } from '@clerk/nextjs'
import { PopoverClose } from '@radix-ui/react-popover'





export default function AvatarCards(props) {

  const setAvatar = useAvatarStore((state) => state.setAvatar)
  const router  = useRouter()
  const { user } = useUser();

  function handleClick(obj: PredictionAvatar){
    setAvatar(obj)
    router.push("/create/lip-sync")
  }

  return (

          <Card className='min-w-40 relative group max-w-60 p-0 rounded-md hover:opacity-60' key={props.title} >
          <CardContent className='mt-0 p-0 grid justify-center '>
          <Suspense>
          <Image onClick={() => handleClick(props.obj)} alt='thumbnails' className='rounded-t-md max-h-40 min-w-40 max-w-60' width={300} height={200} src={ props.custom ? "https://upcdn.io/12a1yvy/image"+ props.videoUrl.slice(28)+"?w=300&h=200&fit=crop&f=webdp&crop=smart" : props.image} />
          </Suspense>
          
          <div className='ml-2 p-1  hover:none flex justify-between bg-white bg-opacity-10  rounded-lg backdrop-filter backdrop-blur-lg'>
            {props.title}
            {props.custom &&
            <Popover  >
            <PopoverTrigger asChild><Button size='sm'  variant='ghost' className='w-fit  rounded-sm'><Trash/></Button>
            </PopoverTrigger>
            <PopoverContent className='flex flex-col gap-5'>Are you sure you want to delete?
            <div className='flex gap-2'>
            <PopoverClose>
            <Button size='sm' className='w-fit  rounded-sm' onClick={() => props.handleDelete(props.id)}>Yes</Button>
            <Button size='sm'variant='secondary' className='w-fit rounded-sm'>Cancel</Button>
            </PopoverClose>
            </div>
            </PopoverContent>
          </Popover>}
             </div>
          
          </CardContent>
         
        </Card>
  )}
  
  



