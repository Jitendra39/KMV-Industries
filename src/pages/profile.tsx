import Header from '@/components/header';
import Profile from '@/components/profile/UserProfile/profile';
import React from 'react';

export default function profile() {
    const headerHeight = 90; // Replace with your header's actual height

    return (
        <>
            <Header />
            <div style={{ paddingTop: `${headerHeight}px` }}>
                <Profile />
            </div>
        </>
    );
}