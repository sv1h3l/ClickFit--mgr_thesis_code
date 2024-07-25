import { Button, Toolbar } from '@mui/material';
import React from 'react';
import { useRouter } from 'next/router';

function Navigation() {
    const router = useRouter();
    const pages = new Map<string, string>([
        ['training-plans', 'Tréninkové plány'],
        ['trainings-creation', 'Tvorba tréninků'],
        ['exercises-database', 'Databáze cviků'],
        ['communication', 'Komunikace'],
        ['profile', 'Profil']]);

    function navigate(link: string) {
        router.push(`/${link}`);
    }

    return (
        <>
            <Toolbar variant="dense" component='nav' className='flex-row w-full rounded-b-full bg-m-blue h-2 min-h-8' sx={{ boxShadow: 3 }}>
                {Array.from(pages.entries()).map(([key, value]) => (
                    <Button
                        onClick={() => navigate(key)}
                        className='text-black mx-auto'
                        size='small'
                    >
                        {value}
                    </Button>
                ))}
            </Toolbar>
        </>
    );
};

export default Navigation;
