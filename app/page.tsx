"use client"
import { Button, buttonVariants } from '@/components/ui/button'
import { CreateOrganization, SignUpButton, SignOutButton, SignedIn, SignedOut, RedirectToCreateOrganization } from '@clerk/nextjs'
import Image from 'next/image'
import payrollPic from '@/components/images/payrollPic.png'
import employeesPic from '@/components/images/employeesPic.png'
import Link from 'next/link'

export default function Home() {
  return (
    <>
      <div className='flex flex-col items-center justify-center mt-10 mb-10'>
      <h1 className='text-center max-w-2xl text-2xl font-bold '>
        <span className='text-blue-600'>create</span>deepfakes.com
      </h1>
      </div>
      <div className='flex flex-col items-center justify-center'>
      <h1 className='text-center max-w-4xl text-5xl font-bold md:text-6xl lg:text-7xl'>
     <span className='text-blue-600'>create AI videos</span> in minutes!
      </h1>
      <p className='text-center mx-5 mt-5 max-w-prose text-zinc-700 sm:text-lg'>
        The easiest way to create AI videos. Try it out!
      </p>
      <div className='flex space-x-12 mt-10'>
      <SignedIn>
        <Link href={"/create/face-swap"}>
          <Button size={"lg"}>Get Started</Button>
        </Link>
      </SignedIn>
      <SignedOut>
        <Link href={"/clerk/sign-up"}>
          <Button size={"lg"}>Sign Up</Button>
        </Link>
      </SignedOut>
      
      </div>
      </div>
  
    {/* value proposition section */}
    
    <div>

      <div className='relative isolate'>
      <div aria-hidden="true" className='pointer-events-none absolute inset-x-0 -top-40 -z-10 transorfm-gpu overflow-hidden blur-3xl sm:-top-80'>
        <div style={{
          clipPath: "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"
        }}className='relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] smw-[72.1875rem]'></div>
      </div>
      <div>
        <div className='mx-auto max-w-4xl px-6 lg:px-8'>
          <div className='mt-16 flow-root sm:mt-24'>
            <div className='-m-2 rounded-xl bg-gray-900//5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-2 lg:rounded-2xl lg:p-2'>
              {/* image here */}
              <Image src={payrollPic} width={900} height={1000} alt='payroll page user interface' />
            </div>
          </div>
        </div>
      </div>
      <div aria-hidden="true" className='pointer-events-none absolute inset-x-0 -top-40 -z-10 transorfm-gpu overflow-hidden blur-3xl sm:-top-80'>
        <div style={{
          clipPath: "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"
        }}className='relative left-[calc(50%-13rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-36rem)] smw-[72.1875rem]'></div>
      </div>
      </div>
    </div>
    {/* feature section */}
   <div className='mx-auto mb-32 mt-32 max-w-5xl sm:mt-56'>
      <div className='mb-12 px-6 lg:px-8'>
        <div className='mx-auto max-w-2xl sm:text-center'>
        <h2 className='mt-20 font-bold text-4xl text-gray-900 sm:text-5xl'>Don&#39;t worry about taxes</h2>
        <p className='mt-4 text-lg text-gray-600'> We&#39;ll take care of that too ;</p>
        </div>
      </div>
      {/* steps */}
      <ol className='my-8 space-y-4 pt-8 md:flex md:space-x-12 md:space-y-0'>
        <li className='md:flex-1 mx-2'>  
          <div className='flex flex-col space-y-2 border-l-4 border-zinc-300 py-2 pl-4 md:border-l-0 md:border-t-2 md:pb-0 md:pl-0 md:pt-4'>
          <span className='text-sm font-medium text-blue-600'>Step 1</span>
          <span className='text-xl font-semibold'>Streamlined Document Management</span>
          <span className='mt-2 text-zinc-700'>All essential forms, including I-9s, W-2s, and 1099s, are securely stored and easily accessible online. </span>
          </div>
        </li>
        <li className='md:flex-1 mx-2'>  
          <div className='flex flex-col space-y-2 border-l-4 border-zinc-300 py-2 pl-4 md:border-l-0 md:border-t-2 md:pb-0 md:pl-0 md:pt-4'>
          <span className='text-sm font-medium text-blue-600'>Step 2</span>
          <span className='text-xl font-semibold'>Nationwide State Tax Registration</span>
          <span className='mt-2 text-zinc-700'>Get the tools you need to register for state taxes in every state, tailored to where your team resides and operates.</span>
          </div>
        </li>
        <li className='md:flex-1 mx-2'>  
          <div className='flex flex-col space-y-2 border-l-4 border-zinc-300 py-2 pl-4 md:border-l-0 md:border-t-2 md:pb-0 md:pl-0 md:pt-4'>
          <span className='text-sm font-medium text-blue-600'>Step 3</span>
          <span className='text-xl font-semibold'>Automated Tax Calculations</span>
          <span className='mt-2 text-zinc-700'>Stay compliant with ever-changing tax laws through our automatic calculation system, reducing errors.</span>
          </div>
        </li>
      </ol>
      <div className='mx-auto max-w-4xl px-6 lg:px-8'>
          <div className='mt-16 flow-root sm:mt-24'>
            <div className='-m-2 rounded-xl bg-gray-900//5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-2 lg:rounded-2xl lg:p-2'>
            {/* image here */}
            <Image src={employeesPic} width={900} height={1000} alt='employees page user interface' />
            </div>
          </div>
        </div>
   </div>
    </>
  )
}
