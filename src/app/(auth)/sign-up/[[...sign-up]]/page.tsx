import { SignUp } from "@clerk/nextjs";

export default function Page() {
    return (
        <div className="w-full flex flex-col items-center justify-center">
            <SignUp signInUrl='/sign-in' afterSignUpUrl={'/app'} />
        </div>
    )
}