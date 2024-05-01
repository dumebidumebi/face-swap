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
import { Button } from '../../components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { PRODUCT_ITEMS } from '@/constants'
import { Badge } from '../../components/ui/badge'
import { loadStripe } from '@stripe/stripe-js';
import { useUser } from '@clerk/nextjs'
import { zoomies } from 'ldrs'
import Link from 'next/link'

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
    if(window.location){
    window.location = url
    }
  }
  return (
    <div className='flex flex-col justify-center'>
      <div className='mb-10 mt-5'>
     <h1 className='font-bold text-center'>Buy Credits</h1>
      <p className='text-center'>You need credits to generate videos! Larger Videos take up more credits, due to processing time.</p>
      </div>
        <div className='flex flex-wrap justify-center gap-5 sm:flex-row flex-col'>
          {PRODUCT_ITEMS.map(item =>(
          <Card className='min-w-80 max-w-80 ' key={item.title}>
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
      </div>
    </div>
  )
}
