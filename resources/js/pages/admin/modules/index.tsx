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
import { Trash2, Pencil, GripVertical } from 'lucide-react';
import { Course, CursorPagination, Module } from '@/types';
import { PaginationComponent } from '@/components/admin';
import { useState } from 'react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function SortableRow({
    module,
    filters,
    processing,
    onDelete,
    showOrder,
}: {
    module: Module;
    filters: { course_id?: string };
    processing: boolean;
    onDelete: (id: number) => void;
    showOrder: boolean;
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: module.id });

    return (
        <TableRow
            ref={setNodeRef}
            style={{
                transform: CSS.Transform.toString(transform),
                transition,
                opacity: isDragging ? 0.5 : 1,
            }}
        >
            {showOrder ? (
                <TableCell>
                    <div className="flex items-center gap-2">
                        <button
                            {...attributes}
                            {...listeners}
                            className="cursor-grab touch-none text-muted-foreground hover:text-foreground active:cursor-grabbing"
                        >
                            <GripVertical className="h-4 w-4" />
                        </button>
                        {module.sort_order ?? '-'}
                    </div>
                </TableCell>
            ) : null}
            <TableCell>
                {module.thumbnail ? (
                    <img
                        src={`/storage/${module.thumbnail}`}
                        alt={module.title}
                        className="h-12 w-20 rounded object-cover"
                    />
                ) : (
                    <div className="flex h-12 w-20 items-center justify-center rounded bg-gray-200 text-xs">
                        No image
                    </div>
                )}
            </TableCell>
            <TableCell>{module.title}</TableCell>
            <TableCell>{module.course?.title ?? '-'}</TableCell>
            <TableCell>
                {module.video ? (
                    <a
                        href={module.video}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 underline"
                    >
                        Buka video
                    </a>
                ) : (
                    '-'
                )}
            </TableCell>
            <TableCell>
                {module.duration ? `${module.duration} min` : '-'}
            </TableCell>
            <TableCell>
                <div className="flex gap-2">
                    <Button
                        asChild
                        variant="outline"
                        size="sm"
                        disabled={processing}
                    >
                        <Link
                            href={`/admin/modules/${module.id}/edit${filters.course_id ? `?course_id=${filters.course_id}` : ''}`}
                        >
                            <Pencil className="mr-2 h-4 w-4" /> Edit
                        </Link>
                    </Button>
                    <Button
                        variant="destructive"
                        size="sm"
                        disabled={processing}
                        onClick={() => onDelete(module.id)}
                    >
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </Button>
                </div>
            </TableCell>
        </TableRow>
    );
}

export default function Page() {
    const { modules, courses, filters } = usePage<{
        modules: CursorPagination<Module>;
        courses: Pick<Course, 'id' | 'title'>[];
        filters: { course_id?: string };
    }>().props;

    const { delete: destroy, processing } = useForm();
    const [items, setItems] = useState<Module[]>(modules.data);
    const [isSaving, setIsSaving] = useState(false);

    const isFiltered = !!filters.course_id;

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        }),
    );

    const handleDragEnd = (event: DragEndEvent) => {
        if (!isFiltered) return;

        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = items.findIndex((m) => m.id === active.id);
        const newIndex = items.findIndex((m) => m.id === over.id);
        const newItems = arrayMove(items, oldIndex, newIndex);

        setItems(newItems);

        setIsSaving(true);
        router.patch(
            '/admin/modules/reorder',
            {
                items: newItems.map((m, index) => ({
                    id: m.id,
                    sort_order: index + 1,
                })),
            },
            {
                preserveScroll: true,
                preserveState: true,
                onFinish: () => setIsSaving(false),
                onError: () => {
                    setItems(items);
                    setIsSaving(false);
                },
            },
        );
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this module?')) {
            destroy(`/admin/modules/${id}`, { preserveScroll: true });
        }
    };

    const handleCourseFilter = (courseId: string) => {
        router.get(
            '/admin/modules',
            { course_id: courseId || undefined },
            { preserveState: true, preserveScroll: true, replace: true },
        );
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
                                    <BreadcrumbLink href="/admin/modules">
                                        Modules
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator className="hidden md:block" />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>All modules</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </header>

                <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                    <div className="flex flex-wrap items-end justify-between gap-3">
                        <div className="flex items-center gap-3">
                            <h1 className="text-xl font-semibold">
                                Manage Modules
                            </h1>
                            {isSaving && (
                                <span className="animate-pulse text-sm text-muted-foreground">
                                    Menyimpan urutan...
                                </span>
                            )}
                        </div>
                        <div className="flex w-full flex-wrap items-end gap-2 md:w-auto">
                            <div className="min-w-60">
                                <label
                                    htmlFor="course-filter"
                                    className="mb-1 block text-sm font-medium text-muted-foreground"
                                >
                                    Filter Kursus
                                </label>
                                <select
                                    id="course-filter"
                                    value={filters.course_id ?? ''}
                                    onChange={(e) =>
                                        handleCourseFilter(e.target.value)
                                    }
                                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                                >
                                    <option value="">Semua kursus</option>
                                    {courses.map((course) => (
                                        <option
                                            key={course.id}
                                            value={String(course.id)}
                                        >
                                            {course.title}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <Link href="/admin/modules/create">
                                <Button className="w-auto">Tambah</Button>
                            </Link>
                        </div>
                    </div>

                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <Table>
                            <TableCaption>A list of Modules</TableCaption>
                            <TableHeader>
                                <TableRow>
                                    {isFiltered ? (
                                        <TableHead>Urutan</TableHead>
                                    ) : null}
                                    <TableHead>Thumbnail</TableHead>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Course</TableHead>
                                    <TableHead>Video</TableHead>
                                    <TableHead>Duration</TableHead>
                                    <TableHead>Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <SortableContext
                                    items={items.map((m) => m.id)}
                                    strategy={verticalListSortingStrategy}
                                >
                                    {items.map((module) => (
                                        <SortableRow
                                            key={module.id}
                                            module={module}
                                            filters={filters}
                                            processing={processing}
                                            onDelete={handleDelete}
                                            showOrder={isFiltered}
                                        />
                                    ))}
                                </SortableContext>
                            </TableBody>
                        </Table>
                    </DndContext>

                    <PaginationComponent pagination={modules} />
                    <div className="min-h-screen flex-1 rounded-xl bg-muted/50 md:min-h-min" />
                </div>
            </SidebarInset>
        </AdminLayout>
    );
}
