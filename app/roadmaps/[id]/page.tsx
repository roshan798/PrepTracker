import AppShell from '@/components/AppShell';
import RoadmapView from '@/components/roadmap/RoadmapView';

interface PageProps {
  params: { id: string };
}

export default function RoadmapPage({ params }: PageProps) {
  return (
    <AppShell>
      <RoadmapView roadmapId={params.id} />
    </AppShell>
  );
}
