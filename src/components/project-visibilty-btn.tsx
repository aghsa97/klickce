'use client'

import { useRouter } from 'next/navigation'
import { useTransition } from 'react'

import { useToastAction } from '@/hooks/use-toast-action'
import { api } from '@/lib/trpc/client'
import { Button } from './ui/button'

function ProjectVisibiltyBtn({ data, eyeIcon }: { data: { id: string, isVisible: boolean }, eyeIcon: React.ReactNode }) {
    const router = useRouter()
    const [_, startTransition] = useTransition()
    const { toast } = useToastAction()

    async function updateVisibilty() {
        startTransition(async () => {
            try {
                await api.projects.updateProject.mutate({
                    id: data.id,
                    isVisible: !data.isVisible
                })
                toast('updated', data.isVisible ? 'Project now is hidden' : 'Project now is visible')
                router.refresh()
            } catch (error) {
                console.log(error);
                toast('error')
            }
        })
    }

    return (
        <div className='flex items-center justify-center gap-2'>
            <Button variant="ghost" size="sm" onClick={updateVisibilty}>
                {eyeIcon}
                <span className="sr-only">Toggle</span>
            </Button>
        </div>
    )
}

export default ProjectVisibiltyBtn