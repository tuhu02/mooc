import { Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import type { ReactNode } from 'react';

type CourseLearningLayoutProps = {
    children: ReactNode;
    courseTitle: string;
    courseSlug: string;
    sidebarOpen: boolean;
    onToggleSidebar: () => void;
};

export default function CourseLearningLayout({
    children,
    courseTitle,
    courseSlug,
}: CourseLearningLayoutProps) {
    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <header className="sticky top-0 z-40 flex h-16 items-center border-b border-slate-200 bg-white shadow-sm">
                <div className="flex w-full items-center gap-3 px-4 sm:px-6">
                    <Link
                        href={`/member/courses/${courseSlug}`}
                        className="flex shrink-0 items-center gap-2 rounded-lg p-1.5 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
                        title="Kembali ke kursus"
                    >
                        <ArrowLeft className="h-5 w-5" />
                        <span className="text-sm font-medium text-slate-800">
                            {courseTitle}
                        </span>
                    </Link>
                </div>
            </header>

            {/* Main Content */}
            <main className="relative flex w-full">{children}</main>
        </div>
    );
}
