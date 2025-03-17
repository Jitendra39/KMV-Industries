import Header from '@/components/header';
import Profile from '@/components/profile/UserProfile/profile';
import React from 'react';

export default function profile() {
    const headerHeight = 90;  
    return (
        <>
            <Header />
            <div style={{ paddingTop: `${headerHeight}px` }}>
                <Profile />
            </div>
        </>
    );
}