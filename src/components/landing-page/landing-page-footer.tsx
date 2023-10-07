import React from 'react';
import Logo from '../ui/logo';

function AppFooter() {
    return (
        <footer className='flex justify-start items-center w-full mb-10 px-4 md:px-0'>
            <div className="container mx-auto p-4 w-full border rounded-lg">
                <div className="flex justify-between items-center gap-2">
                    <p className="text-sm text-muted-foreground">
                        &copy; {new Date().getFullYear()} All rights reserved.
                    </p>
                    <Logo size="sm" />
                </div>
            </div>
        </footer>
    );
}

export default AppFooter;
