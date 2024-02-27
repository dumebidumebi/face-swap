import { error } from "console";
import CompanyOnboarding from "./CompanyOnboarding";
import { CompanyInfo } from "@/types";

// This function is responsible for refreshing the access token using the provided refresh token.
// It takes the refresh token as a parameter and returns the refreshed token data.
export interface TokenRefreshedCompany {
  access_token: string,
  token_type: string,
  expires_in: number,
  refresh_token: string,
  scope: string,
  created_at: number
  }

export default async function TokenRefresh(companyInfo: CompanyInfo ): Promise<TokenRefreshedCompany | null>{
  // Log that token refresh process has started
  console.log('Starting token refresh...');

  // Construct the URL for the Gusto API endpoint to refresh the token
  const url = 'https://api.gusto-demo.com/oauth/token';

  // Configure options for the fetch request
  const options = {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      'Authorization': `Token ${process.env.GUSTO_API_TOKEN}`,
      'X-Gusto-API-Version': '2023-12-01',
    },
    body: JSON.stringify({
      'client_id': `${process.env.GUSTO_CLIENT_ID}`,
      'client_secret': `${process.env.GUSTO_SECRET}`,
      'redirect_uri': 'https://localhost:3000',
      'refresh_token': `${companyInfo?.refresh_token}`,
      'grant_type': 'refresh_token'
    })
  };

  // Log that token data is being fetched
  console.log('Fetching token data...', options);

  // Send the request to fetch token data
  const data = await fetch(url, options)
    .then(res => {
      if(res.ok){return res.json()}
    }) // Parse the JSON response
    .catch(err => {
      // Log and throw an error if fetching token data fails
      console.error('Error refreshing token data:', err);
      throw err; // Rethrow the error to be caught by the caller
    });

  // Log that token data is being stored in localStorage
 

  // implement context or universal state management

  // Extract the access token from the token data

  // const { access_token } =  data
  

  // Check if access token is obtained
  if (data) {
    console.log("refreshed company", data);
    return data
  }else return null
}
