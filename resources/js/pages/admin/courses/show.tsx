import AdminLayout from '@/layouts/admin-layout';
import { useEffect, useState } from 'react';
import { useForm, usePage, router } from '@inertiajs/react';
import type {
    CourseModule,
    CourseShowPageProps,
    CreateCourseModuleForm,
} from '@/types/course-modules';
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
import { CreateModuleDialog } from '@/components/admin/create-module-dialog';

export default function Show() {
    const { course } = usePage<CourseShowPageProps>().props;
    const [modules, setModules] = useState<CourseModule[]>(
        course.modules ?? [],
    );
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    useEffect(() => {
        setModules(course.modules ?? []);
    }, [course.modules]);

    const {
        data: createData,
        setData: setCreateData,
        post: createPost,
        processing: creating,
        errors: createErrors,
        reset: resetCreate,
        clearErrors: clearCreateErrors,
    } = useForm<CreateCourseModuleForm>({
        course_id: course.id,
        title: '',
        description: '',
        video: '',
        duration: '',
        is_preview: false,
        thumbnail: null,
        attachment: null,
        attachment_name: '',
        attachments: [],
        assignments: [
            {
                title: '',
                description: '',
                type: '',
            },
        ],

        from: 'course-show',
    });

    const closeCreateModal = () => {
        setIsCreateOpen(false);
        resetCreate();
        clearCreateErrors();
        setCreateData('course_id', course.id);
        setCreateData('from', 'course-show');
    };

    const addCreateAssignment = () => {
        setCreateData('assignments', [
            ...createData.assignments,
            { title: '', description: '', type: '' },
        ]);
    };

    const removeCreateAssignment = (index: number) => {
        setCreateData(
            'assignments',
            createData.assignments.filter((_, i) => i !== index),
        );
    };

    const updateCreateAssignment = (
        index: number,
        field: 'title' | 'description' | 'type',
        value: string,
    ) => {
        setCreateData(
            'assignments',
            createData.assignments.map((assignment, i) =>
                i === index ? { ...assignment, [field]: value } : assignment,
            ),
        );
    };

    const addCreateAttachment = () => {
        setCreateData('attachments', [...createData.attachments, null]);
    };

    const removeCreateAttachment = (index: number) => {
        setCreateData(
            'attachments',
            createData.attachments.filter((_, i) => i !== index),
        );
    };

    const updateCreateAttachment = (index: number, file: File | null) => {
        setCreateData(
            'attachments',
            createData.attachments.map((f, i) => (i === index ? file : f)),
        );
    };

    const submitCreate = (e: React.FormEvent) => {
        e.preventDefault();
        createPost('/admin/modules', {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => {
                closeCreateModal();
            },
        });
    };

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

                        <Button onClick={() => setIsCreateOpen(true)}>
                            <Plus className="mr-2 h-4 w-4" />
                            Tambah Modul
                        </Button>
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
                                getEditHref={(m) => edit.url(m.id)}
                                onDelete={handleDelete}
                                onDragEnd={handleDragEnd}
                            />
                        ) : (
                            <div className="rounded-xl border border-dashed p-10 text-center">
                                <p className="text-sm text-slate-500">
                                    Belum ada modul untuk course ini.
                                </p>
                                <Button
                                    className="mt-4"
                                    onClick={() => setIsCreateOpen(true)}
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Tambah Modul Pertama
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <CreateModuleDialog
                    open={isCreateOpen}
                    onOpenChange={setIsCreateOpen}
                    data={createData}
                    onDataChange={setCreateData}
                    errors={createErrors}
                    processing={creating}
                    onAddAssignment={addCreateAssignment}
                    onRemoveAssignment={removeCreateAssignment}
                    onUpdateAssignment={updateCreateAssignment}
                    onAddAttachment={addCreateAttachment}
                    onRemoveAttachment={removeCreateAttachment}
                    onUpdateAttachment={updateCreateAttachment}
                    onSubmit={submitCreate}
                    onClose={closeCreateModal}
                />
            </div>
        </AdminLayout>
    );
}
