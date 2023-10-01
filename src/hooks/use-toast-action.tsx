import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

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
    created: { title: "Created successfully", variant: "success", description: "You can now add spots to your map" },
    deleted: { title: "Deleted successfully", variant: "info", description: "You deleted it successfuly." }, // TODO: we are not informing the user besides the visual changes when an entry has been deleted
    updated: { title: "Updated successfully", variant: "info", description: "You updated it successfuly." },
} as const;

type ToastAction = keyof typeof config;

export function useToastAction() {
    const { toast: defaultToast } = useToast();

    function toast(action: ToastAction, message?: string) {
        return defaultToast({
            title: config[action].title,
            description: message ?? config[action].description,
            variant: config[action].variant,
        });
    }

    return { toast };
}