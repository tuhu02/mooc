import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import type { CreateCourseModuleForm } from '@/types';
import { ModuleFormFields } from './module-form-fields';
import { ModuleAssignments } from './module-assignments';
import { ModuleAttachments } from './module-attachments';

interface CreateModuleDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    data: CreateCourseModuleForm;
    onDataChange: (key: keyof CreateCourseModuleForm, value: any) => void;
    errors: Record<string, string | undefined>;
    processing: boolean;
    courseType: string;
    onAddAssignment: () => void;
    onRemoveAssignment: (index: number) => void;
    onUpdateAssignment: (
        index: number,
        field: 'title' | 'description' | 'type',
        value: string,
    ) => void;
    onAddAttachment: () => void;
    onRemoveAttachment: (index: number) => void;
    onUpdateAttachment: (index: number, file: File | null) => void;
    onSubmit: (e: React.FormEvent) => void;
    onClose: () => void;
}

export function CreateModuleDialog({
    open,
    onOpenChange,
    data,
    onDataChange,
    errors,
    processing,
    courseType,
    onAddAssignment,
    onRemoveAssignment,
    onUpdateAssignment,
    onAddAttachment,
    onRemoveAttachment,
    onUpdateAttachment,
    onSubmit,
    onClose,
}: CreateModuleDialogProps) {
    return (
        <Dialog
            open={open}
            onOpenChange={(newOpen) => {
                if (!newOpen) {
                    onClose();
                    return;
                }

                onOpenChange(newOpen);
            }}
        >
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-4xl">
                <DialogHeader>
                    <DialogTitle>Tambah Modul</DialogTitle>
                    <DialogDescription>
                        Isi data modul baru untuk course ini.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={onSubmit} className="space-y-4">
                    <ModuleFormFields
                        prefix="create"
                        title={data.title}
                        video={data.video}
                        duration={data.duration}
                        description={data.description}
                        available_at={data.available_at}
                        courseType={courseType}
                        onTitleChange={(value) => onDataChange('title', value)}
                        onVideoChange={(value) => onDataChange('video', value)}
                        onDurationChange={(value) =>
                            onDataChange('duration', value)
                        }
                        onDescriptionChange={(value) =>
                            onDataChange('description', value)
                        }
                        onAvailableAtChange={(value) =>
                            onDataChange('available_at', value)
                        }
                        errors={{
                            title: errors.title,
                            video: errors.video,
                            duration: errors.duration,
                            description: errors.description,
                            available_at: errors.available_at,
                        }}
                    />

                    <ModuleAssignments
                        prefix="create"
                        assignments={data.assignments}
                        onAddAssignment={onAddAssignment}
                        onRemoveAssignment={onRemoveAssignment}
                        onUpdateAssignment={onUpdateAssignment}
                        errors={errors}
                    />

                    <div className="grid gap-2">
                        <Label htmlFor="create-thumbnail">Thumbnail</Label>
                        <Input
                            id="create-thumbnail"
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                                onDataChange(
                                    'thumbnail',
                                    e.target.files?.[0] ?? null,
                                )
                            }
                        />

                        {errors.thumbnail && (
                            <p className="text-sm font-medium text-red-500">
                                {errors.thumbnail}
                            </p>
                        )}
                    </div>

                    <ModuleAttachments
                        prefix="create"
                        attachmentFiles={data.attachments}
                        onAddAttachment={onAddAttachment}
                        onRemoveAttachment={onRemoveAttachment}
                        onUpdateAttachment={onUpdateAttachment}
                        errors={{
                            attachment: errors.attachment,
                            attachments: errors.attachments,
                        }}
                    />

                    <div className="flex items-center gap-3">
                        <input
                            id="create-is-preview"
                            type="checkbox"
                            checked={data.is_preview}
                            onChange={(e) =>
                                onDataChange('is_preview', e.target.checked)
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
                            onClick={onClose}
                            disabled={processing}
                        >
                            Batal
                        </Button>

                        <Button type="submit" disabled={processing}>
                            {processing ? 'Menyimpan...' : 'Simpan Modul'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
