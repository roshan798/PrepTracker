import AppShell from '@/components/AppShell';
import AboutPage from '@/components/About/AboutPage';

export const metadata = { title: 'About | PrepTracker' };

export default function About() {
    return (
        <AppShell>
            <AboutPage />
        </AppShell>
    );
}
