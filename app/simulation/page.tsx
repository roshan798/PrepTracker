import AppShell from '@/components/AppShell';
import InterviewSim from '@/components/InterviewSim/InterviewSim';

export const metadata = { title: 'Interview Simulation | PrepTracker' };

export default function SimPage() {
  return (
    <AppShell>
      <InterviewSim />
    </AppShell>
  );
}
