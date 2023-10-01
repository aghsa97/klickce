'use client'

import { HexColorPicker } from "react-colorful";
import React from 'react'

import { cn } from '@/lib/utils';
import { Input } from "./ui/input";

type ColorPickerProps = {
    color: string
    onChange: (color: string) => void
    className?: string
}

function ColorPicker({ color, onChange, className }: ColorPickerProps) {
    const [currentColor, setCurrentColor] = React.useState(color)
    const [isPickerOpen, setIsPickerOpen] = React.useState(false)

    function handleColorChange(color: string) {
        onChange(color)
        setCurrentColor(color)
    }
    return (
        <div className={cn("flex flex-col gap-2 relative", className)}>
            {isPickerOpen && <HexColorPicker color={color} onChange={handleColorChange} className="top-12" style={{
                position: 'absolute',
                zIndex: 9999,
                width: '100%',
            }} />}
            <Input value={currentColor} onChange={(e) => handleColorChange(e.target.value)} />
            <div className="absolute w-6 h-6 bottom-2 right-2 rounded-full" style={{
                backgroundColor: currentColor,
            }}
                onClick={() => setIsPickerOpen(!isPickerOpen)}
            />
        </div>
    )
}

export default ColorPicker