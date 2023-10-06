"use client";

import { useTheme } from "next-themes";

import { Button } from "./ui/button";
import * as Icons from "./icons";

export default function ThemeToggle(props: {
    align?: "center" | "start" | "end";
    side?: "top" | "bottom";
}) {
    const { setTheme, theme } = useTheme();

    const triggerIcon = {
        light: <Icons.Sun className="h-6 w-6" />,
        dark: <Icons.Moon className="h-6 w-6" />,
    }[theme as "light" | "dark"];

    return (
        <Button
            variant="ghost"
            size="sm"
            className="gap-1 px-2 text-lg font-semibold md:text-base"
            onClick={() => {
                setTheme(theme === "light" ? "dark" : "light");
            }
            }
        >
            {triggerIcon}
        </Button>
    );
}