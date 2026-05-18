import { BreadcrumbItem, Category, Course, CursorPagination } from '@/types';
import AppLayout from '@/layouts/member-layout';
import { Head, Link } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { PaginationComponent } from '@/components/member/pagination-component';

import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

type Props = {
    events: CursorPagination<Course>;
    categories: Category[];
};

export default function EventPage({ events }: Props) {
    return (
        <AppLayout>
            <Head title="Event" />
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
                            Temukan dan ikuti event live yang sedang berlangsung
                            atau akan datang untuk mengembangkan keahlianmu
                            secara interaktif.
                        </h1>
                    </div>
                </section>

                <div className="grid grid-cols-3 gap-6">
                    {events.data.map((item) => (
                        <Link
                            href={`/member/events/${item.slug}`}
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
                                <CardHeader className="gap-2">
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
                                                            className="px-3 py-1"
                                                        >
                                                            {category.name}
                                                        </Badge>
                                                    ))}
                                                {item.categories.length > 2 && (
                                                    <Badge
                                                        variant="secondary"
                                                        className="px-3 py-1"
                                                    >
                                                        +
                                                        {item.categories
                                                            .length - 2}{' '}
                                                        lainnya
                                                    </Badge>
                                                )}
                                            </>
                                        ) : null}
                                    </div>
                                    <CardTitle className="line-clamp-2 text-lg font-bold">
                                        {item.title}
                                    </CardTitle>
                                    <CardDescription className="line-clamp-2 min-h-[40px]">
                                        {item.description}
                                    </CardDescription>
                                </CardHeader>
                            </Card>
                        </Link>
                    ))}
                </div>
                <PaginationComponent pagination={events} />
            </div>
        </AppLayout>
    );
}
