"use client";

import { signOut } from 'next-auth/react';

export default function SignOut() {
    return (
        <div style={{ textAlign: 'center', marginTop: '100px' }}>
            <h1>Sign Out</h1>
            <p>Are you sure you want to sign out?</p>
            <button
                onClick={() => signOut({ callbackUrl: '/auth/signIn' })}
                style={{ padding: '10px 20px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', marginTop: '20px' }}
            >
                Sign Out
            </button>
        </div>
    );
}
