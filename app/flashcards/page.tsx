import AppShell from '@/components/AppShell';
import FlashcardDeck from '@/components/Flashcards/FlashcardDeck';

export const metadata = { title: 'Flashcards | PrepTracker' };

export default function FlashcardsPage() {
    return (
        <AppShell>
            <FlashcardDeck />
        </AppShell>
    );
}
