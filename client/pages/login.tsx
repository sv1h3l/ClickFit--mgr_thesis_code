// pages/login.tsx
import React, { useState } from 'react';
import Head from 'next/head';
import Layout from '../components/Layout';
import Card from '../components/Card';
import { Button, TextField, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useUser } from '../context/UserContext';

function Login() {
  const router = useRouter();
  const { setUser } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    console.log('Přihlášení:', { email, password });
    setUser({ email });
    router.push('/training-plans');
  };

  const handleForgotPassword = () => {
    router.push('/forgot-password');
  };

  return (
    <>
      <Head>
        <title>Přihlášení - KlikFit</title>
      </Head>

      <Layout>
        <Card>
          <Typography variant="h5" component="h2" gutterBottom style={{ textAlign: 'center' }} className="mb-0">
            Přihlášení
          </Typography>

          <TextField
            label="Email"
            fullWidth
            margin="normal"
            variant="standard"
            value={email}
            size="small"
            onChange={(e) => setEmail(e.target.value)}
          />

          <TextField
            label="Heslo"
            type="password"
            fullWidth
            margin="normal"
            variant="standard"
            value={password}
            size="small"
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="flex justify-end mt-1">
            <Button variant="text" color="secondary" onClick={handleForgotPassword} className="relative bottom-3 ml-auto py-0 px-1 mb-3">
              Zapomenuté heslo
            </Button>
          </div>

          <Typography variant="body2" component="p" gutterBottom style={{ textAlign: 'center' }} className="mb-0 text-red-600 visible">
            Neplatná emailová adresa nebo heslo.
          </Typography>

          <Button variant="contained" color="primary" onClick={handleLogin}>
            Přihlásit se
          </Button>
        </Card>
      </Layout>
    </>
  );
}

export default Login;
