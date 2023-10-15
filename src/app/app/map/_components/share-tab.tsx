'use client'

import React from 'react'
import { useParams } from 'next/navigation'

import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const url =
    process.env.NODE_ENV === "production"
        ? "klickce.se"
        : "http://localhost:3000";

function ShareTab() {
    const params = useParams()
    const link = `${url}/map/${params.mapId}`
    const iFrame = `<iframe src='"${url}/map/${params.mapId}"' width="100%" height="500px" frameborder="0" allowfullscreen />`

    // TODO: copy to clipboard
    function copyToClipboard(valueType: 'map-link' | 'share-with-iframe') {
        if (valueType === 'map-link') {
            navigator.clipboard.writeText(link)
        }
        else if (valueType === 'share-with-iframe') {
            navigator.clipboard.writeText(iFrame)
        }
    }

    return (
        <div className='flex flex-col gap-8'>
            <div className='flex flex-col items-start justify-center gap-1.5'>
                <Label className='w-full flex'>
                    <div className='w-full flex items-center justify-between'>
                        <p>
                            Map Link
                        </p>
                        <Button variant={"link"} size="sm" className='p-0' onClick={() => copyToClipboard("map-link")}>
                            Copy
                        </Button>
                    </div>
                </Label>
                <Input
                    id='map-link'
                    name="Map Link"
                    defaultValue={link}
                    className="text-muted-foreground"
                    disabled
                />
            </div>
            <div className='flex flex-col items-start justify-center gap-1.5'>
                <Label className='w-full flex'>
                    <div className='w-full flex items-center justify-between'>
                        <p>
                            Map iframe
                        </p>
                        <Button variant={"link"} size="sm" className='p-0' onClick={() => copyToClipboard("share-with-iframe")}>
                            Copy
                        </Button>
                    </div>
                </Label>
                {/* Share with iFrame */}
                <Textarea
                    id='share-with-iframe'
                    name="Share with iFrame"
                    defaultValue={iFrame}
                    className="text-muted-foreground h-full max-h-full"
                    disabled
                />
            </div>
        </div>

    )
}

export default ShareTab