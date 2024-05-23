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
import { DownloadCloud, Expand, Fullscreen } from 'lucide-react'
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




export default function AvatarCards(props) {

  const setAvatar = useAvatarStore((state) => state.setAvatar)
  const router  = useRouter()

  function handleClick(obj: PredictionAvatar){
    setAvatar(obj)
    router.push("/create/lip-sync")
  }
  return (

          <Card className='min-w-40 relative group max-w-60 p-0 rounded-lg hover:opacity-60' key={props.title} onClick={() => handleClick(props.obj)}>
          <CardContent className='mt-0 p-0 grid justify-center '>
          <Suspense>
          <Image alt='thumbnails' className='rounded-md max-h-40 min-w-40 max-w-60' width={300} height={200} src={props.image} />
          </Suspense>
          <div className='mx-5 p-2 text-white  hover:none absolute inset-x-0 bottom-5 text-center bg-white bg-opacity-10  rounded-lg backdrop-filter backdrop-blur-lg'>{props.title}</div>
          </CardContent>
        </Card>
  )}
  



