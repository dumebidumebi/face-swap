import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import HeaderWeb from "@/components/header";
import HeaderMobile from "@/components/header-mobile";
import Script from "next/script";
import SideNav from "@/components/side-nav";
import MarginWidthWrapper from "@/components/margin-width-wrapper";
import PageWrapper from "@/components/page-wrapper";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return (
    <ClerkProvider>
      {/* <Header/> */}
    <html lang="en">
    <head><Script src="http://localhost:3000"></Script></head>
      <body className={`bg-white ${inter.className}`}>
        <div className="flex">
          {/* <SideNav/> */}
          <main className="flex-1">
            {/* <MarginWidthWrapper> */}
            <HeaderWeb/>
            {/* <HeaderMobile/> */}
            <PageWrapper>
            {children}
            </PageWrapper>
            {/* </MarginWidthWrapper> */}
          </main>
        </div>
      </body>
    </html>
    </ClerkProvider>
  );
}
