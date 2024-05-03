"use client"
import React, { useEffect, useState } from 'react'
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
import { Loader2 } from 'lucide-react'
import MyLoader from '@/components/loader'


async function Checkout(userId:string, priceId:string, credits:number, referral:string){
  const checkout = await fetch("/api/checkout_sessions", {
    method: "POST",
    body: JSON.stringify({userId: userId, priceId:priceId, credits:credits, referral}),
  }).then((res) => res.json());
 return checkout
}

export default function Page() {
  const { user } = useUser();
  const userId = user?.id
  const [loading, setLoading] = useState(false)
  const tolt = window.tolt_referral

 useEffect(() => {
   console.log(tolt)
   console.log(window)
 }, [])
 
  async function HandleCheckout(userId:string, priceId:string, credits:number) {
    setLoading(true)
    window.tolt.signup(user?.primaryEmailAddress)
    const url = await Checkout(userId, priceId, credits, tolt)
    setLoading(false)
    if(window.location){
    window.location = url
    }
  }
  return (
    <div className='flex flex-col justify-center'>
      <script async src="https://cdn.tolt.io/tolt.js" data-tolt="YOUR-ID"></script>
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
          </CardContent>
          <CardFooter>
          <Button size='sm'  onClick={() => HandleCheckout(userId, item.priceId, item.credits)} className='w-fit min-w-20 rounded-sm'>{loading? <MyLoader/> : `Buy for ${item.cost}`}</Button> 
          </CardFooter>
        </Card>
        ))}
      </div>
    </div>
  )
}
