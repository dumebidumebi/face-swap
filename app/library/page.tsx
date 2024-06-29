"use client"
import { Suspense, useEffect, useState } from 'react'
import { useOrganization, useUser } from '@clerk/nextjs';
import Spinner from 'react-bootstrap/Spinner';
import useSWR from 'swr'
import { useQuery } from '@tanstack/react-query';
import { redirect, useRouter } from 'next/navigation';
import { Router } from 'next/router';
// import LibraryCards from '@/components/LibraryCards';
import { Skeleton } from '@/components/ui/skeleton';
import dynamic from 'next/dynamic'
 
const LibraryCards = dynamic(() => import('@/components/LibraryCards'), {
  ssr: false, loading: () => <Skeleton className="h-[200px] w-[300px]  rounded-xl" />,
})


// fetchFunctions.ts
export const getLibrary = async (userId: string) => {
  const response = await fetch("/api/get-library", {
    method: "POST",
    body: JSON.stringify({ userId: userId }),
  });
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

export default function Page() {
  const { user } = useUser();
  const router = useRouter();

  // const [predictions, setPredictions] = useState([])

  // async function GetLibrary(userId:string) {
  //   const refreshedCompany = await fetch("/api/get-library", {
  //     method: "POST",
  //     body: JSON.stringify({userId: userId}),
  //   }).then((res) =>  res.json());
  //   return refreshedCompany
  // }

  // useEffect(() => {
  //   if(user){
  // const data  = GetLibrary(user?.id).then(
  //   (data)  => setPredictions(data)
  // )

  // console.log(data)
  //   }
  // },[])

  // Use React Query to fetch the data
  const {
    data: predictions,
    error,
    isLoading,
  } = useQuery(["library", user?.id], () => getLibrary(user.id), {
    enabled: !!user?.id, // Only run the query if the user is logged in
  });

  if (isLoading) {
    return <Spinner animation="border" />;
  }

  if (error) {
    return <div>Error loading data</div>;
  }

  
  return (
    <>
      <h1 className="text-xl font-bold m-5">Library</h1>
      <div className="flex border-t pt-10 flex-wrap gap-5">
        {/* {!predictions && <Skeleton className="h-[200px] w-[300px] rounded-xl" /> } */}
        {predictions &&
          predictions.map((item) => (
            <LibraryCards
              key={item.output}
              targetVideo={item.input.target_video}
              swapImage={item.input.swap_image}
              output={item.outputUrl}
            />
          ))}
      </div>
      {/* <div><p>{item.input.target_video}</p><p>{item.input.swap_image}</p><p>{item.outputUrl}</p></div> */}
    </>
  );
}
