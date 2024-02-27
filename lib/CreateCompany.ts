
import { CompanyInfo, UserInfo } from "@/types";
import { currentUser } from "@clerk/nextjs";

export async function ApproveDemoCompany(company_uuid:string) {
  const url = `https://api.gusto-demo.com/v1/companies/${company_uuid}/approve`;

  const options = {
    method: 'PUT',
    headers: {
      accept: 'application/json', 
      'content-type': 'application/json',
      authorization: `Bearer ${process.env.GUSTO_API_TOKEN}`,
      'X-Gusto-API-Version': '2023-12-01'
    }
  }

// make call to gusto
  const data = await fetch(url, options)
    .then(res => res.json())
    .catch(err => console.error('Error from company approval:', err));

return data
}


export default async function CreateCompany( userInfo: UserInfo ): Promise<CompanyInfo> {
  // get the users info and their ogranization info (for name of company)
// 
  console.log('userInfo:', userInfo);
  // const user = await currentUser();
  const user = userInfo?.user
  const organization = userInfo?.organization
  
  const url = 'https://api.gusto-demo.com/v1/partner_managed_companies';

  console.log("Organization:", organization);
  console.log("User:", user);


  const options = {
    method: 'POST',
    headers: {
      accept: 'application/json', 
      'content-type': 'application/json',
      authorization: `Token ${process.env.GUSTO_API_TOKEN}`,
      'X-Gusto-API-Version': '2023-12-01'
    },
    body: JSON.stringify({
      user: {
        first_name: `${user?.firstName}`,
        last_name: `${user?.lastName}`,
        email: `${user?.emailAddresses[0].emailAddress}`
      },
      company: {
        name: `${organization?.name}`,
        ein: null
      }                   
    })
  }

  console.log("Options:", options);

// make call to gusto
  const data = await fetch(url, options)
    .then(res => { return res.json()})
    .catch(err => console.error('Error from company creation:', err));

  console.log("Company creation data:", data);
  // demo companies need to be approved
  return data;
};
