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
import { DownloadCloud, Expand, Fullscreen, Loader2Icon, Trash } from 'lucide-react'
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useUser } from '@clerk/nextjs'
import { PopoverClose } from '@radix-ui/react-popover'
import MyLoader from './loader'



export default function LibraryCards(props) {
 

  return (

          <Card className='min-w-40 max-w-60 p-0 rounded-md' key={props.input}>
          <CardContent className='mt-0 p-0'>
        
          {props.output ?
          <Image alt='thumbnails'  className='rounded-t-md' width={300} height={200} src={"https://upcdn.io/12a1yvy/image"+ props.output.slice(28)+"?w=300&h=200&fit=crop&f=webdp"} /> :
          <div className='w-80 h-40 flex flex-center justify-center pr-16'> <MyLoader/></div>
          }
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
          <Popover  >
            <PopoverTrigger asChild><Button size='sm'  variant='ghost' className='w-fit mx-5 rounded-sm'><Trash/></Button>
            </PopoverTrigger>
            <PopoverContent className='flex flex-col gap-5'>Are you sure you want to delete?
            <div className='flex gap-2'>
            <PopoverClose>
            <Button size='sm' className='w-fit  rounded-sm' onClick={() => props.handleDelete(props.id)}>Yes</Button>
            <Button size='sm'variant='secondary' className='w-fit rounded-sm'>Cancel</Button>
            </PopoverClose>
            </div>
            </PopoverContent>
          </Popover>
          </CardFooter>
        </Card>
  )}
  



