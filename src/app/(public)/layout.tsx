import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import BottomNav from '@/components/layout/bottom-nav';

export default function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-primary/20">
            <Header />
            <main className="flex-grow pb-20 md:pb-0">
                {children}
            </main>
            <Footer />
            <BottomNav />
        </div>
    );
}
