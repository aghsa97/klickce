'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { useTransition } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { z } from 'zod'

import { updateMapSchema } from '@/server/db/schema/maps'
import { RouterOutputs } from '@/server/api'
import { api } from '@/lib/trpc/client'

import { Form, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import { Switch } from '../ui/switch'
import ActionBtns from './action-btns'
import { cn } from '@/lib/utils'
import { env } from '@/env'
import { Label } from '../ui/label'
import { Button } from '../ui/button'
import { toast } from 'sonner'


const STYLE_TOKEN = env.NEXT_PUBLIC_MAPBOX_API_TOKEN
const USERNAME = env.NEXT_PUBLIC_MAPBOX_USERNAME

type MapCustomizeTabFormProps = {
    data: NonNullable<RouterOutputs["maps"]["getMapDataById"]["map"]>
}

function MapCustomizeTabForm({ data }: MapCustomizeTabFormProps) {
    const router = useRouter()
    const [_, startTransition] = useTransition()

    const form = useForm<z.infer<typeof updateMapSchema>>({
        resolver: zodResolver(updateMapSchema),
        defaultValues: {
            id: data.id,
            name: data.name,
            style: data.style,
            isPublic: data.isPublic,
            isUserCurrentLocationVisible: data.isUserCurrentLocationVisible
        }
    })

    async function handleUpdate(data: z.infer<typeof updateMapSchema>) {
        startTransition(async () => {
            try {
                await api.maps.updateMap.mutate({ ...data })
                toast.success(`Map ${data.name} updated`)
                router.refresh()
            } catch (error) {
                console.log(error); // TODO: handle error
                toast.error('Error updating map')
            }
        })
    }

    async function handleDelete() {
        startTransition(async () => {
            try {
                await api.maps.deleteMap.mutate({ id: data.id })
                toast.success(`Map ${data.name} deleted`)
                router.push('/app')
            } catch (error) {
                console.log(error); // TODO: handle error
                toast.error('Error deleting map')
            }
        })
    }

    return (
        <Form {...form}>
            <form onSubmit={async (e) => { e.preventDefault(), form.handleSubmit(handleUpdate)(e) }} className="w-full space-y-4">
                <div className="grid gap-6 border-b pb-4">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <Input {...field} className="col-span-2" />
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className='flex flex-col gap-2'>
                        <div className='flex items-center justify-between'>
                            <div className='flex flex-col gap-1'>
                                <Label className='text-sm font-semibold'>Map style</Label>
                                <h3 className='text-muted-foreground text-xs'>
                                    You can view all styles here.
                                </h3>
                            </div>
                            <Link href='?styles=true'>
                                <Button variant={'outline'} size="sm">View all styles</Button>
                            </Link>
                        </div>
                        <Image
                            width="0"
                            height="0"
                            sizes="100vw"
                            alt="Map style"
                            className={cn(`w-full h-48 rounded-lg cursor-pointer`,
                                // styleClicked === style ? 'border-4 border-yellow-500' : 'border-none'
                            )}
                            src={`https://api.mapbox.com/styles/v1/${USERNAME}/${data.style}/static/-73.99,40.70,12/500x300?access_token=${STYLE_TOKEN}`}
                        />
                    </div>
                    <FormField
                        control={form.control}
                        name="isPublic"
                        render={({ field }) => (
                            <FormItem className='flex flex-col'>
                                <div className='flex items-center justify-between'>
                                    <FormLabel>
                                        <div className='flex flex-col gap-1.5'>
                                            <h1 className='font-semibold'>{field.value ? 'Public' : 'Private'}</h1>
                                            <h3 className='text-muted-foreground text-xs'>{field.value ? 'Anyone with the link can view the map.' : 'Only you can view the map.'}</h3>
                                        </div>
                                    </FormLabel>
                                    <Switch className='col-span-2' checked={field.value}
                                        onCheckedChange={field.onChange} />
                                </div>

                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="isUserCurrentLocationVisible"
                        render={({ field }) => (
                            <FormItem className='flex flex-col'>
                                <div className='flex items-center justify-between'>
                                    <FormLabel>
                                        <div className='flex flex-col gap-1.5'>
                                            <h1 className='font-semibold'>Track user location</h1>
                                            <h3 className='text-muted-foreground text-xs'>User location will be shown on the map.</h3>
                                        </div>
                                    </FormLabel>
                                    <Switch className='col-span-2' checked={field.value}
                                        onCheckedChange={field.onChange} />
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <ActionBtns onDelete={handleDelete} message="Deleting the map will delete all the data associated with it." />
            </form>
        </Form>
    )
}

export default MapCustomizeTabForm