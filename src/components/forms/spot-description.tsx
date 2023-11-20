'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import React, { useEffect, useRef } from 'react'
import { toast } from 'sonner'
import { z } from 'zod'

import { updateSpotSchema } from '@/server/db/schema/spots'
import { api } from '@/lib/trpc/client'

import { Form, FormControl, FormField, FormItem } from '../ui/form'
import { Textarea } from '../ui/textarea'

function SpotDescriptionForm({ spot }: { spot: { id: string, description: string } }) {
    const router = useRouter()
    const form = useForm<z.infer<typeof updateSpotSchema>>({
        resolver: zodResolver(updateSpotSchema),
        defaultValues: {
            id: spot.id,
            description: spot.description,
        }
    })

    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const adjustHeight = () => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = `${textarea.scrollHeight}px`;
        }
    };

    const description = form.watch("description");

    useEffect(() => {
        adjustHeight(); // Adjust height on initial render
    }, [description]);


    const handleUpdate = async (data: z.infer<typeof updateSpotSchema>) => {
        if (data.description === spot.description) return;
        try {
            await api.spots.updateSpot.mutate({ id: data.id, description: data.description })
            toast.success(`Spot updated`)
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
            description: spot.description,
        })
    }, [spot, form])

    return (
        <Form {...form}>
            <form className="w-full h-full">
                <FormField
                    control={form.control}
                    name={'description'}
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Textarea
                                    {...field}
                                    ref={textareaRef}
                                    onInput={adjustHeight}
                                    onBlur={async (e) => { form.handleSubmit(handleUpdate)(e) }}
                                    className='resize-none overflow-visible flex flex-grow h-full w-full rounded-none border-0 p-0 bg-transparent text-base cursor-text ring-offset-0 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0'
                                    placeholder='Write your text here, Leaving it blank will remove the description section from the spot.'
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
            </form>
        </Form>
    )
}

export default SpotDescriptionForm