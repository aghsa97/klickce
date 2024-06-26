'use client'

import { z } from 'zod'
import { toast } from 'sonner'
import { useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { TRPCClientError } from '@trpc/client'
import { zodResolver } from '@hookform/resolvers/zod'


import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { insertMapSchema } from '@/lib/db/schema/maps'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import * as Icon from '@/components/icons'
import { api } from '@/lib/trpc/client'

function CreateMapBtn() {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()

    const form = useForm<z.infer<typeof insertMapSchema>>({
        resolver: zodResolver(insertMapSchema),
        defaultValues: {
            name: '',
        }
    })

    function handleClick(data: z.infer<typeof insertMapSchema>) {
        startTransition(async () => {
            try {
                const mapId = await api.maps.createMap.mutate({
                    name: data.name,
                })
                router.push(`/app/map/${mapId}`)
            } catch (error) {
                if (error instanceof TRPCClientError) {
                    toast.error(error.message)
                    return
                } else {
                    toast.error('An unknown error occurred, please try again later.')
                }
            }
        })
    }

    return (
        <Form {...form}>
            <form>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button>Create New Map</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create Your New Map</DialogTitle>
                            <DialogDescription>
                                Name your map here, You can change this later.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid grid-cols-4 items-center gap-2 py-4">
                            <Label htmlFor="name" className="text-left">
                                Name
                            </Label>
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem className='col-span-3'>
                                        <Input
                                            className="col-span-3"
                                            placeholder="ex. My Travel Plan"
                                            {...field}
                                        />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <DialogFooter>
                            <Button onClick={form.handleSubmit(handleClick)} disabled={isPending}>
                                {isPending && <Icon.Loader className="animate-spin mr-2" />}
                                Create
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </form>
        </Form>
    )
}

export default CreateMapBtn