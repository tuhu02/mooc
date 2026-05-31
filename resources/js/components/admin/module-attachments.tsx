import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Plus,
    RotateCcw,
    Trash2,
    ChevronDown,
    ChevronUp,
    Save,
    X,
} from 'lucide-react';
import { useState } from 'react';
import type { ModuleAttachmentsProps } from '@/types';

export function ModuleAttachments({
    prefix,
    attachmentFiles,
    existingAttachments,
    selectedModule,
    updatedAttachments = {},
    deletedAttachmentIds = [],
    expandedAttachmentId,
    onAddAttachment,
    onRemoveAttachment,
    onUpdateAttachment,
    onMarkExistingAttachmentForDelete,
    onUndoExistingAttachmentDelete,
    onUpdateExistingAttachmentName,
    onUpdateExistingAttachmentFile,
    onToggleExpandAttachment,
    errors,
}: ModuleAttachmentsProps) {
    const idPrefix = `${prefix}-`;

    const displayAttachments =
        existingAttachments && existingAttachments.length > 0
            ? existingAttachments
            : (selectedModule?.attachments ?? []);

    const formatFileSize = (size?: number | null) => {
        if (!size) {
            return null;
        }

        return `${(size / 1024 / 1024).toFixed(2)} MB`;
    };

    return (
        <div className="space-y-4">
            {prefix === 'edit' && displayAttachments.length > 0 && (
                <div className="rounded-lg border p-4">
                    <div className="mb-3 flex items-center justify-between">
                        <p className="text-sm font-semibold text-slate-700">
                            Attachment yang Ada
                        </p>
                    </div>

                    <div className="space-y-2">
                        {displayAttachments.map((attachment) => {
                            const isMarkedForDelete =
                                deletedAttachmentIds.includes(attachment.id);
                            const isExpanded =
                                expandedAttachmentId === attachment.id;
                            const editData = updatedAttachments[attachment.id];
                            const editName =
                                editData?.name ?? attachment.file_name;
                            const editFile = editData?.file;

                            return (
                                <div
                                    key={attachment.id}
                                    className={`rounded-lg border transition-all ${
                                        isMarkedForDelete
                                            ? 'border-red-200 bg-red-50'
                                            : 'border-slate-200 bg-gradient-to-r from-slate-50 to-white hover:border-slate-300 hover:shadow-sm'
                                    }`}
                                >
                                    <div className="flex items-center justify-between gap-3 p-3">
                                        <div className="min-w-0 flex-1">
                                            <p
                                                className={`truncate text-sm font-medium ${
                                                    isMarkedForDelete
                                                        ? 'text-red-700 line-through'
                                                        : 'text-slate-700'
                                                }`}
                                            >
                                                📎 {editName}
                                            </p>

                                            {formatFileSize(
                                                attachment.file_size,
                                            ) && (
                                                <p className="mt-0.5 text-xs text-slate-500">
                                                    {formatFileSize(
                                                        attachment.file_size,
                                                    )}
                                                </p>
                                            )}

                                            {isMarkedForDelete && (
                                                <p className="mt-1 text-xs font-medium text-red-600">
                                                    Attachment ini akan dihapus
                                                    saat disimpan.
                                                </p>
                                            )}
                                        </div>

                                        <div className="flex flex-shrink-0 gap-1">
                                            {!isMarkedForDelete && (
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    className="gap-1"
                                                    onClick={() =>
                                                        onToggleExpandAttachment?.(
                                                            isExpanded
                                                                ? null
                                                                : attachment.id,
                                                        )
                                                    }
                                                >
                                                    {isExpanded ? (
                                                        <ChevronUp className="h-4 w-4" />
                                                    ) : (
                                                        <ChevronDown className="h-4 w-4" />
                                                    )}
                                                    <span>Edit</span>
                                                </Button>
                                            )}

                                            {isMarkedForDelete ? (
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    className="flex-shrink-0 gap-1"
                                                    onClick={() =>
                                                        onUndoExistingAttachmentDelete?.(
                                                            attachment.id,
                                                        )
                                                    }
                                                >
                                                    <RotateCcw className="h-4 w-4" />
                                                    <span>Batal</span>
                                                </Button>
                                            ) : (
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    size="sm"
                                                    className="flex-shrink-0 gap-1"
                                                    onClick={() =>
                                                        onMarkExistingAttachmentForDelete?.(
                                                            attachment.id,
                                                        )
                                                    }
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                    <span>Hapus</span>
                                                </Button>
                                            )}
                                        </div>
                                    </div>

                                    {isExpanded && !isMarkedForDelete && (
                                        <div className="border-t border-slate-200 bg-slate-50 p-3">
                                            <div className="space-y-3">
                                                <div>
                                                    <Label
                                                        htmlFor={`edit-attachment-name-${attachment.id}`}
                                                        className="text-sm font-medium text-slate-700"
                                                    >
                                                        Nama Attachment
                                                    </Label>
                                                    <Input
                                                        id={`edit-attachment-name-${attachment.id}`}
                                                        type="text"
                                                        value={editName}
                                                        onChange={(e) =>
                                                            onUpdateExistingAttachmentName?.(
                                                                attachment.id,
                                                                e.target.value,
                                                            )
                                                        }
                                                        className="mt-2"
                                                        placeholder="Masukkan nama attachment"
                                                    />
                                                </div>

                                                <div>
                                                    <Label
                                                        htmlFor={`edit-attachment-file-${attachment.id}`}
                                                        className="text-sm font-medium text-slate-700"
                                                    >
                                                        Upload File Baru
                                                        (Opsional)
                                                    </Label>
                                                    <p className="mt-1 text-xs text-slate-500">
                                                        Biarkan kosong jika
                                                        tidak ingin mengganti
                                                        file
                                                    </p>
                                                    <Input
                                                        id={`edit-attachment-file-${attachment.id}`}
                                                        type="file"
                                                        onChange={(e) => {
                                                            const selectedFile =
                                                                e.target
                                                                    .files?.[0] ??
                                                                null;

                                                            onUpdateExistingAttachmentFile?.(
                                                                attachment.id,
                                                                selectedFile,
                                                            );
                                                        }}
                                                        className="mt-2"
                                                    />
                                                    {editFile && (
                                                        <p className="mt-2 text-xs text-slate-600">
                                                            File baru dipilih:{' '}
                                                            {editFile.name}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="mt-3 flex justify-end gap-2">
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() =>
                                                        onToggleExpandAttachment?.(
                                                            null,
                                                        )
                                                    }
                                                >
                                                    <X className="h-4 w-4" />
                                                    <span className="ml-1">
                                                        Tutup
                                                    </span>
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            <div className="rounded-lg border p-4">
                <div className="mb-3 flex items-center justify-between">
                    <p className="text-sm font-semibold text-slate-700">
                        {prefix === 'create'
                            ? 'Attachment'
                            : 'Tambah Attachment Baru'}
                    </p>

                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={onAddAttachment}
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Tambah Attachment
                    </Button>
                </div>

                <div className="space-y-4">
                    {attachmentFiles.length > 0 ? (
                        attachmentFiles.map((file, index) => (
                            <div key={index} className="rounded-lg border p-4">
                                <div className="mb-3 flex items-center justify-between">
                                    <p className="text-sm font-medium text-slate-700">
                                        Attachment {index + 1}
                                    </p>

                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="sm"
                                        onClick={() =>
                                            onRemoveAttachment(index)
                                        }
                                    >
                                        Hapus
                                    </Button>
                                </div>

                                <div className="grid gap-2">
                                    <Label
                                        htmlFor={`${idPrefix}attachments-${index}`}
                                    >
                                        File Attachment
                                    </Label>

                                    <Input
                                        id={`${idPrefix}attachments-${index}`}
                                        type="file"
                                        onChange={(e) => {
                                            const selectedFile =
                                                e.target.files?.[0] ?? null;

                                            onUpdateAttachment(
                                                index,
                                                selectedFile,
                                            );
                                        }}
                                    />

                                    {file && (
                                        <p className="text-xs text-slate-500">
                                            File dipilih: {file.name}
                                        </p>
                                    )}

                                    {errors[`attachments.${index}`] && (
                                        <p className="text-sm font-medium text-red-500">
                                            {errors[`attachments.${index}`]}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-sm text-slate-500">
                            Belum ada attachment. Klik tombol Tambah Attachment.
                        </p>
                    )}
                </div>

                {errors.attachments && (
                    <p className="mt-2 text-sm font-medium text-red-500">
                        {errors.attachments}
                    </p>
                )}

                <p className="mt-3 text-xs text-slate-500">
                    Admin bisa menambahkan lebih dari satu attachment. Maksimal
                    10MB per file.
                </p>
            </div>
        </div>
    );
}
