'use client'

import React from 'react'

import { CldImage } from 'next-cloudinary'

function CloudinaryImg({ publicId }: { publicId: string }) {
    return (
        <CldImage
            src={publicId}
            width="0"
            height="0"
            sizes="100vw"
            alt="Description of my image"
            className={"w-full object-cover shadow-md rounded-[2.8rem] "}
        />
    )
}

export default CloudinaryImg