'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { useTransition } from "react"
import { z } from "zod"

import { updateProjectSchema } from "@/lib/db/schema/projects"
import { api, RouterOutputs } from "@/lib/trpc/client"

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import ColorPicker from "../color-picker"
import ActionBtns from "./action-btns"
import { Input } from "../ui/input"
import { toast } from "sonner"

type data = NonNullable<RouterOutputs["maps"]["getMapDataById"]>

type ContentTabProps = {
    data: Omit<data["projects"][0], "spots">
    setIsOpen: (isOpen: boolean) => void
}

function ProjectForm({ data, setIsOpen }: ContentTabProps) {
    const form = useForm<z.infer<typeof updateProjectSchema>>({
        resolver: zodResolver(updateProjectSchema),
        defaultValues: {
            id: data.id,
            name: data.name,
            color: data.color,
            isVisible: data.isVisible,
        }
    })

    const router = useRouter()
    const [_, startTransition] = useTransition()

    async function handleUpdate(data: z.infer<typeof updateProjectSchema>) {
        if (!data.name) return
        startTransition(async () => {
            try {
                await api.projects.updateProject.mutate({
                    ...data
                })
                setIsOpen(false)
                toast.success(`Project ${data.name} updated`)
                router.refresh()
            } catch (error: any) {
                toast.error(error.message)
            }
        })
    }

    async function handleDelete() {
        startTransition(async () => {
            try {
                await api.projects.deleteProject.mutate({ id: data.id })
                setIsOpen(false)
                toast.success(`Project ${data.name} deleted`)
                router.refresh()
            } catch (error: any) {
                toast.error(error.message)
            }
        })
    }
    return (
        <Form {...form} >
            <form onSubmit={async (e) => {
                e.preventDefault(),
                    form.handleSubmit(handleUpdate)(e)
            }}
                className="space-y-4"
            >
                <div>
                    <h4 className="font-medium leading-none">{data.name}</h4>
                    <p className="text-sm text-muted-foreground">
                        Project colors override the colors of the spots.
                    </p>
                </div>
                <div className="grid">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem className="grid grid-cols-3 items-center gap-4">
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input
                                        className="col-span-2"
                                        {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="color"
                        render={({ field }) => (
                            <FormItem className="grid grid-cols-3 items-center gap-4">
                                <FormLabel>Color</FormLabel>
                                <FormControl className="col-span-2">
                                    <ColorPicker color={field.value ?? ""} onChange={(color) => field.onChange(color)} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <ActionBtns
                    message={`This action cannot be undone. This will permanently delete
                            ${data.name} and remove all the related spots form the map.`}
                    onDelete={handleDelete} />
            </form>
        </Form>
    )
}

export default ProjectForm