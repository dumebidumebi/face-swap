"use client"
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { SignUp, useOrganizationList, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { MouseEventHandler, useState } from "react";
 
export default function SignUpPage() {
 
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
   <div className="flex justify-center">
    <SignUp afterSignUpUrl="/clerk/create-org" afterSignInUrl="/clerk/create-org"></SignUp>
    </div>
      </>
  );

}