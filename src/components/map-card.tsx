import React from 'react'

import * as Icons from './icons'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card'

type MapCardProps = {
    name: string
    style: string
    views: number
    tags: string[]
}


function MapCard({ name, style, tags, views }: MapCardProps) {
    return (
        <Card>
            <CardHeader className='relative h-40 border-b border-border' style={{
                backgroundImage: `url(/grainy.png)`,
            }}>
                {style}
                <Button variant='outline' className='absolute top-2 right-2'>
                    <Icons.Share className='w-4 h-4 text-muted-foreground' />
                </Button>
            </CardHeader>
            <CardContent className='mt-6'>
                <CardTitle className=''>{name}</CardTitle>
            </CardContent>
            <CardFooter className='flex justify-between items-center'>
                <div className='flex items-center gap-2'>
                    <Icons.Eye className='w-4 h-4 text-muted-foreground text-sm' />
                    <p className='text-muted-foreground text-sm'>{views}</p>
                </div>
                <div className='flex items-center gap-2'>
                    {tags.map((tag, index) => (
                        // Show first two tags and then a +{n} badge only once for the rest
                        index < 2 ?
                            <Badge key={tag} variant='outline'>
                                {tag}
                            </Badge>
                            :
                            index === 2 &&
                            <Badge key={tag} variant='outline'>
                                +{tags.length - 2}
                            </Badge>
                    ))}
                </div>
            </CardFooter>
        </Card>
    )
}

export default MapCard