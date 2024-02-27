
import CompanyOnboarding from "@/lib/CompanyOnboarding"
import TokenRefresh, { TokenRefreshedCompany } from "@/lib/TokenRefresh";
import { NextRequest } from "next/server"




export async function POST(req: NextRequest) {
  const body = await req.json()
  console.log('body from companyonboarding:', body);

  const data = await CompanyOnboarding(body.companyInfo)
  if(data?.status == 401){
    // const refresh = TokenRefreshedCompany(body.companyInfo)
    const refresh = await TokenRefresh(body.companyInfo)
    if (refresh) {
      const {access_token, refresh_token} = refresh
      const newCompanyInfo = {...body.companyInfo, access_token:access_token, refresh_token:refresh_token}
      console.log('newCompanyInfo:', newCompanyInfo)
      // const url = CompanyOnboarding(newCompanyInfo)
      // if(url){
      // return new Response(JSON.stringify(url))
      // }
      return new Response(JSON.stringify(newCompanyInfo))
    } else {
      return new Response(JSON.stringify(refresh))
    }

  }
  else if(data?.status === 200){
    return new Response(JSON.stringify(data))
  }
  else  return new Response(JSON.stringify(data))
 
}