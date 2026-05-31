import AdminLayout from '@/layouts/admin-layout';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { usePage, useForm, Link, router } from '@inertiajs/react';
import { Trash2, Pencil } from 'lucide-react';
import {
    index,
    create,
    edit,
    destroy as destroyRoute,
} from '@/routes/admin/courses';
import { CursorPagination, Course } from '@/types';
import { PaginationComponent } from '@/components/admin';
import { useState } from 'react';

export default function Page() {
    const { courses } = usePage<{ courses: CursorPagination<Course> }>().props;
    const { url } = usePage();

    // Get type from URL query parameter
    const searchParams = new URLSearchParams(url.split('?')[1] || '');
    const typeFromUrl = searchParams.get('type') || 'all';
    const [typeFilter, setTypeFilter] = useState<'all' | 'course' | 'event'>(
        (typeFromUrl === 'course' || typeFromUrl === 'event'
            ? typeFromUrl
            : 'all') as 'all' | 'course' | 'event',
    );

    const { delete: destroy, processing } = useForm();

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this course?')) {
            destroy(destroyRoute.url(id), {
                preserveScroll: true,
            });
        }
    };

    const handleFilterChange = (filter: 'all' | 'course' | 'event') => {
        setTypeFilter(filter);
        const url =
            filter === 'all' ? index.url() : `${index.url()}?type=${filter}`;
        router.visit(url);
    };

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
                                    <BreadcrumbLink href={index.url()}>
                                        Courses
                                    </BreadcrumbLink>
                                </BreadcrumbItem>

                                <BreadcrumbSeparator className="hidden md:block" />

                                <BreadcrumbItem>
                                    <BreadcrumbPage>All course</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </header>

                <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                    <div className="flex justify-between">
                        <h1 className="text-xl font-semibold">
                            Manajemen Kursus
                        </h1>

                        <Link href={create.url()}>
                            <Button className="w-auto">Tambah</Button>
                        </Link>
                    </div>

                    <div className="flex gap-2">
                        <Button
                            variant={
                                typeFilter === 'all' ? 'default' : 'outline'
                            }
                            onClick={() => handleFilterChange('all')}
                        >
                            Semua
                        </Button>
                        <Button
                            variant={
                                typeFilter === 'course' ? 'default' : 'outline'
                            }
                            onClick={() => handleFilterChange('course')}
                        >
                            Kursus
                        </Button>
                        <Button
                            variant={
                                typeFilter === 'event' ? 'default' : 'outline'
                            }
                            onClick={() => handleFilterChange('event')}
                        >
                            Event
                        </Button>
                    </div>

                    <Table>
                        <TableCaption>A list of Course</TableCaption>

                        <TableHeader>
                            <TableRow>
                                <TableHead>Thumbnail</TableHead>
                                <TableHead>Title</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Mentor</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Categories</TableHead>
                                <TableHead>Aksi</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {courses.data.map((course) => (
                                <TableRow
                                    key={course.id}
                                    className="cursor-pointer hover:bg-muted/50"
                                >
                                    <TableCell>
                                        {course.thumbnail ? (
                                            <img
                                                src={`/storage/${course.thumbnail}`}
                                                alt={course.title}
                                                className="h-12 w-20 rounded object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-12 w-20 items-center justify-center rounded bg-muted text-xs text-muted-foreground">
                                                No Image
                                            </div>
                                        )}
                                    </TableCell>

                                    <TableCell className="font-medium">
                                        {course.title}
                                    </TableCell>

                                    <TableCell>
                                        {course.type === 'event' ? (
                                            <span className="inline-flex rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700">
                                                Event
                                            </span>
                                        ) : (
                                            <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                                                Course
                                            </span>
                                        )}
                                    </TableCell>

                                    <TableCell>
                                        {course.mentor?.user?.name ?? '-'}
                                    </TableCell>

                                    <TableCell>
                                        {course.is_active ? (
                                            <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                                                Active
                                            </span>
                                        ) : (
                                            <span className="inline-flex rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                                                Not Active
                                            </span>
                                        )}
                                    </TableCell>

                                    <TableCell>
                                        {course.categories
                                            ?.map((category) => category.name)
                                            .join(', ') || '-'}
                                    </TableCell>

                                    <TableCell>
                                        <div className="flex gap-2">
                                            <Button
                                                asChild
                                                variant="secondary"
                                                size="sm"
                                            >
                                                <Link
                                                    href={`/admin/courses/${course.id}`}
                                                >
                                                    Modul
                                                </Link>
                                            </Button>

                                            <Button
                                                asChild
                                                variant="outline"
                                                size="sm"
                                                disabled={processing}
                                            >
                                                <Link
                                                    href={edit.url(course.id)}
                                                >
                                                    <Pencil className="mr-2 h-4 w-4" />
                                                    Edit
                                                </Link>
                                            </Button>

                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                disabled={processing}
                                                onClick={() =>
                                                    handleDelete(course.id)
                                                }
                                            >
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                Delete
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    <PaginationComponent pagination={courses} />

                    <div className="min-h-screen flex-1 rounded-xl bg-muted/50 md:min-h-min" />
                </div>
            </SidebarInset>
        </AdminLayout>
    );
}
