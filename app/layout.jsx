import '../styles/globals.css';
import { Footer } from '../components/footer';
import { Header } from '../components/header';

export const metadata = {
    title: {
        template: '%s | Al Broker',
        default: 'Al Broker — Your AI Real Estate Assistant'
    },
    description: 'Your AI-powered real estate assistant. Save listings, get personalized insights, and feel confident when buying a home.',
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <head>
                <link rel="icon" href="/favicon.svg" sizes="any" />
            </head>
            <body
                className="antialiased"
                style={{
                    backgroundColor: '#E0F2F1',
                    color: '#263238',
                    minHeight: '100vh',
                }}
            >
                <div
                    className="flex flex-col min-h-screen px-6 sm:px-12"
                    style={{ backgroundColor: 'var(--bg)', color: 'var(--text)' }}
                >
                    <div className="flex flex-col w-full max-w-5xl mx-auto grow">
                        <Header />
                        <main className="grow" style={{ color: 'var(--text)' }}>
                            {children}
                        </main>
                        <Footer />
                    </div>
                </div>
            </body>
        </html>
    );
}
