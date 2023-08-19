import { SignIn } from "@clerk/nextjs";

export default function Page() {
    return (
        <div className="w-full min-h-screen flex items-center justify-center">
            <div className={'hidden md:block absolute left-0 -bottom-2/3 -z-10 h-full w-full rounded-full opacity-50 blur-[500px] bg-primary'} />
            <SignIn signUpUrl='/sign-up' />
        </div>
    )
}