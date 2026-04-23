import AdminLayout from '@/layouts/admin-layout';
import { useEffect, useState } from 'react';
import { useForm, usePage, router } from '@inertiajs/react';
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
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import MDEditor from '@uiw/react-md-editor';
import { Pencil, Plus, Trash2, BookOpen, GripVertical } from 'lucide-react';
import {
    DndContext,
    PointerSensor,
    closestCenter,
    useSensor,
    useSensors,
    type DragEndEvent,
} from '@dnd-kit/core';
import {
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
    arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { destroy, store, update } from '@/routes/admin/modules';

type Module = {
    id: number;
    title: string;
    description?: string | null;
    video?: string | null;
    duration?: number | null;
    thumbnail?: string | null;
    attachment?: string | null;
    is_preview: boolean;
    sort_order: number;
    assignments?: {
        id: number;
        title: string;
        description?: string | null;
        type?: string | null;
    }[];
};

type Course = {
    id: number;
    title: string;
    description?: string;
    modules: Module[];
};

type CreateModuleForm = {
    course_id: number;
    title: string;
    description: string;
    video: string;
    is_preview: boolean;
    duration: string;
    thumbnail: File | null;
    attachment: File | null;
    assignment_title: string;
    assignment_instruction: string;
    assignment_type: string;
    from: 'course-show';
};

type EditModuleForm = {
    _method: 'PUT';
    course_id: number;
    title: string;
    description: string;
    video: string;
    duration: string;
    thumbnail: File | null;
    attachment: File | null;
    is_preview: boolean;
    assignment_title: string;
    assignment_instruction: string;
    assignment_type: string;
    from: 'course-show';
};

export default function Show() {
    const { course } = usePage<{ course: Course }>().props;
    const [modules, setModules] = useState<Module[]>(course.modules ?? []);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [selectedModule, setSelectedModule] = useState<Module | null>(null);
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 6,
            },
        }),
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
    } = useForm<CreateModuleForm>({
        course_id: course.id,
        title: '',
        description: '',
        video: '',
        duration: '',
        is_preview: false,
        thumbnail: null,
        attachment: null,
        assignment_title: '',
        assignment_instruction: '',
        assignment_type: '',
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
    } = useForm<EditModuleForm>({
        _method: 'PUT',
        course_id: course.id,
        title: '',
        description: '',
        video: '',
        duration: '',
        thumbnail: null,
        is_preview: false,
        attachment: null,
        assignment_title: '',
        assignment_instruction: '',
        assignment_type: '',
        from: 'course-show',
    });

    const closeCreateModal = () => {
        setIsCreateOpen(false);
        resetCreate();
        clearCreateErrors();
        setCreateData('course_id', course.id);
        setCreateData('from', 'course-show');
    };

    const openEditModal = (module: Module) => {
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
            assignment_title: assignment?.title ?? '',
            assignment_instruction: assignment?.description ?? '',
            assignment_type: assignment?.type ?? '',
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
                            <div className="overflow-hidden rounded-xl border">
                                <DndContext
                                    sensors={sensors}
                                    collisionDetection={closestCenter}
                                    onDragEnd={handleDragEnd}
                                >
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="w-20">
                                                    Urutan
                                                </TableHead>
                                                <TableHead>
                                                    Judul Modul
                                                </TableHead>
                                                <TableHead className="w-45 text-right">
                                                    Aksi
                                                </TableHead>
                                            </TableRow>
                                        </TableHeader>

                                        <TableBody>
                                            <SortableContext
                                                items={modules.map(
                                                    (module) => module.id,
                                                )}
                                                strategy={
                                                    verticalListSortingStrategy
                                                }
                                            >
                                                {modules.map((module) => (
                                                    <SortableModuleRow
                                                        key={module.id}
                                                        module={module}
                                                        onEdit={openEditModal}
                                                        onDelete={handleDelete}
                                                    />
                                                ))}
                                            </SortableContext>
                                        </TableBody>
                                    </Table>
                                </DndContext>
                            </div>
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

                {/* Modal Create */}
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
                                <p className="mb-3 text-sm font-semibold text-slate-700">
                                    Tugas / Assignment
                                </p>

                                <div className="grid gap-2">
                                    <Label htmlFor="create-assignment-title">
                                        Judul Tugas
                                    </Label>
                                    <Input
                                        id="create-assignment-title"
                                        value={createData.assignment_title}
                                        onChange={(e) =>
                                            setCreateData(
                                                'assignment_title',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Contoh: Tugas 1"
                                    />
                                    {createErrors.assignment_title && (
                                        <p className="text-sm font-medium text-red-500">
                                            {createErrors.assignment_title}
                                        </p>
                                    )}
                                </div>

                                <div
                                    className="mt-3 grid gap-2"
                                    data-color-mode="light"
                                >
                                    <Label htmlFor="create-assignment-instruction">
                                        Petunjuk
                                    </Label>
                                    <MDEditor
                                        value={
                                            createData.assignment_instruction
                                        }
                                        onChange={(value) =>
                                            setCreateData(
                                                'assignment_instruction',
                                                value ?? '',
                                            )
                                        }
                                        preview="edit"
                                        visibleDragbar={false}
                                        textareaProps={{
                                            id: 'create-assignment-instruction',
                                            placeholder:
                                                'Tulis petunjuk tugas dengan markdown...',
                                        }}
                                        height={220}
                                    />
                                    {createErrors.assignment_instruction && (
                                        <p className="text-sm font-medium text-red-500">
                                            {
                                                createErrors.assignment_instruction
                                            }
                                        </p>
                                    )}
                                </div>

                                <div className="mt-3 grid gap-2">
                                    <Label htmlFor="create-assignment-type">
                                        Jenis
                                    </Label>
                                    <Input
                                        id="create-assignment-type"
                                        value={createData.assignment_type}
                                        onChange={(e) =>
                                            setCreateData(
                                                'assignment_type',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Contoh: essay"
                                    />
                                    {createErrors.assignment_type && (
                                        <p className="text-sm font-medium text-red-500">
                                            {createErrors.assignment_type}
                                        </p>
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
                                <Input
                                    id="create-attachment"
                                    type="file"
                                    onChange={(e) =>
                                        setCreateData(
                                            'attachment',
                                            e.target.files?.[0] ?? null,
                                        )
                                    }
                                />
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

                {/* Modal Edit */}
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
                                <p className="mb-3 text-sm font-semibold text-slate-700">
                                    Tugas / Assignment
                                </p>

                                <div className="grid gap-2">
                                    <Label htmlFor="edit-assignment-title">
                                        Judul Tugas
                                    </Label>
                                    <Input
                                        id="edit-assignment-title"
                                        value={editData.assignment_title}
                                        onChange={(e) =>
                                            setEditData(
                                                'assignment_title',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Contoh: Tugas 1"
                                    />
                                    {editErrors.assignment_title && (
                                        <p className="text-sm font-medium text-red-500">
                                            {editErrors.assignment_title}
                                        </p>
                                    )}
                                </div>

                                <div
                                    className="mt-3 grid gap-2"
                                    data-color-mode="light"
                                >
                                    <Label htmlFor="edit-assignment-instruction">
                                        Petunjuk
                                    </Label>
                                    <MDEditor
                                        value={editData.assignment_instruction}
                                        onChange={(value) =>
                                            setEditData(
                                                'assignment_instruction',
                                                value ?? '',
                                            )
                                        }
                                        preview="edit"
                                        visibleDragbar={false}
                                        textareaProps={{
                                            id: 'edit-assignment-instruction',
                                            placeholder:
                                                'Tulis petunjuk tugas dengan markdown...',
                                        }}
                                        height={220}
                                    />
                                    {editErrors.assignment_instruction && (
                                        <p className="text-sm font-medium text-red-500">
                                            {editErrors.assignment_instruction}
                                        </p>
                                    )}
                                </div>

                                <div className="mt-3 grid gap-2">
                                    <Label htmlFor="edit-assignment-type">
                                        Jenis
                                    </Label>
                                    <Input
                                        id="edit-assignment-type"
                                        value={editData.assignment_type}
                                        onChange={(e) =>
                                            setEditData(
                                                'assignment_type',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Contoh: essay"
                                    />
                                    {editErrors.assignment_type && (
                                        <p className="text-sm font-medium text-red-500">
                                            {editErrors.assignment_type}
                                        </p>
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
                                <Input
                                    id="edit-attachment"
                                    type="file"
                                    onChange={(e) =>
                                        setEditData(
                                            'attachment',
                                            e.target.files?.[0] ?? null,
                                        )
                                    }
                                />
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

type SortableModuleRowProps = {
    module: Module;
    onEdit: (module: Module) => void;
    onDelete: (moduleId: number) => void;
};

function SortableModuleRow({
    module,
    onEdit,
    onDelete,
}: SortableModuleRowProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: module.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <TableRow
            ref={setNodeRef}
            style={style}
            className={isDragging ? 'bg-muted/40' : ''}
        >
            <TableCell className="font-medium">
                <button
                    type="button"
                    className="inline-flex items-center gap-2 text-slate-700"
                    {...attributes}
                    {...listeners}
                >
                    <GripVertical className="h-4 w-4 text-slate-400" />
                    {module.sort_order}
                </button>
            </TableCell>

            {/* ✅ Tambah badge Preview */}
            <TableCell>
                <div className="flex items-center gap-2">
                    {module.title}
                    {module.is_preview && (
                        <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                            Preview
                        </span>
                    )}
                </div>
            </TableCell>

            <TableCell>
                <div className="flex justify-end gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit(module)}
                    >
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                    </Button>

                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => onDelete(module.id)}
                    >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Hapus
                    </Button>
                </div>
            </TableCell>
        </TableRow>
    );
}
