import React from 'react';
import Logo from '../ui/logo';

function AppFooter() {
    return (
        <footer className='flex justify-start items-center w-full border rounded-lg mb-10'>
            <div className="container mx-auto p-4">
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
