import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Guest",
    description: "Guest pages",
};

export default function GuestLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div>
            <h1>Guest Layout</h1>
            {children}
        </div>
    );
}
