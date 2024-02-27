"use client"
import { useEffect, useState } from 'react'
import { useOrganization, useUser } from '@clerk/nextjs';

async function TokenRefreshedCompany(userId: string) {
  const refreshedCompany = await fetch("/api/token-refresh", {
    method: "POST",
    body: JSON.stringify({userId: userId}),
  }).then((res) =>  res.json());
  return refreshedCompany
}


export default function Page() {
  const { organization } = useOrganization();
  const { user } = useUser();
  const [iframeUrl, setIframeUrl] = useState<string | null>(null);

  useEffect(() => {
    const fech = async () => {
    if(!user)return
    try{
      const refresh2  = await TokenRefreshedCompany(user?.id)
      console.log("refresh",refresh2)
      // setCompanyInfo(refresh2?.newCompanyInfo)
      return window.location = refresh2?.urlObject?.url
    } catch(err){
      console.log(err)
    }}
    fech()
  })

  return (
    <div>
      {/* <iframe src={iframeUrl? iframeUrl: ""} height="1000" width='900'></iframe> */}
    </div>
  );

}
