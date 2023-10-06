'use client'

import { useForm, UseFormReturn } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { z } from 'zod'

import { useToastAction } from '@/hooks/use-toast-action'
import { updateSpotSchema } from '@/lib/db/schema/spots'
import { api, RouterOutputs } from '@/lib/trpc/client'

import { Select, SelectContent, SelectItem, SelectSeparator, SelectTrigger, SelectValue } from '../ui/select'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import ColorPicker from '../color-picker'
import { Textarea } from '../ui/textarea'
import ImageSection from './img-section'
import ActionBtns from './action-btns'
import { Input } from '../ui/input'



type data = NonNullable<RouterOutputs["maps"]["getMapDataById"]>
type SpotPopoverProps = {
    data: data["spots"][0]
    projects: data["projects"]
    project?: data["projects"][0]
    mapId: string
}

function SpotForm({ data, project, projects }: SpotPopoverProps) {
    const router = useRouter()
    const [_, startTransition] = useTransition()
    const { toast } = useToastAction()


    const form = useForm<z.infer<typeof updateSpotSchema>>({
        resolver: zodResolver(updateSpotSchema),
        defaultValues: {
            id: data.id,
            name: data.name,
            color: data.color,
            projectId: data.projectId,
            description: data.description,
        }
    })
    async function handleUpdate(data: z.infer<typeof updateSpotSchema>) {
        startTransition(async () => {
            try {
                await api.spots.updateSpot.mutate({ ...data })
                toast('updated', `Spot ${data.name} updated`)
                router.refresh()
            } catch (error: any) {
                console.log(error); // TODO: handle error
                toast('error', error.message)
            }
        })
    }

    async function handleDelete() {
        startTransition(async () => {
            try {
                await api.spots.deleteSpot.mutate({ id: data.id })
                toast('deleted', `Spot ${data.name} deleted`)
                router.refresh()
            } catch (error: any) {
                console.log(error); // TODO: handle error
                toast('error', error.message)
            }
        })
    }

    return (
        <Form {...form}>
            <form onSubmit={async (e) => { e.preventDefault(), form.handleSubmit(handleUpdate)(e) }}>
                <div className="grid gap-4">
                    <div className='flex flex-col gap-1.5'>
                        <h4 className="font-medium leading-none">{data.name}</h4>
                        <p className="text-sm text-muted-foreground">{data.address}</p>
                    </div>
                    <div className="grid border-b pb-6">
                        <SpotInputField name="name" form={form} />
                        {!project?.color && <SpotInputField name="color" form={form} />}
                        <FormField
                            control={form.control}
                            name="projectId"
                            render={({ field }) => (
                                <FormItem className="grid grid-cols-3 items-center">
                                    <FormLabel>Project</FormLabel>
                                    <SpotSelectProject onValueChange={field.onChange} defaultValue={field.value} projects={projects} projectName={project?.name} />
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
                    <ImageSection spotId={data.id} />
                    <div className='flex flex-row-reverse items-center justify-between border-t py-4'>
                        <ActionBtns
                            message={`This action cannot be undone. This will permanently delete
                        ${data.name} and remove the spot form the map.`}
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
    projects: data["projects"]
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
                {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                        {project.name}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}