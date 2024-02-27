"use client"
import { useUser } from '@clerk/nextjs';
import React, { useEffect } from 'react'

async function getPayContractorsPage(userId: string) {
  const refreshedCompany = await fetch("/api/pay-contractors", {
    method: "POST",
    body: JSON.stringify({userId: userId}),
  }).then((res) =>  res.json());
  return refreshedCompany
}

function PayContractors() {
  const { user } = useUser();

  useEffect(() => {
    const fech = async () => {
    if(!user)return
    try{
      const refresh2  = await getPayContractorsPage(user?.id)
      console.log("refresh",refresh2)
      // setCompanyInfo(refresh2?.newCompanyInfo)
      return window.location = refresh2?.urlObject?.url
    } catch(err){
      console.log(err)
    }}
    fech()
  },[])

  return (
    <div>
      {/* <iframe src={iframeUrl? iframeUrl: ""} height="1000" width='900'></iframe> */}
    </div>
  );

}

export default PayContractors