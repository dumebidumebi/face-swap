"use client"
import { useEffect, useState } from 'react'
import { useOrganization, useUser } from '@clerk/nextjs';
import Spinner from 'react-bootstrap/Spinner';

async function GetLibrary(userId: string) {
  const refreshedCompany = await fetch("/api/get-library", {
    method: "POST",
    body: JSON.stringify({userId: userId}),
  }).then((res) =>  res.json());
  return refreshedCompany
}


export default function Page() {;
  
  const { user } = useUser();

  useEffect(() => {
    
    const fech = async () => {
    if(!user)return
    try{ const library  = await GetLibrary(user?.id)
      return library
    } catch(err){
      console.log(err)
    }}
  
  })

  return (
   <>
   </>
  );

}
