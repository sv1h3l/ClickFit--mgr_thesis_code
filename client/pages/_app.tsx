import "@/styles/globals.css";
import 'tailwindcss/tailwind.css';
import type { AppProps } from "next/app";
import { UserProvider } from '../context/UserContext';

function ClickFit({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
      <Component {...pageProps} />
    </UserProvider>
  );
}

export default ClickFit;
