"use client";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default function UserLayout({ children }: { children: ReactNode }) {
    const { data: session, status } = useSession();

    if (status === "loading") {
        return <div>Loading...</div>; // Or a spinner component
    }

    if (!session) {
        redirect("/auth/signIn");
    }

    return (
        <div>
            {/* <h1>User Layout (Dashboard)</h1> */}
            {/* Sidebar and Navbar would go here */}
            <main>{children}</main>
        </div>
    );
}
