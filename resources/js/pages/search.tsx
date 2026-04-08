import { Head, Link, router, usePage } from '@inertiajs/react';
import { FormEvent, useState } from 'react';
import { Search } from 'lucide-react';
import WelcomeNav from '@/components/welcome/welcome-nav';
import FooterSection from '@/components/welcome/footer-section';

type CourseSearchItem = {
    id: number;
    title: string;
    slug: string;
    description: string;
    thumbnail: string;
    mentor_name: string | null;
};

type Props = {
    canRegister?: boolean;
    query: string;
    sections: {
        courses: CourseSearchItem[];
    };
    meta: {
        courses_total: number;
    };
};

export default function SearchPage({
    canRegister = true,
    query,
    sections,
    meta,
}: Props) {
    const { auth } = usePage().props as { auth: { user: any } };
    const hasResult = sections.courses.length > 0;

    return (
        <div className="flex min-h-screen flex-col bg-slate-100 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
            <Head title="Search" />

            <WelcomeNav auth={auth} canRegister={canRegister} />

            <main className="mx-auto max-w-7xl flex-grow px-4 pt-28 pb-16 md:px-8">
                <section className="mb-8">
                    <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
                        {query
                            ? `Search results for \"${query}\"`
                            : 'Search Courses'}
                    </h1>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                        {meta.courses_total} hasil ditampilkan
                    </p>

                </section>
                {!query && (
                    <section className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center dark:border-slate-700 dark:bg-slate-900">
                        <h2 className="text-xl font-semibold">
                            Masukkan kata kunci pencarian
                        </h2>
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                            Contoh: laravel, react, atau nama mentor.
                        </p>
                    </section>
                )}
                {query && !hasResult && (
                    <section className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center dark:border-slate-700 dark:bg-slate-900">
                        <h2 className="text-xl font-semibold">
                            Tidak ada hasil untuk "{query}"
                        </h2>
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                            Coba kata kunci lain yang lebih umum.
                        </p>
                    </section>
                )}
                {sections.courses.length > 0 && (
                    <section className="mb-8">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-xl font-semibold">Courses</h2>
                            <Link
                                href={`/courses?search=${encodeURIComponent(query)}`}
                                className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
                            >
                                View all courses
                            </Link>
                        </div>
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {sections.courses.map((course) => {
                                const thumbnailUrl =
                                    course.thumbnail?.startsWith('http')
                                        ? course.thumbnail
                                        : `/storage/${course.thumbnail}`;

                                return (
                                    <article
                                        key={course.id}
                                        className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
                                    >
                                        <img
                                            src={thumbnailUrl}
                                            alt={course.title}
                                            className="mb-4 h-44 w-full rounded-xl object-cover"
                                            loading="lazy"
                                        />
                                        <h3 className="line-clamp-2 text-lg font-bold text-slate-900 dark:text-white">
                                            {course.title}
                                        </h3>
                                        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                                            {course.mentor_name ??
                                                'Unknown Mentor'}
                                        </p>
                                        <p className="line-clamp-2">
                                            {course.description}
                                        </p>
                                    </article>
                                );
                            })}
                        </div>
                    </section>
                )}
            </main>

            <FooterSection />
        </div>
    );
}
