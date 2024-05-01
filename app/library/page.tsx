"use client"
import { useEffect, useState } from 'react'
import { useOrganization, useUser } from '@clerk/nextjs';
import Spinner from 'react-bootstrap/Spinner';
import useSWR from 'swr'
import { useQuery } from '@tanstack/react-query';
import { redirect, useRouter } from 'next/navigation';
import { Router } from 'next/router';
import LibraryCards from '@/components/LibraryCards';




export default function Page() {;
  
  const { user } = useUser();
  const router  = useRouter()
  const [predictions, setPredictions] = useState([])
  async function GetLibrary(userId:string) {
    const refreshedCompany = await fetch("/api/get-library", {
      method: "POST",
      body: JSON.stringify({userId: userId}),
    }).then((res) =>  res.json());
    return refreshedCompany
  }
  useEffect(() => {
    if(user){
  const data  = GetLibrary(user?.id).then(
    (data)  => setPredictions(data)
  )
  
  console.log(data)
    }
  },[])

  
  
  
return(
<>
<h1 className='text-xl font-bold m-5'>Library</h1>
<div className='flex border-t pt-10 flex-wrap gap-5'>
{predictions && predictions.map(item => (<LibraryCards targetVideo={item.input.target_video} swapImage={item.input.swap_image} output={item.outputUrl} />))}
</div>
{/* <div><p>{item.input.target_video}</p><p>{item.input.swap_image}</p><p>{item.outputUrl}</p></div> */}
</>
)
}
