import React, { useState } from 'react';
import Head from 'next/head';
import Layout from '../components/Layout';
import Card from '../components/Card';
import { Button, TextField, Typography } from '@mui/material';
import { useRouter } from 'next/router';

function forgotPassword() {
    const router = useRouter();
    const [username, setUsername] = useState('');

    const handleLogin = () => {
        router.push('/');
    };

    return (
        <>
            <Head>
                <title>Zapomenuté heslo - KlikFit</title>
                <meta name="description" content="Obnovte své zapomenuté heslo pro KlikFit." />
            </Head>

            <Layout>
                <Card>
                    <Typography variant="h5" component="h2" gutterBottom style={{ textAlign: 'center' }} className="mb-0">
                        Zapomenuté heslo
                    </Typography>

                    <Typography variant="body2" component="p" gutterBottom style={{ textAlign: 'center' }} color="text.secondary" className="mb-0">
                        Na zadaný email bude zasláno nové heslo.
                    </Typography>

                    <TextField
                        error
                        label="Email"
                        type="email"
                        fullWidth
                        margin="normal"
                        variant="standard"
                        value={username}
                        className="mb-8"
                        onChange={(e) => setUsername(e.target.value)}
                        helperText="Účet s tímto emailem neexistuje"
                    />

                    <Button variant="contained" color="primary" onClick={handleLogin}>
                        Odeslat
                    </Button>
                </Card>
            </Layout>
        </>
    );
}

export default forgotPassword;