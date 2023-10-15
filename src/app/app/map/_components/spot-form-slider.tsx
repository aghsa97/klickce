'use client'

import React from 'react'
import { usePathname, useRouter } from 'next/navigation'

import { RouterOutputs } from '@/lib/api'
import * as Icon from '@/components/icons'
import useUpdateSearchParams from '@/hooks/update-search-params'
import SpotForm from '@/components/forms/spot-form'


type data = NonNullable<RouterOutputs["maps"]["getMapDataById"]>
type Props = {
  data: data["spots"][0]
  projects: RouterOutputs["projects"]["getProjectsByMapId"]
}

function SpotFormSlider({ data, projects }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const updateSearchParams = useUpdateSearchParams()
  return (
    <div>
      <Icon.Close className='w-8 h-8 absolute z-[999] top-4 right-4 cursor-pointer rounded-full p-2 bg-black/50 backdrop-blur-[2px]' onClick={() => router.replace(
        `${pathname}?${updateSearchParams({
          spotId: null,
          styles: null,
        })}`,
      )} />
      <SpotForm data={data} projects={projects} />
    </div>
  )
}

export default SpotFormSlider