import AdminLayout from '@/layouts/admin-layout';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Users,
    BookOpen,
    Layers,
    Tag,
    TrendingUp,
    ArrowRight,
} from 'lucide-react';
import { Link } from '@inertiajs/react';
import type { Course, Module } from '@/types';

type Props = {
    stats: {
        total_users: number;
        total_members: number;
        total_mentors: number;
        total_courses: number;
        total_modules: number;
        total_categories: number;
    };
    recent_courses: (Course & {
        modules_count: number;
        members_count: number;
    })[];
    recent_modules: (Module & { course: Course })[];
    enrolled_members: { course_title: string; member_count: number }[];
};

export default function DashboardPage({
    stats,
    recent_courses,
    recent_modules,
    enrolled_members,
}: Props) {
    const statCards = [
        {
            title: 'Total Pengguna',
            value: stats.total_users,
            icon: Users,
            href: '#',
        },
        {
            title: 'Total Member',
            value: stats.total_members,
            icon: Users,
            href: '/admin/members',
        },
        {
            title: 'Total Mentor',
            value: stats.total_mentors,
            icon: Users,
            href: '/admin/mentors',
        },
        {
            title: 'Total Kursus',
            value: stats.total_courses,
            icon: BookOpen,
            href: '/admin/courses',
        },
        {
            title: 'Total Modul',
            value: stats.total_modules,
            icon: Layers,
            href: '/admin/modules',
        },
        {
            title: 'Total Kategori',
            value: stats.total_categories,
            icon: Tag,
            href: '/admin/categories',
        },
    ];

    return (
        <AdminLayout>
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
                    <div className="flex items-center gap-2 px-4">
                        <SidebarTrigger className="-ml-1" />
                        <Separator
                            orientation="vertical"
                            className="mr-2 data-[orientation=vertical]:h-4"
                        />
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem className="hidden md:block">
                                    <BreadcrumbLink href="/admin/dashboard">
                                        Dashboard
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </header>

                <div className="flex flex-1 flex-col gap-6 px-4 py-8 md:px-6">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Dashboard
                        </h1>
                        <p className="mt-1 text-base text-muted-foreground">
                            Selamat datang di panel admin. Lihat statistik dan
                            informasi penting sistem Anda di sini.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {statCards.map((stat) => {
                            const Icon = stat.icon;
                            return (
                                <Link
                                    key={stat.title}
                                    href={stat.href}
                                    className="no-underline"
                                >
                                    <Card className="h-full cursor-pointer transition-shadow hover:shadow-lg">
                                        <CardHeader className="pb-3">
                                            <div className="flex items-center justify-between">
                                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                                    {stat.title}
                                                </CardTitle>
                                                <div
                                                    className={
                                                        'rounded-lg bg-slate-900 p-2 text-white'
                                                    }
                                                >
                                                    <Icon className="h-4 w-4" />
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-2xl font-bold">
                                                {stat.value}
                                            </div>
                                            <p className="mt-2 text-xs text-muted-foreground">
                                                Lihat detail →
                                            </p>
                                        </CardContent>
                                    </Card>
                                </Link>
                            );
                        })}
                    </div>

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle>Kursus Terbaru</CardTitle>
                                    <Link href="/admin/courses">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 gap-1"
                                        >
                                            Lihat Semua
                                            <ArrowRight className="h-4 w-4" />
                                        </Button>
                                    </Link>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {recent_courses.length > 0 ? (
                                        recent_courses.map((course) => (
                                            <div
                                                key={course.id}
                                                className="flex items-start justify-between gap-4 border-b pb-3 last:border-b-0 last:pb-0"
                                            >
                                                <div className="flex-1">
                                                    <p className="line-clamp-2 text-sm font-medium">
                                                        {course.title}
                                                    </p>
                                                    <div className="mt-2 flex items-center gap-2">
                                                        <span className="text-xs text-muted-foreground">
                                                            {
                                                                course.modules_count
                                                            }{' '}
                                                            modul
                                                        </span>
                                                        <span className="text-xs text-muted-foreground">
                                                            •
                                                        </span>
                                                        <span className="text-xs text-muted-foreground">
                                                            {
                                                                course.members_count
                                                            }{' '}
                                                            member
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-sm text-muted-foreground">
                                            Belum ada kursus
                                        </p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Kursus Paling Populer</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {enrolled_members.length > 0 ? (
                                        enrolled_members.map((item, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center justify-between gap-4 border-b pb-3 last:border-b-0 last:pb-0"
                                            >
                                                <div className="flex-1">
                                                    <p className="line-clamp-2 text-sm font-medium">
                                                        {item.course_title}
                                                    </p>
                                                </div>
                                                <Badge
                                                    variant="secondary"
                                                    className="ml-auto shrink-0"
                                                >
                                                    {item.member_count} peserta
                                                </Badge>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-sm text-muted-foreground">
                                            Belum ada data
                                        </p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle>Modul Terbaru</CardTitle>
                                <Link href="/admin/modules">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 gap-1"
                                    >
                                        Lihat Semua
                                        <ArrowRight className="h-4 w-4" />
                                    </Button>
                                </Link>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {recent_modules.length > 0 ? (
                                    recent_modules.map((module) => (
                                        <div
                                            key={module.id}
                                            className="flex items-start justify-between gap-4 border-b pb-3 last:border-b-0 last:pb-0"
                                        >
                                            <div className="flex-1">
                                                <p className="line-clamp-2 text-sm font-medium">
                                                    {module.title}
                                                </p>
                                                <p className="mt-1 text-xs text-muted-foreground">
                                                    Kursus:{' '}
                                                    {module.course?.title ||
                                                        'Unknown'}
                                                </p>
                                            </div>
                                            {module.duration && (
                                                <span className="shrink-0 text-xs text-muted-foreground">
                                                    {module.duration} min
                                                </span>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-muted-foreground">
                                        Belum ada modul
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </SidebarInset>
        </AdminLayout>
    );
}
