'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { useTransition } from 'react'
import { z } from 'zod'

import { updateMapSchema } from '@/lib/db/schema/maps'
import { RouterOutputs } from '@/lib/api'
import { api } from '@/lib/trpc/client'

import { Form, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import { Switch } from '../ui/switch'
import ActionBtns from './action-btns'
import MapStyle from '../map-style'
import { useMapStore } from '@/lib/store'
import { useToastAction } from '@/hooks/use-toast-action'

type data = NonNullable<RouterOutputs["maps"]["getMapDataById"]>

type MapCustomizeTabFormProps = {
    data: data
    styles: string[]
}

function MapCustomizeTabForm({ styles, data }: MapCustomizeTabFormProps) {
    const router = useRouter()
    const { mapData, setMapData } = useMapStore()
    const [_, startTransition] = useTransition()
    const { toast } = useToastAction()

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
                toast('updated', `Map ${data.name} updated`)
                router.refresh()
            } catch (error) {
                console.log(error); // TODO: handle error
                toast('error')
            }
        })
    }

    async function handleDelete() {
        startTransition(async () => {
            try {
                await api.maps.deleteMap.mutate({ id: data.id })
                toast('deleted', `Map ${data.name} deleted`)
                router.push('/dashboard')
            } catch (error) {
                console.log(error); // TODO: handle error
                toast('error')
            }
        })
    }

    function handleStyleClick(style: string) {
        if (!mapData) return
        mapData.style = style
        setMapData(mapData)
        form.setValue('style', style)
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
                    <FormField
                        control={form.control}
                        name="style"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Map Style</FormLabel>
                                <MapStyle styles={styles} onClick={handleStyleClick} defaultValue={field.value ?? ""} />
                                <FormMessage />
                            </FormItem>
                        )}
                    />
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