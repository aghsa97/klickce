'use client'

import { useForm, UseFormReturn } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useMemo, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { z } from 'zod'

import { updateSpotSchema } from '@/server/db/schema/spots'
import { api, RouterOutputs } from '@/lib/trpc/client'

import { Select, SelectContent, SelectItem, SelectSeparator, SelectTrigger, SelectValue } from '../ui/select'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import ColorPicker from '../color-picker'
import { Textarea } from '../ui/textarea'
import ImageSection from './img-section'
import ActionBtns from './action-btns'
import { Input } from '../ui/input'


type SpotPopoverProps = {
    spot: NonNullable<RouterOutputs["spots"]["getSpotById"]>
    projects: RouterOutputs["projects"]["getProjectsByMapId"]
}

function SpotForm({ spot, projects }: SpotPopoverProps) {
    const router = useRouter()
    const [_, startTransition] = useTransition()
    const project = useMemo(() => projects?.find(project => project.id === spot.projectId), [projects, spot.projectId])

    const form = useForm<z.infer<typeof updateSpotSchema>>({
        resolver: zodResolver(updateSpotSchema),
        defaultValues: {
            id: spot.id,
            name: spot.name,
            color: spot.color,
            projectId: spot.projectId,
            description: spot.description,
        }
    })

    // update form values when data changes
    useEffect(() => {
        form.reset({
            id: spot.id,
            name: spot.name,
            color: spot.color,
            projectId: spot.projectId,
            description: spot.description,
        })
    }, [spot, form])


    async function handleUpdate(data: z.infer<typeof updateSpotSchema>) {
        startTransition(async () => {
            try {
                await api.spots.updateSpot.mutate({ ...data })
                toast.success(`Spot ${data.name} updated`)
                router.refresh()
            } catch (error: any) {
                console.log(error); // TODO: handle error
                toast.error(error.message)
            }
        })
    }

    async function handleDelete() {
        startTransition(async () => {
            try {
                await api.spots.deleteSpot.mutate({ id: spot.id })
                toast.success(`Spot ${spot.name} deleted`)
                router.refresh()
            } catch (error: any) {
                console.log(error); // TODO: handle error
                toast.error(error.message)
            }
        })
    }

    return (
        <Form {...form}>
            <form onSubmit={async (e) => { e.preventDefault(), form.handleSubmit(handleUpdate)(e) }}>
                <div className="grid gap-4">
                    <div className='flex flex-col gap-1.5'>
                        <h4 className="font-medium leading-none">{spot.name}</h4>
                        <p className="text-sm text-muted-foreground">{spot.address}</p>
                    </div>
                    <div className="grid border-b pb-6">
                        <SpotInputField name="name" form={form} />
                        {!spot.projectId && <SpotInputField name="color" form={form} />}
                        <FormField
                            control={form.control}
                            name="projectId"
                            render={({ field }) => (
                                <FormItem className="grid grid-cols-3 items-center">
                                    <FormLabel>Project</FormLabel>
                                    <SpotSelectProject key={field.value} onValueChange={field.onChange} defaultValue={field.value} projects={projects} projectName={project?.name} />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem className="flex flex-col gap-1.5">
                                <FormLabel>{field.name}</FormLabel>
                                <Textarea {...field} />
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <ImageSection spotId={spot.id} />
                    <div className='flex flex-row-reverse items-center justify-between border-t py-4'>
                        <ActionBtns
                            message={`This action cannot be undone. This will permanently delete
                        ${spot.name} and remove the spot form the map.`}
                            onDelete={handleDelete} />
                    </div>
                </div>
            </form>
        </Form>
    )
}

export default SpotForm

type FormInputFieldProps = {
    name: keyof z.infer<typeof updateSpotSchema>
    form: UseFormReturn<z.infer<typeof updateSpotSchema>>
    description?: string
}
function SpotInputField({ name, form, description }: FormInputFieldProps) {
    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem className={"grid grid-cols-3 items-center"}>
                    <FormLabel className='capitalize'>{name}</FormLabel>
                    <FormControl className='col-span-2'>
                        {name === "color" ?
                            <ColorPicker color={field.value ?? ""} onChange={(color) => field.onChange(color)} />
                            :
                            <Input className="col-span-2" {...field} />}
                    </FormControl>
                    {description && <FormDescription className='col-span-3 text-xs text-left'>{description}</FormDescription>}
                    <FormMessage className='col-span-3 text-xs text-left' />
                </FormItem>
            )}
        />
    )
}

type SpotSelectProjectProps = {
    projects: RouterOutputs["projects"]["getProjectsByMapId"]
    projectName?: string
    onValueChange: (value: string) => void
    defaultValue?: string
}
function SpotSelectProject({ projects, projectName, onValueChange, defaultValue }: SpotSelectProjectProps) {

    return (
        <Select onValueChange={onValueChange} defaultValue={defaultValue}>
            <FormControl>
                <SelectTrigger className="col-span-2">
                    <SelectValue placeholder={projectName ?? 'Select a project'} />
                </SelectTrigger>
            </FormControl>
            <SelectContent>
                <SelectItem value="">
                    Select no project
                </SelectItem>
                <SelectSeparator />
                {projects?.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                        {project.name}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}