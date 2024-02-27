import { SignedIn, RedirectToOrganizationProfile, SignIn } from "@clerk/nextjs";

function SignInPage() {
  return (
    <>
    <SignIn redirectUrl={"/clerk/create-org"} />
    </>
  );
}

export default SignInPage;