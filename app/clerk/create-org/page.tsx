"use client"
import { CompanyInfo } from "@/app/onboarding/page";
import { Button } from "@/components/ui/button";
// Form to create a new organization. The current user
// will be given the Creator role.
import { currentUser, useOrganizationList, useUser } from "@clerk/nextjs";
import { FormEventHandler, MouseEventHandler, useState } from "react";
 
export default function CreateOrganization() {
  const { createOrganization } = useOrganizationList();
  const [organizationName, setOrganizationName] = useState<string>("");
  const {  user } = useUser()

 
  const handleSubmit: MouseEventHandler = async (e) => {
    e.preventDefault();
    
    if(organizationName == "") return alert("Please enter a name for the organization")

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
        const temp: CompanyInfo = res.json();
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
    fetchData();
  }
  
  return (
    // IF ORGANIZATION HAS BEEN MADE PREVENT FORM FROM BEING SUBMITTED
   <>
      <input
        type="text"
        name="organizationName"
        value={organizationName}
        onChange={(e) => setOrganizationName(e.currentTarget.value)}
        
      />
      <Button onClick={(e)=>handleSubmit(e)}>Create organization</Button>
      </>
  );
}


// function CreateOrg() {
  
//   return (
//     <CreateOrganization routing="path" path="/clerk/create-org" afterCreateOrganizationUrl={"/onboarding"} />
//   )
// }