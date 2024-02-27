import TokenRefresh from "@/lib/TokenRefresh"
import { NextRequest } from "next/server"
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/firebase";
import AddEmployee from "@/lib/AddEmployee";


export async function POST(req: NextRequest) {
  const body = await req.json()
    const userId = body.userId
    console.log('body from token-refresh:', body);
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef); 
    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      const {companies} = docSnap.data()
      // SWITCH OUT COMPANIES HERE
      const companyInfo = companies[0].gustoData
 


    const data = await TokenRefresh(companyInfo)
    
    if (data) {
      const {access_token, refresh_token} = data
      const newCompanyInfo = {...companyInfo, access_token:access_token, refresh_token:refresh_token}
      const response = {newCompanyInfo: newCompanyInfo}
      await setDoc(docRef, {companies: [{gustoData: newCompanyInfo}]}, {merge: true});
      const url = await AddEmployee(newCompanyInfo)
      if(url){
      console.log('url:', url)
      const finalResponse = {...response, urlObject: url}
      return new Response(JSON.stringify(finalResponse))
      }else return new Response(JSON.stringify(url))
    }

  } else {
    // docSnap.data() will be undefined in this case
    console.log("No such document!");
  }
    // return new Response(JSON.stringify(data))
}

// response = {newCompanyInfo: newCompanyInfo, urlObject: url}