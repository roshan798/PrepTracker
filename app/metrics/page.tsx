// app/metrics/page.tsx
import AppShell from '@/components/AppShell';
import MetricsDashboard from '@/components/Metrics/MetricsDashboard';

export const metadata = { title: 'Prep Metrics | PrepTracker' };

export default function MetricsPage() {
  return (
    <AppShell>
      <MetricsDashboard />
    </AppShell>
  );
}