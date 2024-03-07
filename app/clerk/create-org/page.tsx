"use client"

import { Button } from "@/components/ui/button";
// Form to create a new organization. The current user
// will be given the Creator role.
import { OrganizationSwitcher, currentUser, useOrganizationList, useUser } from "@clerk/nextjs";
import { FormEventHandler, MouseEventHandler, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { CompanyInfo } from "@/types";
import { redirect, useRouter } from "next/navigation";

 
export default function CreateOrganization() {
  const { createOrganization } = useOrganizationList();
  const [organizationName, setOrganizationName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const {  user } = useUser()
  const router = useRouter()

 
  const handleSubmit: MouseEventHandler = async (e) => {
    setLoading(true);
    e.preventDefault();
    
    if(organizationName == "") return alert("Please enter a name for the organization")
    if(!organizationName) return alert("Please enter a name for the organization")
    if(!createOrganization) return alert("no createOrganization function found")

    const org = await createOrganization({ name: organizationName });
    setOrganizationName("");
    // make call to create organization

    const fetchData = async () => {
      
      const createdCompanyInfo = await fetch("/api/create-company", {
        method: "POST",
        body: JSON.stringify({user:user, organization:org,}),
      }).then((res) => {
        console.log("res",res)
        if(res.status === 200){
        const temp: any = res.json();
        return temp;
        }
        else{
          return null;
          // handle error with company creation
        }
      });
      console.log("Created company info:", createdCompanyInfo);
      return createdCompanyInfo;
};
    const foo = await fetchData();
    router.push("/onboarding");
  }
  
  if(loading) return (
    <div className='mb-40 flex flex-center justify-center'>
    <div role="status">
     <svg aria-hidden="true" className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
       <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
       <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
     </svg>
   </div>
   <h1 className='ml-5'>
   Loading...
   </h1>
     {/* <iframe src={iframeUrl? iframeUrl: ""} height="1000" width='900'></iframe> */}
   </div>
  )
  return (
    // IF ORGANIZATION HAS BEEN MADE PREVENT FORM FROM BEING SUBMITTED
    
   <>
   <div className="flex justify-center">
   <Card className="max-w-50" style={{ minWidth: "400px" , overflow: "hidden"}}>
  <CardHeader>
    <CardTitle>Create Organization</CardTitle>
    <CardDescription>Type in your company name</CardDescription>
  </CardHeader>
  <CardContent>
  <input
        type="text"
        name="organizationName"
        className="w-full p-2 border border-gray-300 rounded-md"
        value={organizationName}
        onChange={(e) => setOrganizationName(e.currentTarget.value)}
        
      />
      
  </CardContent>
  <CardFooter>
  <Button onClick={(e)=>handleSubmit(e)}>Create organization</Button>
  </CardFooter>
</Card>
</div>

      </>
  );
}


// function CreateOrg() {
  
//   return (
//     <CreateOrganization routing="path" path="/clerk/create-org" afterCreateOrganizationUrl={"/onboarding"} />
//   )
// }