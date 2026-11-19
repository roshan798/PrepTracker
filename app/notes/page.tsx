import AppShell from '@/components/AppShell';
import QuickNotesPage from '@/components/QuickNotes/QuickNotesPage';

export const metadata = { title: 'Quick Notes | PrepTracker' };

export default function NotesPage() {
  return (
    <AppShell>
      <QuickNotesPage />
    </AppShell>
  );
}
