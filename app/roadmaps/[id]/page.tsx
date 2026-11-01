import AppShell from '@/components/AppShell';
import RoadmapView from '@/components/roadmap/RoadmapView';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function RoadmapPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <AppShell>
      <RoadmapView roadmapId={id} />
    </AppShell>
  );
}
