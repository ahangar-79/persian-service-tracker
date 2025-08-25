"use client";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import Navbar from "@/components/Navbar";
import Spinner from "@/components/Spinner";

export default function UserLayout({ children }: { children: ReactNode }) {
    const { data: session, status } = useSession();

    if (status === "loading") {
        return <Spinner />;
    }

    if (!session) {
        redirect("/auth/signIn");
    }

    return (
        <div>
            <Navbar />
            <main>{children}</main>
        </div>
    );
}
