
function EmptyState() {
    // TODO: Add a button to add a project, Consider a redesign?
    return (
        <div className='h-full flex flex-col items-center justify-center'>
            <h1 className='text-2xl font-semibold text-center'>Welcome to your map!</h1>
            <p className='text-muted-foreground text-center'>
                Search for an address or click on add project to get started.
            </p>
        </div>
    )
}

export default EmptyState