"use client"
import { useUser } from '@clerk/nextjs';
import React, { useEffect } from 'react'

async function runPayrollPage(userId: string) {
  const refreshedCompany = await fetch("/api/run-payroll", {
    method: "POST",
    body: JSON.stringify({userId: userId}),
  }).then((res) =>  res.json());
  return refreshedCompany
}

function RunPayroll() {
  const { user } = useUser();



  return (
    <div>
      {/* <iframe src={iframeUrl? iframeUrl: ""} height="1000" width='900'></iframe> */}
    </div>
  );
}

export default RunPayroll