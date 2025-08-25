"use client";

import { signOut } from 'next-auth/react';
import styles from './SignOut.module.css';

export default function SignOut() {
    return (
        <div className={styles.signOutContainer}>
            <h1>Sign Out</h1>
            <p>Are you sure you want to sign out?</p>
            <button
                onClick={() => signOut({ callbackUrl: '/auth/signIn' })}
                className={styles.signOutButton}
            >
                Sign Out
            </button>
        </div>
    );
}
