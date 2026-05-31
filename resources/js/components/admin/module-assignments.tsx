import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import MDEditor from '@uiw/react-md-editor';
import { Plus } from 'lucide-react';
import type { ModuleAssignmentForm as AssignmentForm } from '@/types';

interface ModuleAssignmentsProps {
    prefix: 'create' | 'edit';
    assignments: AssignmentForm[];
    onAddAssignment: () => void;
    onRemoveAssignment: (index: number) => void;
    onUpdateAssignment: (
        index: number,
        field: 'title' | 'description' | 'type',
        value: string,
    ) => void;
    errors: Record<string, string | undefined>;
}

export function ModuleAssignments({
    prefix,
    assignments,
    onAddAssignment,
    onRemoveAssignment,
    onUpdateAssignment,
    errors,
}: ModuleAssignmentsProps) {
    return (
        <div className="rounded-lg border p-4">
            <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-700">Tugas</p>

                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={onAddAssignment}
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Tambah Tugas
                </Button>
            </div>

            <div className="space-y-4">
                {assignments.map((assignment, index) => (
                    <div
                        key={assignment.id ?? index}
                        className="rounded-lg border p-4"
                    >
                        <div className="mb-3 flex items-center justify-between">
                            <p className="text-sm font-medium text-slate-700">
                                Tugas {index + 1}
                            </p>

                            {assignments.length > 1 && (
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => onRemoveAssignment(index)}
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
                                    onUpdateAssignment(
                                        index,
                                        'title',
                                        e.target.value,
                                    )
                                }
                                placeholder="Contoh: Tugas 1"
                            />
                            {errors[`assignments.${index}.title`] && (
                                <p className="text-sm font-medium text-red-500">
                                    {errors[`assignments.${index}.title`]}
                                </p>
                            )}
                        </div>

                        <div
                            className="mt-3 grid gap-2"
                            data-color-mode="light"
                        >
                            <Label>Petunjuk</Label>
                            <MDEditor
                                value={assignment.description}
                                onChange={(value) =>
                                    onUpdateAssignment(
                                        index,
                                        'description',
                                        value ?? '',
                                    )
                                }
                                preview="edit"
                                visibleDragbar={false}
                                height={220}
                            />
                            {errors[`assignments.${index}.description`] && (
                                <p className="text-sm font-medium text-red-500">
                                    {errors[`assignments.${index}.description`]}
                                </p>
                            )}
                        </div>

                        <div className="mt-3 grid gap-2">
                            <Label>Jenis</Label>
                            <Select
                                value={assignment.type}
                                onValueChange={(value) =>
                                    onUpdateAssignment(index, 'type', value)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih jenis tugas" />
                                </SelectTrigger>

                                <SelectContent>
                                    <SelectItem value="essay">Essay</SelectItem>
                                    <SelectItem value="file">
                                        Upload File
                                    </SelectItem>
                                    <SelectItem value="quiz">Quiz</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors[`assignments.${index}.type`] && (
                                <p className="text-sm font-medium text-red-500">
                                    {errors[`assignments.${index}.type`]}
                                </p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
