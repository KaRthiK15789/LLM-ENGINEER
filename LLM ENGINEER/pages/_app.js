import '@/styles/globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function App({ Component, pageProps }) {
  return (
    <div className={`${inter.className} min-h-screen bg-gray-50`}>
      <main className="container mx-auto px-4 py-8">
        <Component {...pageProps} />
      </main>
    </div>
  );
}
