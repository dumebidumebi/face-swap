"use client"
import { Button, buttonVariants } from '@/components/ui/button'
import { CreateOrganization, SignUpButton, SignOutButton, SignedIn, SignedOut, RedirectToCreateOrganization } from '@clerk/nextjs'
import Image from 'next/image'
import examplesPic from '@/components/images/examplesPic.png'
import interfacePic from '@/components/images/interfacePic.png'
import Link from 'next/link'
import { Instagram } from 'lucide-react'
import ReactPlayer from 'react-player'
import { Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton'

export default function Home() {
  return (
    <>
      <div className='flex flex-col items-center justify-center mt-10 mb-10'>
      <h1 className='text-center max-w-2xl text-2xl font-bold '>
        <span className='text-blue-600'>create</span>deepfakes.com
      </h1>
      </div>
      <div className='flex flex-col items-center justify-center'>
      <h1 className='text-center max-w-fit sm:max-w-4xl text text-wrap text-4xl font-bold md:text-6xl lg:text-7xl'>
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
        <Link href={"/create/face-swap"}>
          <Button size={"lg"}>Try it out !</Button>
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
        <div className='mx-auto max-w-4xl  lg:px-8'>
          <div className='mt-16 flow-root sm:mt-24'>
            <div className='-m-2 flex flex-col justify-center bg-gray-900//5 p-2  border-t border-b border-gray-900/10 lg:-m-2 lg:p-2'>
              {/* image here */}

    {/* <h1 className='text-xl font-bold mb-5 ml-5 mt-10'>Examples</h1> */}
    <div className='flex flex-col justify-center sm:items-start items-center sm:flex-row max-w-full'>
    <div className='flex flex-col justify-center  sm:items-start items-center  h-full gap-1 min-w-80 sm:border-r'>
     <h1 className='font-semibold text-lg mb-5'>Input</h1>
     
     <Image alt='thumbnails' className='rounded-top-sm ' width={300} height={200} src={"https://upcdn.io/12a1yvy/raw/uploads/2024/05/01/4keRocjt3q-mark.jpg"+"?w=300&h=200&fit=crop&f=webdp"} />
     <h1 className='font-thin mb-10'>Example Source Image</h1>
     <ReactPlayer controls style={{maxWidth:"300px", maxHeight:"200px"}} url={"https://upcdn.io/12a1yvy/raw/uploads/2024/05/01/4keRoh2kGb-heygen-talking-vid.mp4"} />
     <h1 className='font-thin'>Example Target Video </h1>
    </div>
    <div className='flex flex-col sm:items-start items-center  h-full sm:pl-10 sm:ml-0'>
     <h1 className='font-semibold text-lg mt-5 mb-1 ml-0 sm:mt-0'>Output</h1>
     <ReactPlayer controls style={{maxWidth:"300px", maxHeight:"250px", }} url={"https://upcdn.io/12a1yvy/raw/uploads/2024/05/01/4keRnQo86H-file.mp4"} />
    </div>
    </div>
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
        <h2 className='mt-20 font-bold text-4xl text-gray-900 sm:text-5xl'>Our Services</h2>
        {/* <p className='mt-4 text-lg text-gray-600'> We&#39;ll take care of that too ;</p> */}
        </div>
      </div>
      {/* steps */}
      <ol className='my-8 space-y-4 pt-8 md:flex md:space-x-12 md:space-y-0'>
        <li className='md:flex-1 mx-2'>  
          <div className='flex flex-col space-y-2 border-l-4 border-zinc-300 py-2 pl-4 md:border-l-0 md:border-t-2 md:pb-0 md:pl-0 md:pt-4'>
          <span className='text-xl font-semibold'>Face Swap</span>
          <span className='mt-2 text-zinc-700'>Run Deepfake effects on videos. Realistic face replacement effects.</span>
          </div>
        </li>
        <li className='md:flex-1 mx-2'>  
          <div className='flex flex-col space-y-2 border-l-4 border-zinc-300 py-2 pl-4 md:border-l-0 md:border-t-2 md:pb-0 md:pl-0 md:pt-4'>
          <span className='text-xl font-semibold'>Lip Sync</span>
          <span className='mt-2 text-zinc-700'>Make someone say whatever you want! with realistic mouth animations.</span>
          </div>
        </li>
      </ol>
      <div className=' flex flex-col justify-center max-w-full lg:px-8'>
          <div className='mt-16 flow-root sm:mt-24'>
          <h1 className='text-xl font-bold mb-5 ml-5 mt-10'>Examples</h1>
    <div className='flex flex-col m-5 sm:flex-row max-w-full border-t border-b pt-5 pb-5'>
    <div className='flex flex-col h-full gap-2 mb-5 min-w-80 sm:pr-10 sm:border-r'>
     <h1 className='font-semibold text-lg mb-5'>Input</h1>
     <h1 >Example Text</h1>
     <p className='max-w-80 text-wrap italic font-light'>and to be honest, um, im not sure I can be doing this for much longer. um, I mean, its been over 20 years and uh, you know, my body is aging.</p>
    </div>
    <div className='flex flex-col h-full sm:pl-10 sm:ml-0'>
     <h1 className='font-semibold text-lg mb-10 pb-5 mt-5  ml-0 sm:mt-0'>Output</h1>
     <Suspense fallback={<Skeleton className="h-[200px] w-[300px] rounded-xl " />}>
     <ReactPlayer controls style={{maxWidth:"300px", maxHeight: "200px"}} url={"https://upcdn.io/12a1yvy/raw/uploads/2024/05/23/4kbXxmhJ43-file.mp4"} />
     </Suspense>
    </div>
    </div>
          </div>
          <div className='items-center flex pt-20'>
          <Link className='pl-2 flex flex-row' href={"https://www.instagram.com/dume.bi/?hl=en"}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-instagram mr-2"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
            Dumebi</Link></div>
        </div>
   </div>
    </>
  )
}
