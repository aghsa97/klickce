'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import React, { useEffect } from 'react'
import { z } from 'zod'

import { updateSpotSchema } from '@/server/db/schema/spots'
import { Form, FormControl, FormField, FormItem } from '../ui/form'
import { Input } from '../ui/input'
import { api } from '@/lib/trpc/client'
import { useRouter } from 'next/navigation'

function SpotNameForm({ spot }: { spot: { id: string, name: string } }) {
    const router = useRouter()
    const form = useForm<z.infer<typeof updateSpotSchema>>({
        resolver: zodResolver(updateSpotSchema),
        defaultValues: {
            id: spot.id,
            name: spot.name,
        }
    })

    const handleUpdate = async (data: z.infer<typeof updateSpotSchema>) => {
        if (data.name === spot.name || !data.name) return;
        if (data.name?.length > 30) {
            toast.error('Spot name must be less than 30 characters ' + data.name.length);
            return;
        }
        try {
            await api.spots.updateSpot.mutate({ id: data.id, name: data.name })
            toast.success(`Spot ${data.name} updated`)
            router.refresh()
        } catch (error: any) {
            console.log(error); // TODO: handle error
            toast.error(error.message)
        }
        return;
    };

    useEffect(() => {
        form.reset({
            id: spot.id,
            name: spot.name,
        })
    }, [spot, form])

    return (
        <Form {...form}>
            <form className="w-full">
                <FormField
                    control={form.control}
                    name={'name'}
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input className="flex flex-grow h-full w-full rounded-none border-0 p-0 bg-transparent text-xl cursor-text ring-offset-0 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 overflow-hidden overscroll-x-none"
                                    {...field}
                                    onBlur={async (e) => { form.handleSubmit(handleUpdate)(e) }}
                                    onKeyDown={async (e) => { if (e.key === 'Enter') form.handleSubmit(handleUpdate)(e) }}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
            </form>
        </Form>
    )
}

export default SpotNameForm