import { BreadcrumbItem, Category, Course, CursorPagination } from '@/types';
import AppLayout from '@/layouts/member-layout';
import { Head, Link } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { PaginationComponent } from '@/components/member/pagination-component';
import member from '@/routes/member';
import { BookOpen, Users } from 'lucide-react';

import {
    Card,
    CardAction,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

import { useState } from 'react';
import { router } from '@inertiajs/react';

type Props = {
    courses: CursorPagination<Course>;
    categories: Category[];
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Course',
        href: '',
    },
];

export default function search({ courses, categories }: Props) {
    const levelLabel: Record<'Beginner' | 'Intermediate' | 'Advanced', string> =
        {
            Beginner: 'Pemula',
            Intermediate: 'Menengah',
            Advanced: 'Mahir',
        };

    const [level, setLevel] = useState(() => {
        return new URLSearchParams(window.location.search).get('level') ?? '';
    });
    const [topic, setTopic] = useState(() => {
        return (
            new URLSearchParams(window.location.search).get('category_id') ?? ''
        );
    });

    const applyFilter = (newLevel: string, newTopic: string) => {
        router.get(
            member.courses.index.url({
                query: {
                    ...(newLevel ? { level: newLevel } : {}),
                    ...(newTopic ? { category_id: newTopic } : {}),
                },
            }),
            {},
            {
                preserveState: true,
                replace: true,
                only: ['courses'],
            },
        );
    };

    const handleLevelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        setLevel(value);

        applyFilter(value, topic);
    };

    const handleTopicChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        setTopic(value);

        applyFilter(level, value);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Course" />

            <div className="flex flex-1 flex-col gap-6 overflow-x-hidden p-4 md:p-8">
                <section className="relative left-1/2 -mt-4 flex h-64 w-screen -translate-x-1/2 items-center justify-center overflow-hidden bg-white md:-mt-8">
                    <div
                        className="absolute inset-0 z-0 opacity-10"
                        style={{
                            backgroundImage: `linear-gradient(#0ea5e9 1.5px, transparent 1.5px), linear-gradient(90deg, #0ea5e9 1.5px, transparent 1.5px)`,
                            backgroundSize: '40px 40px',
                        }}
                    ></div>

                    <div className="relative z-10 flex flex-col items-center gap-6 px-4 text-center">
                        <h1 className="max-w-2xl text-xl leading-relaxed font-bold text-slate-800">
                            Kembangkan keahlianmu dengan kursus online dari
                            tingkat pemula hingga profesional, dirancang khusus
                            untuk memenuhi standar industri global.
                        </h1>
                    </div>
                </section>

                <section className="mb-5 flex scroll-mt-20 flex-col gap-4 md:flex-row md:items-end">
                    <div className="flex-1">
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Tingkat
                        </label>
                        <select
                            value={level}
                            onChange={handleLevelChange}
                            className="w-full rounded-md border border-gray-300 p-2.5 text-sm focus:border-blue-500 focus:ring-blue-500"
                        >
                            <option value="">Semua Tingkat</option>
                            <option value="Beginner">Pemula</option>
                            <option value="Intermediate">Menengah</option>
                            <option value="Advanced">Mahir</option>
                        </select>
                    </div>

                    <div className="flex-1">
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Topik
                        </label>
                        <select
                            value={topic}
                            onChange={handleTopicChange}
                            className="w-full rounded-md border border-gray-300 p-2.5 text-sm focus:border-blue-500 focus:ring-blue-500"
                        >
                            <option value="">Semua Topik</option>
                            {categories.map((category) => (
                                <option
                                    key={category.id}
                                    value={String(category.id)}
                                >
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex-1">
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Tipe Kelas
                        </label>
                        <select className="w-full rounded-md border border-gray-300 p-2.5 text-sm focus:border-blue-500 focus:ring-blue-500">
                            <option>Semua Kelas</option>
                            <option>Gratis</option>
                            <option>Langganan</option>
                        </select>
                    </div>
                </section>

                <div className="grid grid-cols-3 gap-6">
                    {courses.data.map((item) => (
                        <Link
                            href={`/member/courses/${item.slug}`}
                            key={item.id}
                        >
                            <Card className="relative mx-auto w-full max-w-sm pt-0 transition hover:-translate-y-1 hover:shadow-lg">
                                <div className="absolute inset-0 z-30 aspect-video bg-black/35" />
                                <img
                                    src={
                                        item.thumbnail
                                            ? `/storage/${item.thumbnail}`
                                            : 'https://avatar.vercel.sh/shadcn1'
                                    }
                                    alt={item.title}
                                    className="relative z-20 aspect-video w-full object-cover"
                                />
                                <CardHeader>
                                    <CardAction className="flex items-center gap-2">
                                        {item.level && (
                                            <Badge
                                                variant="outline"
                                                className="px-3 py-1 text-base"
                                            >
                                                {levelLabel[item.level]}
                                            </Badge>
                                        )}
                                    </CardAction>
                                    <div className="flex flex-wrap gap-1.5">
                                        {item.categories &&
                                        item.categories.length > 0 ? (
                                            <>
                                                {item.categories
                                                    .slice(0, 2)
                                                    .map((category) => (
                                                        <Badge
                                                            key={category.id}
                                                            variant="secondary"
                                                            className="px-3 py-1 text-base"
                                                        >
                                                            {category.name}
                                                        </Badge>
                                                    ))}
                                                {item.categories.length > 2 && (
                                                    <Badge
                                                        variant="secondary"
                                                        className="px-3 py-1 text-base"
                                                    >
                                                        +
                                                        {item.categories
                                                            .length - 2}
                                                    </Badge>
                                                )}
                                            </>
                                        ) : (
                                            <span className="tracking-wide text-slate-500 uppercase">
                                                Tanpa Topik
                                            </span>
                                        )}
                                    </div>
                                    <CardTitle>{item.title}</CardTitle>
                                    <CardDescription className="line-clamp-2">
                                        {item.description}
                                    </CardDescription>
                                </CardHeader>
                                <div className="flex items-center gap-2 px-6 pb-4 text-sm text-slate-600">
                                    <BookOpen className="h-4 w-4" />
                                    <span>{item.modules_count ?? 0} Modul</span>
                                    <span className="text-slate-300">|</span>
                                    <Users className="h-4 w-4" />
                                    <span>{item.members_count ?? 0} Join</span>
                                </div>
                            </Card>
                        </Link>
                    ))}
                </div>

                <div className="mt-6">
                    <PaginationComponent pagination={courses} />
                </div>
            </div>
        </AppLayout>
    );
}
