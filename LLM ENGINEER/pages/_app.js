import '@/styles/globals.css';
import { Inter } from 'next/font/google';
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ['latin'] });

export default function App({ Component, pageProps }) {
  return (
    <div className={`${inter.className} min-h-screen bg-background text-foreground`}>
      <Component {...pageProps} />
      <Toaster richColors position="top-center" />
    </div>
  );
}
