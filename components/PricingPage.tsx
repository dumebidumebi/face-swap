import React from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { Button } from './ui/button'
  
export default function PricingPage(props) {
  return (
    <div>
    <Dialog>
    <DialogTrigger>
    <Button size='sm' className='w-20 rounded-sm'>{props.title}</Button> 
    </DialogTrigger>
    <DialogContent>
        <DialogHeader>
        <DialogTitle>Pricing</DialogTitle>
        <DialogDescription>
            This is our pricing page
        </DialogDescription>
        </DialogHeader>
    </DialogContent>
    </Dialog>

    </div>
  )
}
