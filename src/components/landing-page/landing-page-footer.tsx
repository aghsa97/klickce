import React from 'react';
import Logo from '../ui/logo';

function LandingPageFooter() {
    return (
        <footer className='w-full lg:mb-6 px-6 py-3 lg:px-12 lg:py-6 lg:rounded-2xl backdrop-blur-[1pxs] border rounded-2xl bg-gradient-to-br from-zinc-200/50 from-0% to-50%'>
            <div className="flex flex-col justify-center items-start">
                <Logo />
                <p className="text-sm text-muted-foreground">
                    &copy; {new Date().getFullYear()} All rights reserved.
                </p>
            </div>
            {/* <div className='flex flex-col lg:flex-row gap-12 w-full justify-between mt-12 text-foreground text-sm lg:text-base 2xl:text-lg'>
                <div className='space-y-3'>
                    <h1 className='uppercase font-semibold'>Solutions</h1>
                    <ul className='space-y-3'>
                        <li>Platform</li>
                        <li>Docs</li>
                    </ul>
                </div>
                <div className='space-y-3'>
                    <h1 className='uppercase font-semibold'>Use cases</h1>
                    <ul className='space-y-3'>
                        <li>Business</li>
                        <li>Travel</li>
                        <li>Real Estate</li>
                    </ul>
                </div>
                <div className='space-y-3'>
                    <h1 className='uppercase font-semibold'>Resources</h1>
                    <ul className='space-y-3'>
                        <li>Changelog</li>
                        <li>Blog</li>
                    </ul>
                </div>
                <div className='space-y-3'>
                    <h1 className='uppercase font-semibold'>Company</h1>
                    <ul className='space-y-3'>
                        <li>About</li>
                        <li>Contact</li>
                    </ul>
                </div>
            </div> */}
        </footer>
    );
}

export default LandingPageFooter;
