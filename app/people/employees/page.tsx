"use client"
import { useUser } from '@clerk/nextjs';
import React, { useEffect, useState } from 'react'

async function getEmployeePage(userId: string) {
  const refreshedCompany = await fetch("/api/add-employee", {
    method: "POST",
    body: JSON.stringify({userId: userId}),
  }).then((res) =>  res.json());
  return refreshedCompany
}

function EmployeesPage() {
  const { user } = useUser();

  useEffect(() => {
    const fech = async () => {
    if(!user)return
    try{
      const refresh2  = await getEmployeePage(user?.id)
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

export default EmployeesPage