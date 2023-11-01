import { RouterOutputs } from '@/server/api'
import Link from 'next/link'

import * as Icons from './icons'
import { Button } from './ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card'

type MapCardProps = {
    map: RouterOutputs["maps"]["getCustomerMaps"][0]
}
function MapCard({ map }: MapCardProps) {
    return (
        <Link href={`/app/map/${map.id}`}>
            <Card>
                <CardHeader className='relative h-40 border-b border-border' style={{
                    backgroundImage: `url(/grainy.png)`,
                }}>
                    <Button variant='outline' className='absolute top-2 right-2'>
                        <Icons.Share className='w-4 h-4 text-muted-foreground' />
                    </Button>
                </CardHeader>
                <CardContent className='mt-6'>
                    <CardTitle className=''>{map.name}</CardTitle>
                </CardContent>
            </Card>
        </Link>
    )
}

export default MapCard