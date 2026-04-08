import { Head, Link, router, usePage } from '@inertiajs/react';
import { FormEvent, useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import WelcomeNav from '@/components/welcome/welcome-nav';
import FooterSection from '@/components/welcome/footer-section';

type CourseCategory = {
    id: number;
    name: string;
};

type CourseItem = {
    id: number;
    title: string;
    slug: string;
    thumbnail: string;
    description: string;
    mentor_name: string | null;
    categories: CourseCategory[];
};

type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

type CoursePagination = {
    data: CourseItem[];
    links: PaginationLink[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
};

type Props = {
    canRegister: boolean;
    filters: {
        search: string;
    };
    courses: CoursePagination;
};

export default function CoursePage({ canRegister, filters, courses }: Props) {
    const { auth } = usePage().props as { auth: { user: any } };
    const [selectedMentor, setSelectedMentor] = useState('all');
    const [selectedCategory, setSelectedCategory] = useState('all');

    const categoryOptions = useMemo(() => {
        const map = new Map<number, string>();

        courses.data.forEach((course) => {
            course.categories.forEach((category) => {
                map.set(category.id, category.name);
            });
        });

        return Array.from(map.entries())
            .map(([id, name]) => ({ id, name }))
            .sort((a, b) => a.name.localeCompare(b.name));
    }, [courses.data]);

    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

    const filteredCourses = useMemo(() => {
        return courses.data.filter((course) => {
            const mentorMatch =
                selectedMentor === 'all' ||
                course.mentor_name === selectedMentor;

            const categoryMatch =
                selectedCategory === 'all' ||
                course.categories.some(
                    (category) => String(category.id) === selectedCategory,
                );

            return mentorMatch && categoryMatch;
        });
    }, [courses.data, selectedCategory, selectedMentor]);


    return (
        <div className="flex min-h-screen flex-col bg-slate-100 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
            <Head title="Courses" />
            <WelcomeNav auth={auth} canRegister={canRegister} />
            <main className="mx-auto max-w-7xl flex-grow px-4 pt-28 pb-16 md:px-8">
                <section className="grid gap-6 lg:grid-cols-[280px_1fr]">
                    <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-base font-semibold">
                                Category
                            </h2>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <div className="flex max-h-40 flex-col gap-2 overflow-y-auto">
                                    {categoryOptions.map((category) => (
                                        <label
                                            key={category.id}
                                            className="inline-flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200"
                                        >
                                            <input
                                                type="checkbox"
                                                value={String(category.id)}
                                                checked={selectedCategories.includes(
                                                    String(category.id),
                                                )}
                                                onChange={(e) => {
                                                    const value =
                                                        e.target.value;
                                                    setSelectedCategories(
                                                        (prev) =>
                                                            prev.includes(value)
                                                                ? prev.filter(
                                                                      (v) =>
                                                                          v !==
                                                                          value,
                                                                  )
                                                                : [
                                                                      ...prev,
                                                                      value,
                                                                  ],
                                                    );
                                                }}
                                                className="h-4 w-4 rounded border-slate-300 dark:border-slate-700"
                                            />
                                            {category.name}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </aside>

                    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                        {filteredCourses.map((course) => {
                            const thumbnailUrl = course.thumbnail?.startsWith(
                                'http',
                            )
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

                                    <div className="mb-3 flex flex-wrap gap-2">
                                        {course.categories.length > 0 ? (
                                            course.categories.map(
                                                (category) => (
                                                    <span
                                                        key={category.id}
                                                        className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                                                    >
                                                        {category.name}
                                                    </span>
                                                ),
                                            )
                                        ) : (
                                            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                                Uncategorized
                                            </span>
                                        )}
                                    </div>

                                    <h2 className="line-clamp-2 text-lg font-bold text-slate-900 dark:text-white">
                                        {course.title}
                                    </h2>

                                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                                        By{' '}
                                        {course.mentor_name ?? 'Unknown Mentor'}
                                    </p>

                                    <p className="mt-3 line-clamp-2 text-sm text-slate-600 dark:text-slate-300">
                                        {course.description}
                                    </p>
                                </article>
                            );
                        })}
                    </div>
                </section>
            </main>
            <FooterSection />
        </div>
    );
}
