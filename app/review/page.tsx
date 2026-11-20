import AppShell from '@/components/AppShell';
import ReviewQueue from '@/components/ReviewQueue/ReviewQueue';

export const metadata = { title: 'Review Queue | PrepTracker' };

export default function ReviewPage() {
  return (
    <AppShell>
      <ReviewQueue />
    </AppShell>
  );
}
