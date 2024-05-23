'use client'
import Link from "next/link";
import {
  OrganizationSwitcher,
  SignedIn,
  SignedOut,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import useScroll from "@/hooks/use-scroll";
import { useSelectedLayoutSegment } from "next/navigation";
import { cn } from "@/lib/utils";
import HeaderMobile from "./header-mobile";
import PricingPage from "../app/pricing-page/page";
import { Button } from "./ui/button";

function HeaderWeb() {
  const { user } = useUser();
  const scrolled = useScroll(5);
  const selectedLayout = useSelectedLayoutSegment();

  return (
    <div
    className={cn(
      `sticky inset-x-0 top-0 z-30 max-w-full transition-all border-b border-gray-200 `,
      {
        'border-b border-gray-200 bg-white ': scrolled,
        'border-b border-gray-200 bg-white': selectedLayout,
      },
    )}
    >
      <div className="flex h-[47px] items-center  px-4">
        <div className="">
          <Link
            href="/"
            className="flex flex-row space-x-0 items-center justify-center  position-fixed top-0 left-40 z-50 "
          >
            <p className="font-bold text-l text-blue-600 flex">create</p><span className="font-bold text-l flex">deepfakes</span>
          </Link>       
        </div>
        {/* <div className="mx-40"></div> */}
        <div>
        <div className=" flex items-center space-x-5 fixed right-10 mx-5 top-[8px] z-30">
        <SignedIn>
        <Link href={"/pricing-page"}>{`Credits: ${user?.publicMetadata?.credits ? user?.publicMetadata?.credits: ''}` }</Link>
        <UserButton />
        </SignedIn>
        <SignedOut>
        <Link href={"/clerk/sign-up"}>
          <Button className="rounded-sm" size={"sm"}>Sign Up</Button>
        </Link>
      </SignedOut>
        </div>
        <HeaderMobile/>
        </div>
      </div>
    </div>
  );
}

export default HeaderWeb;
