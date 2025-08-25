"use client";

import { useSession, signOut } from "next-auth/react";
import styles from "./Navbar.module.css";

export default function Navbar() {
    const { data: session } = useSession();

    return (
        <nav className={styles.navbar}>
            <button
                onClick={() => signOut({ callbackUrl: '/auth/signIn' })}
                className={styles.logoutButton}
            >
                خروج
            </button>
            {session?.user?.name && (
                <span className={styles.username}>{session.user.name}</span>
            )}
        </nav>
    );
}
