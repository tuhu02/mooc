import { BreadcrumbItem, CursorPagination } from '@/types';
import AppLayout from '@/layouts/member-layout';
import { Head } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PaginationComponent } from '@/components/member/pagination-component';
import {
    Card,
    CardAction,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { useEffect, useRef } from 'react';

type Course = {
    id: number;
    title: string;
    thumbnail: string;
    description: string;
    slug: string;
    is_active: boolean;
    mentor_id: number;
};

type Props = {
    courses: CursorPagination<Course>;
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Course',
        href: '',
    },
];

export default function search({ courses }: Props) {
    const courseSectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        requestAnimationFrame(() => {
            courseSectionRef.current?.scrollIntoView({
                behavior: 'instant',
                block: 'start',
            });
        });
    }, [courses.data]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Course" />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-8">
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
                        <select className="w-full rounded-md border border-gray-300 p-2.5 text-sm focus:border-blue-500 focus:ring-blue-500">
                            <option>Semua Tingkat</option>
                            <option>Pemula</option>
                            <option>Menengah</option>
                            <option>Mahir</option>
                        </select>
                    </div>

                    <div className="flex-1">
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Topik
                        </label>
                        <select className="w-full rounded-md border border-gray-300 p-2.5 text-sm focus:border-blue-500 focus:ring-blue-500">
                            <option>Semua Topik</option>
                            <option>Web Development</option>
                            <option>Machine Learning</option>
                            <option>Data Science</option>
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

                <div className="grid grid-cols-3 gap-6" ref={courseSectionRef}>
                    {courses.data.map((item) => (
                        <Card
                            key={item.id}
                            className="relative mx-auto w-full max-w-sm pt-0"
                        >
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
                                <CardAction>
                                    <Badge variant="secondary">Featured</Badge>
                                </CardAction>
                                <CardTitle>{item.title}</CardTitle>
                                <CardDescription>
                                    {item.description}
                                </CardDescription>
                            </CardHeader>
                            <CardFooter>
                                <Button className="w-full">View Course</Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>

                <div className="mt-6">
                    <PaginationComponent pagination={courses} />
                </div>
            </div>
        </AppLayout>
    );
}
