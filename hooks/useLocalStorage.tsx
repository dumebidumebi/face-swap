// import { UserInfo } from "@/app/onboarding/page";
// import { useOrganization, useUser } from "@clerk/nextjs";
// import { User } from "@clerk/nextjs/server";
// import { useEffect, useState } from "react"
// import { create } from 'zustand'

// export function useLocalStorage<T>(key: string, initialValue: T | (() => T)) {

 
//   // check in loacalstorage for companyInfo and userInfo
//   // assign initial values from forms and hooks
//   const { organization } = useOrganization();
//   const { user } = useUser();
//   // set in state



// }


// import { useEffect, useState } from "react"

// export function useLocalStorage<T>(key: string, initialValue: T | (() => T)) {
//   const [value, setValue] = useState<T>(() => {
//     const jsonValue = localStorage.getItem(key)
//     if (jsonValue != null) return JSON.parse(jsonValue)

//     if (typeof initialValue === "function") {
//       return (initialValue as () => T)()
//     } else {
//       return initialValue
//     }
//   })

//   useEffect(() => {
//     localStorage.setItem(key, JSON.stringify(value))
//   }, [key, value])

//   return [value, setValue] as [typeof value, typeof setValue]
// }