"use client"
import { Suspense, useEffect, useState } from 'react'
import { useOrganization, useUser } from '@clerk/nextjs';
import Spinner from 'react-bootstrap/Spinner';
import useSWR from 'swr'
import { useQuery } from '@tanstack/react-query';
import { redirect, useRouter } from 'next/navigation';
import { Router } from 'next/router';
import LibraryCards from '@/components/LibraryCards';

import dynamic from 'next/dynamic'
import {Skeleton} from "@nextui-org/skeleton";
// const LibraryCards = dynamic(() => import('@/components/LibraryCards'), {
//   ssr: false, loading: () => <Skeleton className="h-[200px] w-[300px]  rounded-xl" />,
// })

async function DeleteStoredPrediction(userId:string, predictionId:string) {
  const refreshedCompany = await fetch("/api/delete-stored-prediction", {
    method: "POST",
    body: JSON.stringify({userId:userId, predictionId: predictionId}),
  }).then((res) => res.json());
console.log(refreshedCompany)

  return refreshedCompany
}



export default function Page() {;
  const [isLoaded, setIsLoaded] = useState(false);
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
    // if(user){
  
  GetLibrary(user?.id).then(
    (data)  =>{ setPredictions(data); }
  )
  
  
    // }
  },[user])

  function handleDelete(id:string){
    DeleteStoredPrediction(user?.id, id).then(result => setPredictions(result))
    
  }

  
  
  
return(
<>
<h1 className='text-xl font-bold m-5'>Library</h1> 
<div className='flex border-t pt-10 flex-wrap gap-5'>
{/* {!predictions && <Skeleton className="h-[200px] w-[300px] rounded-xl" /> } */}

{predictions && predictions.slice(0).reverse().map(item => (
<LibraryCards key={item.id} id={item.id} targetVideo={item.input.target_video} swapImage={item.input.swap_image} output={item.outputUrl}  handleDelete={handleDelete}/>
))}
</div>
{/* <div><p>{item.input.target_video}</p><p>{item.input.swap_image}</p><p>{item.outputUrl}</p></div> */}
</>
)
}
