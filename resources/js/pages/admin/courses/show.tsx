import AdminLayout from '@/layouts/admin-layout';
import { useEffect, useState } from 'react';
import { router, usePage, Link } from '@inertiajs/react';
import type { CourseModule, CourseShowPageProps } from '@/types/course-modules';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/components/ui/card';
import { Plus, BookOpen } from 'lucide-react';
import { type DragEndEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { destroy, edit } from '@/routes/admin/modules';
import { CourseModulesTable } from '@/components/admin/course-modules-table';

export default function Show() {
    const { course } = usePage<CourseShowPageProps>().props;
    const [modules, setModules] = useState<CourseModule[]>(
        course.modules ?? [],
    );

    useEffect(() => {
        setModules(course.modules ?? []);
    }, [course.modules]);

    const handleDelete = (moduleId: number) => {
        if (confirm('Yakin ingin menghapus modul ini?')) {
            router.delete(
                destroy.url(moduleId, { query: { from: 'course-show' } }),
                {
                    preserveScroll: true,
                },
            );
        }
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (!over || active.id === over.id) {
            return;
        }

        const oldIndex = modules.findIndex((module) => module.id === active.id);
        const newIndex = modules.findIndex((module) => module.id === over.id);

        if (oldIndex < 0 || newIndex < 0) {
            return;
        }

        const previousModules = modules;
        const reorderedModules = arrayMove(modules, oldIndex, newIndex).map(
            (module, index) => ({
                ...module,
                sort_order: index + 1,
            }),
        );

        setModules(reorderedModules);

        router.post(
            '/admin/modules/reorder',
            {
                course_id: course.id,
                module_ids: reorderedModules.map((module) => module.id),
                from: 'course-show',
            },
            {
                preserveScroll: true,
                preserveState: true,
                onError: () => {
                    setModules(previousModules);
                },
            },
        );
    };

    return (
        <AdminLayout>
            <div className="space-y-6 p-6">
                <Card>
                    <CardHeader className="flex flex-row items-start justify-between space-y-0">
                        <div className="space-y-1">
                            <CardTitle className="text-2xl">
                                {course.title}
                            </CardTitle>
                            <CardDescription>
                                {course.description ||
                                    'Tidak ada deskripsi course.'}
                            </CardDescription>
                        </div>

                        <Link href={`/admin/modules/${course.id}/create`}>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                Tambah Modul
                            </Button>
                        </Link>
                    </CardHeader>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BookOpen className="h-5 w-5" />
                            Daftar Modul
                        </CardTitle>
                        <CardDescription>
                            Kelola modul untuk course ini.
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        {modules?.length > 0 ? (
                            <CourseModulesTable
                                modules={modules}
                                courseType={course.type}
                                getEditHref={(m) => edit.url(m.id)}
                                onDelete={handleDelete}
                                onDragEnd={handleDragEnd}
                            />
                        ) : (
                            <div className="rounded-xl border border-dashed p-10 text-center">
                                <p className="text-sm text-slate-500">
                                    Belum ada modul untuk course ini.
                                </p>
                                <Link href={`/admin/courses/create`}>
                                    <Button className="mt-4">
                                        <Plus className="mr-2 h-4 w-4" />
                                        Tambah Modul Pertama
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <div className="min-h-screen flex-1 rounded-xl bg-muted/50 md:min-h-min" />
            </div>
        </AdminLayout>
    );
}
