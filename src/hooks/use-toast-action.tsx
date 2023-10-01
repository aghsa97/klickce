import { Button } from "@/components/ui/button";
import { useToast, Toast } from "@/components/ui/use-toast";

const config = {
    error: {
        title: "Something went wrong",
        description: "Please try again",
        variant: "destructive",
        action: (
            <Button variant="outline" asChild>
                <a href="#" rel="noreferrer">
                    Support
                </a>
            </Button>
        ),
    },
    reachedLimits: {
        variant: "destructive",
        title: "You have reached the limit for your plan.",
        description: "Please upgrade your plan to create more maps.",
    },
    "unique-slug": {
        title: "Slug is already taken",
        description: "Please select another slug. Every slug is unique.",
    },
    created: { title: "Created successfully", variant: "success" },
    deleted: { title: "Deleted successfully", variant: "info" }, // TODO: we are not informing the user besides the visual changes when an entry has been deleted
    updated: { title: "Updated successfully", variant: "info" },
    "test-error": {
        title: "Connection Failed",
        // description: "Be sure to include the auth headers.",
        variant: "destructive",
    },
    "test-success": {
        title: "Connection Established",
    },
} as const;

type ToastAction = keyof typeof config;

export function useToastAction() {
    const { toast: defaultToast } = useToast();

    function toast(action: ToastAction) {
        return defaultToast(config[action]);
    }

    return { toast };
}