import React, { useState } from 'react';
import Head from 'next/head';
import Layout from '../components/Layout';
import Card from '../components/Card';
import { Typography, TextField, Button } from '@mui/material';
import { useRouter } from 'next/router';
import { useUser } from '../context/UserContext';

function registration() {
    const router = useRouter();
    const { setUser } = useUser();
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleRegistration = () => {
        setUser({ email });
        router.push('/training-plans');
    };


    return (
        <>
            <Head>
                <title>Registrace - KlikFit</title>
            </Head>

            <Layout>
                <Card>
                    <Typography variant="h5" component="div" gutterBottom style={{ textAlign: 'center' }} className="mb-0">
                        Registrace
                    </Typography>

                    <div className='flex flex-no-wrap gap-10'>
                        <TextField
                            error
                            helperText="Jméno nesmí být prázdné"
                            label="Jméno"
                            type=""
                            margin="normal"
                            variant="standard"
                            value={name}
                            size="small"
                            onChange={(e) => setName(e.target.value)}
                        />

                        <TextField
                            error
                            helperText="Příjmení nesmí být prázdné"
                            label="Přijmení"
                            type=""
                            margin="normal"
                            variant="standard"
                            value={surname}
                            size="small"
                            onChange={(e) => setSurname(e.target.value)}
                        />
                    </div>

                    <div>
                        <TextField
                            error
                            helperText="Neplatný email" /* Účet s tímto emailem již existuje */
                            label="Email"
                            type="email"
                            fullWidth
                            margin="normal"
                            variant="standard"
                            value={email}
                            size="small"
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <TextField
                            error
                            helperText="Heslo musí osbahovat alespoň 8 znaků"
                            label="Heslo"
                            type="password"
                            fullWidth
                            margin="normal"
                            variant="standard"
                            value={password}
                            size="small"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <TextField
                        error
                        helperText="Hesla se neshodují"
                        label="Potvrzení hesla"
                        type="password"
                        fullWidth
                        margin="normal"
                        variant="standard"
                        value={confirmPassword}
                        size="small"
                        className="mb-8"
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />

                    <Button variant="contained" color="primary" onClick={handleRegistration}>
                        Registrovat se
                    </Button>
                </Card>
            </Layout>
        </>
    );
}

export default registration;
