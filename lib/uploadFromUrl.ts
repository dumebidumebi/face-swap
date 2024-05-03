export async function uploadFromUrl(params) {  
  
  const baseUrl  = "https://api.bytescale.com";
  const path     = `/v2/accounts/${params.accountId}/uploads/url`;
  const entries  = obj => Object.entries(obj).filter(([,val]) => (val ?? null) !== null);
 
  const response = await fetch(`${baseUrl}${path}`, {
    method: "POST",
    body: JSON.stringify(params.requestBody),
    headers: Object.fromEntries(entries({
      "Authorization": `Bearer ${params?.apiKey}`,
      "Content-Type": "application/json",
    }))
  });

  const result = await response.json();
  if (Math.floor(response.status / 100) !== 2)
    throw new Error(`Bytescale API Error: ${JSON.stringify(result)}`);
  return result;
}
