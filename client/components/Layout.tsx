import React, { ReactNode } from 'react';
import Header from './Header';
import Navigation from './Navigation';

function Layout({ children }: { children: ReactNode }) {
    return (
        <>
            <Header />

            <main className='mx-2'>
                {children}
            </main>
        </>
    );
};

export default Layout;
