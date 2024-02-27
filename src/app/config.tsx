import * as Icons from "@/components/icons";

export const marketingFeatures = [
    {
        icon: <Icons.Component className="h-8 w-8" />,
        title: "Crafted to Your Vision",
        body: (
            <>
                With Klickce, dive deep into designing. Choose from enchanting map styles and craft striking modal pop-ups — you have the canvas, we provide the tools.
            </>
        ),
    },
    {
        icon: <Icons.MapPin className="w-8 h-8" />,
        title: "Dynamic Spots",
        body: (
            <>
                Whether you are pinpointing a single location or mapping out thousands, Klickce has got you covered. Our dynamic spots are designed to scale with your needs.
            </>
        ),
    },
    {
        icon: <Icons.LocateFixed className="w-8 h-8" />,
        title: "Guide with Precision",
        body: (
            <>
                Offer visitors a personalized experience by highlighting their current location, ensuring intuitive navigation through your maps.
            </>
        ),
    },
    // {
    //     icon: <Icons.Kanban className="h-8 w-8" />,
    //     title: "Detailed Overview",
    //     badge: "Coming Soon",
    //     body: (
    //         <>
    //             Stay updated on your map performance. With Our Analytics, monitor map views, interactions, and user engagement at your fingertips.
    //         </>
    //     ),
    // },
    {
        icon: <Icons.Share className="w-8 h-8" />,
        title: "Sharing & Integration",
        body: (
            <>
                Share your creations effortlessly. With Klickce, your maps can be beautifully embedded into any website with your custom domain for the world to see.
            </>
        ),
    },
    {
        icon: <Icons.FolderKanban className="w-8 h-8" />,
        title: "Organized & Tailored",
        body: (
            <>
                Group spots into specific projects, defining them with custom styles and categories, for a streamlined and organized mapping experience.
            </>
        ),
    },
    {
        icon: <Icons.GalleryHorizontalEnd className="h-8 w-8" />,
        title: "Visual Narratives",
        body: (
            <>
                Incorporate captivating photo galleries and immersive lightboxes within your modal pop-ups, making each point a visual treat.
            </>
        ),
    },
    // {
    //     icon: <Icons.MonitorSmartphone className="h-8 w-8" />,
    //     title: "Always Accessible",
    //     badge: "Coming Soon",
    //     body: (
    //         <>
    //             Our responsive design ensures that whether you are creating or browsing, Klickce maps adjust perfectly to your mobile screens.            </>
    //     ),
    // },
];

export const faqs = [
    {
        question: "What is Klickce?",
        answer: (
            <>
                Klickce is a mapping platform that allows you to create and share interactive maps. With Klickce, you can create custom maps, add markers, and embed them on your website.
            </>
        ),
    },
    {
        question: "How do I start customizing my map?",
        answer: (
            <>
                Simply sign up or log in to your Klickce account. Once logged in, navigate to dashboard and begin your design process. Our intuitive interface ensures a smooth experience even for first-time users.
            </>
        ),
    },
    {
        question: "How do I share my map on my website?",
        answer: (
            <>
                You can setup a custom slug or domain for your map and embed it on your website. You can also share your map with others by sharing the link to your map.
            </>
        ),
    },
    {
        question: "Who do I contact for further support or inquiries?",
        answer: (
            <>
                For additional support or queries, please reach out to us at support@klickce.se.
            </>
        ),
    },
]

export const aboutUs = {
    body: (
        <p>
            We believe that every journey, every adventure, and every dream is unique.
            We designed Klickce to let you craft your stories, stitch your memories,
            and share your vision on a canvas that is truly yours.
        </p>
    ),
}

export type Plans = "BASIC" | "PRO";

export interface PlanProps {
    title: string;
    description: string;
    cost: number | string;
    features: string[];
    badge?: string;
    action?:
    | {
        text: string;
        link: string;
    }
    | {
        text: string;
        onClick: () => void;
    };
    disabled?: boolean;
    loading?: boolean;
}

export const plansConfig: Record<Plans, PlanProps> = {
    BASIC: {
        title: "Basic",
        description: "Get started now and upgrade once reaching the limits.",
        cost: 99,
        features: [
            "1 map",
            "50 spots",
            "1000 views",
            "Analytics",
        ],
        badge: "30 days free trial",
        action: {
            text: "Start Now",
            link: "/sign-up?plan=basic",
        },
    },
    PRO: {
        title: "Pro",
        description: "For those who want to create more maps and spots.",
        cost: 299,
        features: [
            "5 maps",
            "200 spots (Across all maps)",
            "3000 views (Across all maps)",
            "Analytics",
            "Own Landing page",
        ],
        badge: "Early Adopter",
        action: {
            text: "Start Now",
            link: "/sign-up?plan=pro",
        },
    },
};