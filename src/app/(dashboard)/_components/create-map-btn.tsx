'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'


import { useToastAction } from '@/hooks/use-toast-action'
import { Button } from '@/components/ui/button'
import * as Icon from '@/components/icons'
import { api } from '@/lib/trpc/client'

function CreateMapBtn() {
    const router = useRouter()
    const { toast } = useToastAction()
    const [isPending, startTransition] = useTransition()


    async function handleClick() {
        startTransition(async () => {
            try {
                const mapId = await api.maps.createMap.mutate({
                    name: "New Map",
                })
                router.push(`/onboarding/${mapId}`)
            } catch (error: any) {
                console.log(error);
                toast('error', error.message)
            }
        })
    }

    return (
        <Button onClick={handleClick} disabled={!!isPending}>
            {isPending && <Icon.Loader className="animate-spin mr-2" />}
            Create new map
        </Button>
    )
}

export default CreateMapBtn