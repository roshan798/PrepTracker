import AppShell from '@/components/AppShell';
import AppearancePage from '@/components/appearance/AppearancePage';

export const metadata = { title: 'Appearance | PrepTracker' };

export default function Appearance() {
  return (
    <AppShell>
      <AppearancePage />
    </AppShell>
  );
}
