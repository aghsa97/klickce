'use client'

import React from 'react'
import { useParams } from 'next/navigation'

import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import * as Icon from '@/components/icons'
import { useToastAction } from '@/hooks/use-toast-action'

const url =
    process.env.NODE_ENV !== "development"
        ? process.env.VERCEL_URL
        : "http://localhost:3000";

function ShareTab() {
    const { id: mapId } = useParams()
    const { toast } = useToastAction()
    const link = `${url}/map/${mapId as string}`
    const iFrame = `<iframe src='"${url}/map/${mapId as string}"' width="100%" height="500px" frameborder="0" allowfullscreen />`

    // TODO: copy to clipboard
    function copyToClipboard(valueType: 'map-link' | 'share-with-iframe') {
        if (valueType === 'map-link') {
            navigator.clipboard.writeText(link)
        }
        else if (valueType === 'share-with-iframe') {
            navigator.clipboard.writeText(iFrame)
        }
        toast('created', 'Copied to clipboard')
    }

    return (
        <div className='flex flex-col gap-8'>
            <div className='flex flex-col items-start justify-center gap-1'>
                <Label className='w-full flex'>
                    <div className='w-full flex items-center justify-between'>
                        <p>
                            Map Link
                        </p>
                        <Button variant={"ghost"} size="sm" className='gap-1.5' onClick={() => copyToClipboard("map-link")}>
                            <Icon.Copy className='w-4 h-4' />
                            Copy
                        </Button>
                    </div>
                </Label>
                <Input
                    id='map-link'
                    name="Map Link"
                    defaultValue={link}
                    disabled
                />
            </div>
            <div className='flex flex-col items-start justify-center gap-1'>
                <Label className='w-full flex'>
                    <div className='w-full flex items-center justify-between'>
                        <p>
                            Map iframe
                        </p>
                        <Button variant={"ghost"} size="sm" className='gap-1.5' onClick={() => copyToClipboard("share-with-iframe")}>
                            <Icon.Copy className='w-4 h-4' />
                            Copy
                        </Button>
                    </div>
                </Label>
                <Textarea
                    id='share-with-iframe'
                    name="Share with iFrame"
                    defaultValue={iFrame}
                    disabled
                />
            </div>
        </div>

    )
}

export default ShareTab