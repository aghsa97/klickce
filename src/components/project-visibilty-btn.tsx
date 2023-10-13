'use client'

import { useRouter } from 'next/navigation'
import { useTransition } from 'react'

import { useToastAction } from '@/hooks/use-toast-action'
import { api } from '@/lib/trpc/client'
import { Button } from './ui/button'
import * as Icon from './icons'

function ProjectVisibiltyBtn({ data }: { data: { id: string, isVisible: boolean } }) {
    const router = useRouter()
    const [_, startTransition] = useTransition()
    const { toast } = useToastAction()
    const eyeIcon = data.isVisible ? <Icon.Eye className='w-5 h-5 hidden group-hover:block' /> : <Icon.EyeOff className='w-5 h-5' />


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