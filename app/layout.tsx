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

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Deepfakes",
  description: "generate AI videos",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return (
    <ClerkProvider publishableKey={`${process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}`}>
    <html lang="en">
    <head></head>
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
