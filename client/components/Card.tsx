import React, { ReactNode } from 'react';
import { Card, CardContent } from '@mui/material';

function CardComp({ children }: { children: ReactNode }) {
    return (
        <div className="flex justify-center items-center h-screen">
            <Card style={{ minWidth: 300, maxWidth: 1000, padding: 20 }}>
                <CardContent style={{ textAlign: 'center' }}>
                    {children}
                </CardContent>
            </Card>
        </div>
    );
};

export default CardComp;
