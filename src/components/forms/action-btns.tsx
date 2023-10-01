

import { Button, buttonVariants } from '@/components/ui/button'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog'

type FormBtnsProps = {
    onDelete: () => void
    message: string
}

function ActionBtns({ onDelete, message }: FormBtnsProps) {
    return (
        <div className='flex flex-row-reverse gap-2'>
            <Button variant="default" size="sm" type="submit">
                Save
            </Button>
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button
                        variant="destructive" size="sm">
                        Delete
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            {message}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={onDelete} className={buttonVariants({ variant: "destructive" })}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}

export default ActionBtns