"use client"

import { Button } from "@/components/ui/button";
// Form to create a new organization. The current user
// will be given the Creator role.
import { currentUser, useOrganizationList, useUser } from "@clerk/nextjs";
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
  const {  user } = useUser()
  const router = useRouter()

 
  const handleSubmit: MouseEventHandler = async (e) => {
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
  
  return (
    // IF ORGANIZATION HAS BEEN MADE PREVENT FORM FROM BEING SUBMITTED
   <>
   <Card className="w-70">
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

   
      </>
  );
}


// function CreateOrg() {
  
//   return (
//     <CreateOrganization routing="path" path="/clerk/create-org" afterCreateOrganizationUrl={"/onboarding"} />
//   )
// }