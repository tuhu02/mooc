import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import type { CourseModule } from '@/types/course-modules';
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
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Pencil, Trash2, GripVertical } from 'lucide-react';

type CourseModulesTableProps = {
    modules: CourseModule[];
    onEdit: (module: CourseModule) => void;
    onDelete: (moduleId: number) => void;
    onDragEnd: (event: DragEndEvent) => void;
};

export function CourseModulesTable({
    modules,
    onEdit,
    onDelete,
    onDragEnd,
}: CourseModulesTableProps) {
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 6,
            },
        }),
    );

    return (
        <div className="overflow-hidden rounded-md border">
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={onDragEnd}
            >
                <Table>
                    <TableCaption>
                        A list of modules for this course.
                    </TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-20">Urutan</TableHead>
                            <TableHead>Judul Modul</TableHead>
                            <TableHead className="w-45 text-right">
                                Aksi
                            </TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        <SortableContext
                            items={modules.map((module) => module.id)}
                            strategy={verticalListSortingStrategy}
                        >
                            {modules.map((module) => (
                                <SortableModuleRow
                                    key={module.id}
                                    module={module}
                                    onEdit={onEdit}
                                    onDelete={onDelete}
                                />
                            ))}
                        </SortableContext>
                    </TableBody>
                </Table>
            </DndContext>
        </div>
    );
}

type SortableModuleRowProps = {
    module: CourseModule;
    onEdit: (module: CourseModule) => void;
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
            className={cn('hover:bg-muted/50', isDragging && 'bg-muted/40')}
        >
            <TableCell className="font-medium">
                <button
                    type="button"
                    className="inline-flex cursor-grab items-center gap-2 text-slate-700 active:cursor-grabbing"
                    {...attributes}
                    {...listeners}
                >
                    <GripVertical className="h-4 w-4 text-slate-400" />
                    {module.sort_order}
                </button>
            </TableCell>

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
