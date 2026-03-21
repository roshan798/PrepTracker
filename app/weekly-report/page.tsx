import AppShell from '@/components/AppShell';
import WeeklyReport from '@/components/WeeklyReport/WeeklyReport';

export const metadata = { title: 'Weekly Report | PrepTracker' };

export default function WeeklyReportPage() {
    return (
        <AppShell>
            <WeeklyReport />
        </AppShell>
    );
}
