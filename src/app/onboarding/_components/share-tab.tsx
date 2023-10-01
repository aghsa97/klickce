import React from 'react'

import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

function ShareTab({ mapId }: { mapId: string }) {
    const iFrame = `<iframe src='"${process.env.VERCEL_URL}/map/${mapId}"' width="100%" height="500px" frameborder="0" allowfullscreen />`
    return (
        <div className='flex flex-col gap-8'>
            <div className='flex flex-col items-start justify-center gap-1.5'>
                <Label className='w-full flex'>
                    <div className='w-full flex items-center justify-between'>
                        <p>
                            Map Link
                        </p>
                        <Button variant={"link"} size="sm" className='p-0'>
                            Copy
                        </Button>
                    </div>
                </Label>
                <Input
                    name="Map Link"
                    defaultValue={process.env.VERCEL_URL + "/map/" + mapId}
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
                        <Button variant={"link"} size="sm" className='p-0'>
                            Copy
                        </Button>
                    </div>
                </Label>
                {/* Share with iFrame */}
                <Textarea
                    name="Share with iFrame"
                    defaultValue={iFrame}
                    className="text-muted-foreground h-full max-h-20"
                    disabled
                />
            </div>
        </div>

    )
}

export default ShareTab