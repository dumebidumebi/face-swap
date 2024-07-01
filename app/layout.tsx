import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider, RedirectToCreateOrganization, SignedIn } from "@clerk/nextjs";
import HeaderWeb from "@/components/Header";
import HeaderMobile from "@/components/header-mobile";
import Script from "next/script";
import SideNav from "@/components/side-nav";
import MarginWidthWrapper from "@/components/margin-width-wrapper";
import PageWrapper from "@/components/page-wrapper";
import { Analytics } from "@vercel/analytics/react"
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Deepfakes",
  description: "Create AI deepfakes and lip sync videos easily with CreateDeepFakes. Generate realistic videos with our powerful AI technology.",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return (
    <ClerkProvider publishableKey={`${process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}`}>
       <Analytics/>
    <html lang="en">
    <head>
    <script async src="https://cdn.tolt.io/tolt.js" data-tolt="47e79a35-f79e-4f86-a0d4-4599117dfd75"></script>
    </head>
      <body className={`bg-white ${inter.className}`}>
        <div className="flex">
          <main className="flex-1">
            <HeaderWeb/>
            <SideNav/>
            <MarginWidthWrapper>
            <PageWrapper>
           
            {children}
           
            </PageWrapper>
            </MarginWidthWrapper>
          </main>
        </div>
      </body>
    </html>
    </ClerkProvider>
  );
}
