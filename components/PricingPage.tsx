"use client"
import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { Button } from './ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { PRODUCT_ITEMS } from '@/constants'
import { Badge } from './ui/badge'
import { loadStripe } from '@stripe/stripe-js';
import { useUser } from '@clerk/nextjs'
import { zoomies } from 'ldrs'

zoomies.register()


const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);
  

async function Checkout(userId:string, priceId:string, credits:number){
  const checkout = await fetch("/api/checkout_sessions", {
    method: "POST",
    body: JSON.stringify({userId: userId, priceId:priceId, credits:credits}),
  }).then((res) => res.json());
 return checkout
}

export default function PricingPage(props) {
  const { user } = useUser();
  const userId = user?.id
  const [loading, setLoading] = useState(false)

  async function HandleCheckout(userId:string, priceId:string, credits:number) {
    setLoading(true)
    const url = await Checkout(userId, priceId, credits)
    setLoading(false)
    window.location = url
  }
  return (
    <div>
    <Dialog>
    <DialogTrigger>
    <Button size='sm' className='w-fit min-w-20 rounded-sm'>{props.title}</Button> 
    </DialogTrigger>
    <DialogContent>
        <DialogHeader>
        <DialogTitle>Buy Credits</DialogTitle>
        <DialogDescription>
            You need credits to generate videos! Larger Videos take up more credits.
        </DialogDescription>
        </DialogHeader>
        {PRODUCT_ITEMS.map(item =>(
            <Card>
            <CardHeader>
              <CardTitle>{item.title}{(item.title === "50 Credits") && (<Badge className='ml-2 object-center' variant="outline">recommended</Badge>)}</CardTitle>
              <CardDescription>{item.description}</CardDescription>
            </CardHeader>
            <CardContent>
              {/* <p>Card Content</p> */}
            </CardContent>
            <CardFooter>
            <Button size='sm'  onClick={() => HandleCheckout(userId, item.priceId, item.credits)} className='w-fit min-w-20 rounded-sm'>{loading? <l-zoomies
          size="100"
          stroke="5"
          bg-opacity="0.1"
          speed="1.4" 
          color="white" 
        ></l-zoomies>: `Buy for ${item.cost}`}</Button> 
            </CardFooter>
          </Card>
        ))}
    </DialogContent>
    </Dialog>

    </div>
  )
}
