async function SettingsLayout(props: { children: React.ReactNode, params: { customerId: string } }) {
    return (
        <div className="min-h-screen overflow-hidden rounded-[0.5rem] w-full max-w-screen-md mx-auto"
        >
            <div className='mb-4 flex items-center justify-between'>
                <div>
                    <h1 className='text-2xl font-semibold text-foreground'>
                        Settings
                    </h1>
                    <h2 className='text-muted-foreground'>
                        Your account settings
                    </h2>
                </div>
            </div>
            <main className="w-full flex">
                {props.children}
            </main>
        </div>
    );
}

export default SettingsLayout;