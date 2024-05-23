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
import { Skeleton } from './ui/skeleton'




export default function LibraryCards(props) {
 

  return (

          <Card className='min-w-40 max-w-60 p-0 rounded-none' key={props.input}>
          <CardContent className='mt-0 p-0'>
          
          <Image alt='thumbnails' className='rounded-top-sm' width={300} height={200} src={"https://upcdn.io/12a1yvy/image"+ props.output.slice(28)+"?w=300&h=200&fit=crop&f=webdp"} />
         
          </CardContent>
          <CardFooter className='p-2 gap-2'>
                      <Dialog>
              <DialogTrigger>
                <Button variant='outline' className='w-15'>
                <Fullscreen />
                </Button>
                </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Output Video</DialogTitle>
                  <DialogDescription className='flex items-center justify-center'>
                  <ReactPlayer controls style={{maxWidth:"400px", minInlineSize:"200px"}} url={props?.output} />
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
            <Button variant='outline' className='w-15'>
          <a href={props.output} download={props.output} className='w-fit  rounded-sm'><DownloadCloud/></a> 
          </Button>
          </CardFooter>
        </Card>
  )}
  



