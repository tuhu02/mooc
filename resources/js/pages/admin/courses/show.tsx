import AdminLayout from '@/layouts/admin-layout';
import { useEffect, useState } from 'react';
import { useForm, usePage, router } from '@inertiajs/react';
import type {
    CourseModule,
    CourseShowPageProps,
    CreateCourseModuleForm,
    EditCourseModuleForm,
} from '@/types/course-modules';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import MDEditor from '@uiw/react-md-editor';
import { Plus, BookOpen } from 'lucide-react';
import { type DragEndEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { destroy } from '@/routes/admin/modules';
import { CourseModulesTable } from '@/components/admin/course-modules-table';

export default function Show() {
    const { course } = usePage<CourseShowPageProps>().props;
    const [modules, setModules] = useState<CourseModule[]>(
        course.modules ?? [],
    );
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [selectedModule, setSelectedModule] = useState<CourseModule | null>(
        null,
    );

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
        // DIUBAH: dari single assignment menjadi array
        assignments: [
            {
                title: '',
                description: '',
                type: '',
            },
        ],

        from: 'course-show',
    });

    const {
        data: editData,
        setData: setEditData,
        post: editPost,
        processing: editing,
        errors: editErrors,
        reset: resetEdit,
        clearErrors: clearEditErrors,
    } = useForm<EditCourseModuleForm>({
        _method: 'PUT',
        course_id: course.id,
        title: '',
        description: '',
        video: '',
        duration: '',
        thumbnail: null,
        is_preview: false,
        attachment: null,
        attachment_name: '',
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

    const openEditModal = (module: CourseModule) => {
        const assignment = module.assignments?.[0];

        setSelectedModule(module);
        setEditData({
            _method: 'PUT',
            course_id: course.id,
            title: module.title ?? '',
            description: module.description ?? '',
            video: module.video ?? '',
            duration:
                module.duration !== null && module.duration !== undefined
                    ? String(module.duration)
                    : '',
            thumbnail: null,
            is_preview: module.is_preview ?? false,
            attachment: null,
            attachment_name: module.attachment_name ?? '',
            assignments:
                module.assignments && module.assignments.length > 0
                    ? module.assignments.map((assignment) => ({
                          id: assignment.id,
                          title: assignment.title ?? '',
                          description: assignment.description ?? '',
                          type: assignment.type ?? '',
                      }))
                    : [
                          {
                              title: '',
                              description: '',
                              type: '',
                          },
                      ],
            from: 'course-show',
        });
        clearEditErrors();
        setIsEditOpen(true);
    };

    const closeEditModal = () => {
        setIsEditOpen(false);
        setSelectedModule(null);
        resetEdit();
        clearEditErrors();
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

    const addEditAssignment = () => {
        setEditData('assignments', [
            ...editData.assignments,
            { title: '', description: '', type: '' },
        ]);
    };

    const removeEditAssignment = (index: number) => {
        setEditData(
            'assignments',
            editData.assignments.filter((_, i) => i !== index),
        );
    };

    const updateEditAssignment = (
        index: number,
        field: 'title' | 'description' | 'type',
        value: string,
    ) => {
        setEditData(
            'assignments',
            editData.assignments.map((assignment, i) =>
                i === index ? { ...assignment, [field]: value } : assignment,
            ),
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

    const submitEdit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedModule) {
            return;
        }

        editPost(`/admin/modules/${selectedModule.id}`, {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => {
                closeEditModal();
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
                                onEdit={openEditModal}
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

                {/* modal create */}
                <Dialog
                    open={isCreateOpen}
                    onOpenChange={(open) => {
                        if (!open) {
                            closeCreateModal();
                            return;
                        }
                        setIsCreateOpen(open);
                    }}
                >
                    <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-4xl">
                        <DialogHeader>
                            <DialogTitle>Tambah Modul</DialogTitle>
                            <DialogDescription>
                                Isi data modul baru untuk course ini.
                            </DialogDescription>
                        </DialogHeader>

                        <form onSubmit={submitCreate} className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="create-title">Judul</Label>
                                <Input
                                    id="create-title"
                                    value={createData.title}
                                    onChange={(e) =>
                                        setCreateData('title', e.target.value)
                                    }
                                    placeholder="Masukkan judul modul"
                                />
                                {createErrors.title && (
                                    <p className="text-sm font-medium text-red-500">
                                        {createErrors.title}
                                    </p>
                                )}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="create-video">Link Video</Label>
                                <Input
                                    id="create-video"
                                    type="url"
                                    value={createData.video}
                                    onChange={(e) =>
                                        setCreateData('video', e.target.value)
                                    }
                                    placeholder="https://..."
                                />
                                {createErrors.video && (
                                    <p className="text-sm font-medium text-red-500">
                                        {createErrors.video}
                                    </p>
                                )}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="create-duration">
                                    Durasi (menit)
                                </Label>
                                <Input
                                    id="create-duration"
                                    type="number"
                                    min={0}
                                    value={createData.duration}
                                    onChange={(e) =>
                                        setCreateData(
                                            'duration',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="Contoh: 30"
                                />
                                {createErrors.duration && (
                                    <p className="text-sm font-medium text-red-500">
                                        {createErrors.duration}
                                    </p>
                                )}
                            </div>

                            <div className="grid gap-2" data-color-mode="light">
                                <Label htmlFor="create-description">
                                    Deskripsi
                                </Label>
                                <MDEditor
                                    value={createData.description}
                                    onChange={(value) =>
                                        setCreateData(
                                            'description',
                                            value ?? '',
                                        )
                                    }
                                    preview="edit"
                                    visibleDragbar={false}
                                    textareaProps={{
                                        id: 'create-description',
                                        placeholder:
                                            'Tulis deskripsi dengan markdown...',
                                    }}
                                    height={280}
                                />
                                {createErrors.description && (
                                    <p className="text-sm font-medium text-red-500">
                                        {createErrors.description}
                                    </p>
                                )}
                            </div>

                            <div className="rounded-lg border p-4">
                                <div className="mb-3 flex items-center justify-between">
                                    <p className="text-sm font-semibold text-slate-700">
                                        Tugas
                                    </p>

                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={addCreateAssignment}
                                    >
                                        <Plus className="mr-2 h-4 w-4" />
                                        Tambah Tugas
                                    </Button>
                                </div>

                                <div className="space-y-4">
                                    {createData.assignments.map(
                                        (assignment, index) => (
                                            <div
                                                key={index}
                                                className="rounded-lg border p-4"
                                            >
                                                <div className="mb-3 flex items-center justify-between">
                                                    <p className="text-sm font-medium text-slate-700">
                                                        Tugas {index + 1}
                                                    </p>

                                                    {createData.assignments
                                                        .length > 1 && (
                                                        <Button
                                                            type="button"
                                                            variant="destructive"
                                                            size="sm"
                                                            onClick={() =>
                                                                removeCreateAssignment(
                                                                    index,
                                                                )
                                                            }
                                                        >
                                                            Hapus
                                                        </Button>
                                                    )}
                                                </div>

                                                <div className="grid gap-2">
                                                    <Label>Judul Tugas</Label>
                                                    <Input
                                                        value={assignment.title}
                                                        onChange={(e) =>
                                                            updateCreateAssignment(
                                                                index,
                                                                'title',
                                                                e.target.value,
                                                            )
                                                        }
                                                        placeholder="Contoh: Tugas 1"
                                                    />
                                                </div>

                                                <div
                                                    className="mt-3 grid gap-2"
                                                    data-color-mode="light"
                                                >
                                                    <Label>Petunjuk</Label>
                                                    <MDEditor
                                                        value={
                                                            assignment.description
                                                        }
                                                        onChange={(value) =>
                                                            updateCreateAssignment(
                                                                index,
                                                                'description',
                                                                value ?? '',
                                                            )
                                                        }
                                                        preview="edit"
                                                        visibleDragbar={false}
                                                        height={220}
                                                    />
                                                </div>

                                                <div className="mt-3 grid gap-2">
                                                    <Label>Jenis</Label>
                                                    <Select
                                                        value={assignment.type}
                                                        onValueChange={(
                                                            value,
                                                        ) =>
                                                            updateEditAssignment(
                                                                index,
                                                                'type',
                                                                value,
                                                            )
                                                        }
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Pilih jenis tugas" />
                                                        </SelectTrigger>

                                                        <SelectContent>
                                                            <SelectItem value="essay">
                                                                Essay
                                                            </SelectItem>
                                                            <SelectItem value="file">
                                                                Upload File
                                                            </SelectItem>
                                                            <SelectItem value="quiz">
                                                                Quiz
                                                            </SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>
                                        ),
                                    )}
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="create-thumbnail">
                                    Thumbnail
                                </Label>
                                <Input
                                    id="create-thumbnail"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) =>
                                        setCreateData(
                                            'thumbnail',
                                            e.target.files?.[0] ?? null,
                                        )
                                    }
                                />
                                {createErrors.thumbnail && (
                                    <p className="text-sm font-medium text-red-500">
                                        {createErrors.thumbnail}
                                    </p>
                                )}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="create-attachment">
                                    Attachment
                                </Label>
                                <div className="grid gap-2">
                                    <Label htmlFor="create-attachment">
                                        Attachment
                                    </Label>

                                    <Input
                                        id="create-attachment"
                                        type="file"
                                        onChange={(e) => {
                                            const file =
                                                e.target.files?.[0] ?? null;

                                            setCreateData('attachment', file);

                                            if (file) {
                                                setCreateData(
                                                    'attachment_name',
                                                    file.name,
                                                );
                                            }
                                        }}
                                    />

                                    <Input
                                        value={createData.attachment_name}
                                        onChange={(e) =>
                                            setCreateData(
                                                'attachment_name',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Nama attachment"
                                    />

                                    {createErrors.attachment && (
                                        <p className="text-sm font-medium text-red-500">
                                            {createErrors.attachment}
                                        </p>
                                    )}
                                </div>
                                {createErrors.attachment && (
                                    <p className="text-sm font-medium text-red-500">
                                        {createErrors.attachment}
                                    </p>
                                )}
                            </div>

                            <div className="flex items-center gap-3">
                                <input
                                    id="create-is-preview"
                                    type="checkbox"
                                    checked={createData.is_preview}
                                    onChange={(e) =>
                                        setCreateData(
                                            'is_preview',
                                            e.target.checked,
                                        )
                                    }
                                    className="h-4 w-4 rounded border-gray-300"
                                />
                                <Label htmlFor="create-is-preview">
                                    Jadikan modul ini sebagai preview
                                </Label>
                            </div>

                            <div className="flex justify-end gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={closeCreateModal}
                                    disabled={creating}
                                >
                                    Batal
                                </Button>
                                <Button type="submit" disabled={creating}>
                                    {creating ? 'Menyimpan...' : 'Simpan Modul'}
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* modal edit */}
                <Dialog
                    open={isEditOpen}
                    onOpenChange={(open) => {
                        if (!open) {
                            closeEditModal();
                            return;
                        }
                        setIsEditOpen(open);
                    }}
                >
                    <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-4xl">
                        <DialogHeader>
                            <DialogTitle>Edit Modul</DialogTitle>
                            <DialogDescription>
                                Ubah data modul yang dipilih.
                            </DialogDescription>
                        </DialogHeader>

                        <form onSubmit={submitEdit} className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="edit-title">Judul</Label>
                                <Input
                                    id="edit-title"
                                    value={editData.title}
                                    onChange={(e) =>
                                        setEditData('title', e.target.value)
                                    }
                                    placeholder="Masukkan judul modul"
                                />
                                {editErrors.title && (
                                    <p className="text-sm font-medium text-red-500">
                                        {editErrors.title}
                                    </p>
                                )}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="edit-video">Link Video</Label>
                                <Input
                                    id="edit-video"
                                    type="url"
                                    value={editData.video}
                                    onChange={(e) =>
                                        setEditData('video', e.target.value)
                                    }
                                    placeholder="https://..."
                                />
                                {editErrors.video && (
                                    <p className="text-sm font-medium text-red-500">
                                        {editErrors.video}
                                    </p>
                                )}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="edit-duration">
                                    Durasi (menit)
                                </Label>
                                <Input
                                    id="edit-duration"
                                    type="number"
                                    min={0}
                                    value={editData.duration}
                                    onChange={(e) =>
                                        setEditData('duration', e.target.value)
                                    }
                                    placeholder="Contoh: 30"
                                />
                                {editErrors.duration && (
                                    <p className="text-sm font-medium text-red-500">
                                        {editErrors.duration}
                                    </p>
                                )}
                            </div>

                            <div className="grid gap-2" data-color-mode="light">
                                <Label htmlFor="edit-description">
                                    Deskripsi
                                </Label>
                                <MDEditor
                                    value={editData.description}
                                    onChange={(value) =>
                                        setEditData('description', value ?? '')
                                    }
                                    preview="edit"
                                    visibleDragbar={false}
                                    textareaProps={{
                                        id: 'edit-description',
                                        placeholder:
                                            'Tulis deskripsi dengan markdown...',
                                    }}
                                    height={280}
                                />
                                {editErrors.description && (
                                    <p className="text-sm font-medium text-red-500">
                                        {editErrors.description}
                                    </p>
                                )}
                            </div>

                            <div className="rounded-lg border p-4">
                                <div className="mb-3 flex items-center justify-between">
                                    <p className="text-sm font-semibold text-slate-700">
                                        Tugas
                                    </p>

                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={addEditAssignment}
                                    >
                                        <Plus className="mr-2 h-4 w-4" />
                                        Tambah Tugas
                                    </Button>
                                </div>

                                <div className="space-y-4">
                                    {editData.assignments.map(
                                        (assignment, index) => (
                                            <div
                                                key={assignment.id ?? index}
                                                className="rounded-lg border p-4"
                                            >
                                                <div className="mb-3 flex items-center justify-between">
                                                    <p className="text-sm font-medium text-slate-700">
                                                        Tugas {index + 1}
                                                    </p>

                                                    {editData.assignments
                                                        .length > 1 && (
                                                        <Button
                                                            type="button"
                                                            variant="destructive"
                                                            size="sm"
                                                            onClick={() =>
                                                                removeEditAssignment(
                                                                    index,
                                                                )
                                                            }
                                                        >
                                                            Hapus
                                                        </Button>
                                                    )}
                                                </div>

                                                <div className="grid gap-2">
                                                    <Label>Judul Tugas</Label>
                                                    <Input
                                                        value={assignment.title}
                                                        onChange={(e) =>
                                                            updateEditAssignment(
                                                                index,
                                                                'title',
                                                                e.target.value,
                                                            )
                                                        }
                                                        placeholder="Contoh: Tugas 1"
                                                    />
                                                    {editErrors[
                                                        `assignments.${index}.title`
                                                    ] && (
                                                        <p className="text-sm font-medium text-red-500">
                                                            {
                                                                editErrors[
                                                                    `assignments.${index}.title`
                                                                ]
                                                            }
                                                        </p>
                                                    )}
                                                </div>

                                                <div
                                                    className="mt-3 grid gap-2"
                                                    data-color-mode="light"
                                                >
                                                    <Label>Petunjuk</Label>
                                                    <MDEditor
                                                        value={
                                                            assignment.description
                                                        }
                                                        onChange={(value) =>
                                                            updateEditAssignment(
                                                                index,
                                                                'description',
                                                                value ?? '',
                                                            )
                                                        }
                                                        preview="edit"
                                                        visibleDragbar={false}
                                                        height={220}
                                                    />
                                                    {editErrors[
                                                        `assignments.${index}.description`
                                                    ] && (
                                                        <p className="text-sm font-medium text-red-500">
                                                            {
                                                                editErrors[
                                                                    `assignments.${index}.description`
                                                                ]
                                                            }
                                                        </p>
                                                    )}
                                                </div>

                                                <div className="mt-3 grid gap-2">
                                                    <Label>Jenis</Label>
                                                    <Select
                                                        value={assignment.type}
                                                        onValueChange={(
                                                            value,
                                                        ) =>
                                                            updateEditAssignment(
                                                                index,
                                                                'type',
                                                                value,
                                                            )
                                                        }
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Pilih jenis tugas" />
                                                        </SelectTrigger>

                                                        <SelectContent>
                                                            <SelectItem value="essay">
                                                                Essay
                                                            </SelectItem>
                                                            <SelectItem value="file">
                                                                Upload File
                                                            </SelectItem>
                                                            <SelectItem value="quiz">
                                                                Quiz
                                                            </SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    {editErrors[
                                                        `assignments.${index}.type`
                                                    ] && (
                                                        <p className="text-sm font-medium text-red-500">
                                                            {
                                                                editErrors[
                                                                    `assignments.${index}.type`
                                                                ]
                                                            }
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        ),
                                    )}
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="edit-thumbnail">
                                    Thumbnail Baru
                                </Label>
                                <Input
                                    id="edit-thumbnail"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) =>
                                        setEditData(
                                            'thumbnail',
                                            e.target.files?.[0] ?? null,
                                        )
                                    }
                                />
                                {editErrors.thumbnail && (
                                    <p className="text-sm font-medium text-red-500">
                                        {editErrors.thumbnail}
                                    </p>
                                )}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="edit-attachment">
                                    Attachment Baru
                                </Label>
                                <div className="grid gap-2">
                                    <Label htmlFor="edit-attachment">
                                        Attachment Baru
                                    </Label>

                                    <Input
                                        id="edit-attachment"
                                        type="file"
                                        onChange={(e) => {
                                            const file =
                                                e.target.files?.[0] ?? null;

                                            setEditData('attachment', file);

                                            if (file) {
                                                setEditData(
                                                    'attachment_name',
                                                    file.name,
                                                );
                                            }
                                        }}
                                    />

                                    <Input
                                        value={editData.attachment_name}
                                        onChange={(e) =>
                                            setEditData(
                                                'attachment_name',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Nama attachment"
                                    />

                                    {editErrors.attachment && (
                                        <p className="text-sm font-medium text-red-500">
                                            {editErrors.attachment}
                                        </p>
                                    )}
                                </div>
                                {editErrors.attachment && (
                                    <p className="text-sm font-medium text-red-500">
                                        {editErrors.attachment}
                                    </p>
                                )}
                            </div>

                            <div className="flex items-center gap-3">
                                <input
                                    id="edit-is-preview"
                                    type="checkbox"
                                    checked={editData.is_preview}
                                    onChange={(e) =>
                                        setEditData(
                                            'is_preview',
                                            e.target.checked,
                                        )
                                    }
                                    className="h-4 w-4 rounded border-gray-300"
                                />
                                <Label htmlFor="edit-is-preview">
                                    Jadikan modul ini sebagai preview
                                </Label>
                            </div>

                            <div className="flex justify-end gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={closeEditModal}
                                    disabled={editing}
                                >
                                    Batal
                                </Button>
                                <Button type="submit" disabled={editing}>
                                    {editing ? 'Menyimpan...' : 'Update Modul'}
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </AdminLayout>
    );
}
