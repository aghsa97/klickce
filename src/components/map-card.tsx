import Link from 'next/link'

import { Card, CardHeader, CardTitle } from './ui/card'

type MapCardProps = {
    id: string
    name: string
}
function MapCard({ id, name }: MapCardProps) {
    return (
        <Link href={`/app/map/${id}`} className="overflow-hidden relative duration-500 border rounded-xl hover:bg-zinc-800 group md:gap-8 hover:border-zinc-400/50 cursor-pointer">
            <Card>
                <CardHeader >
                    <CardTitle className=''>{name}</CardTitle>
                </CardHeader>
            </Card>
        </Link>
    )
}

export default MapCard