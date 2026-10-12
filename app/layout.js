import { Inter, Space_Grotesk, Playfair_Display } from 'next/font/google';
import './globals.css';
import CursorProvider from '@/components/cursor/CursorProvider';
import SmoothScroll from '@/components/smooth-scroll/SmoothScroll';
import PreloaderProvider from '@/components/preloader/PreloaderProvider';
import PageTransition from '@/components/transitions/PageTransition';
import Navbar from '@/components/navigation/Navbar';
import MobileMenu from '@/components/navigation/MobileMenu';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { Flip } from 'gsap/Flip';

// Register GSAP plugins globally once (only runs on client side inside useGSAP typically, but Next.js might run this on server where window is undefined. We'll handle inside components mostly, but let's safely try to register here if window exists, though Next.js app router layout is a server component by default). 
// Wait, layout.js is a server component. We shouldn't register GSAP here directly if it imports client-only code unless we use a client component wrapper. But we already do it inside the components.

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({ 
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

const playfairDisplay = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
  style: ['normal', 'italic'],
  weight: ['400', '700'],
});

export const metadata = {
  title: 'Tabsheerul Hafeez | Full Stack Developer & Systems Architect',
  description: 'Full Stack Developer specializing in scalable end-to-end applications, microservices, event-driven architectures, and AI integration. Based in Jamshedpur, India.',
  keywords: ['Full Stack Developer', 'Java', 'Spring Boot', 'React', 'Microservices', 'Apache Kafka', 'Tabsheerul Hafeez', 'Jamshedpur', 'Portfolio'],
  authors: [{ name: 'Tabsheerul Hafeez' }],
  creator: 'Tabsheerul Hafeez',
  metadataBase: new URL('https://tabsheerul.dev'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://tabsheerul.dev',
    siteName: 'Tabsheerul Hafeez Portfolio',
    title: 'Tabsheerul Hafeez | Full Stack Developer',
    description: 'Building scalable end-to-end applications, microservices, and AI-driven systems.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Tabsheerul Hafeez Portfolio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tabsheerul Hafeez | Full Stack Developer',
    description: 'Building scalable end-to-end applications, microservices, and AI-driven systems.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Person',
              name: 'Tabsheerul Hafeez',
              jobTitle: 'Full Stack Developer',
              description: 'Full Stack Developer specializing in scalable end-to-end applications, microservices, and event-driven architectures.',
              url: 'https://tabsheerul.dev',
              sameAs: [
                'https://github.com/Tabsheerul',
              ],
              address: {
                '@type': 'PostalAddress',
                addressLocality: 'Jamshedpur',
                addressRegion: 'Jharkhand',
                addressCountry: 'India',
              },
              alumniOf: {
                '@type': 'CollegeOrUniversity',
                name: 'Jharkhand University of Technology',
              },
              knowsAbout: [
                'Java', 'Spring Boot', 'React.js', 'Microservices', 'Apache Kafka', 
                'PostgreSQL', 'Docker', 'Google Cloud Vertex AI', 'Tailwind CSS'
              ],
            }),
          }}
        />
      </head>
      <body className={`${inter.variable} ${spaceGrotesk.variable} ${playfairDisplay.variable} antialiased selection:bg-accent-primary/30 selection:text-white`}>
        <CursorProvider>
          <SmoothScroll>
            <PreloaderProvider>
              <PageTransition>
                <Navbar />
                <MobileMenu />
                <main>{children}</main>
              </PageTransition>
            </PreloaderProvider>
          </SmoothScroll>
        </CursorProvider>
      </body>
    </html>
  );
}
