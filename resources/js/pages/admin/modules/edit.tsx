import AdminLayout from '@/layouts/admin-layout';
import { useState, type FormEvent } from 'react';
import { Link, useForm, usePage } from '@inertiajs/react';
import type {
    AdminModuleEditPageProps,
    CourseModule,
    EditCourseModuleForm,
} from '@/types/course-modules';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
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
import { ModuleFormFields } from '@/components/admin/module-form-fields';
import { ModuleAssignments } from '@/components/admin/module-assignments';
import { ModuleAttachments } from '@/components/admin/module-attachments';
import { show as courseShow } from '@/routes/admin/courses';
import { update } from '@/routes/admin/modules';

function buildInitialForm(
    courseId: number,
    module: CourseModule,
): EditCourseModuleForm {
    return {
        _method: 'PUT',
        course_id: courseId,
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
        attachments: [],
        deleted_attachment_ids: [],
        updated_attachments: {},
        assignments:
            module.assignments && module.assignments.length > 0
                ? module.assignments.map((a) => ({
                      id: a.id,
                      title: a.title ?? '',
                      description: a.description ?? '',
                      type: a.type ?? '',
                  }))
                : [
                      {
                          title: '',
                          description: '',
                          type: '',
                      },
                  ],
        from: 'course-show',
    };
}

type ModuleEditFormProps = {
    module: CourseModule;
    course: AdminModuleEditPageProps['course'];
};

function ModuleEditForm({ module, course }: ModuleEditFormProps) {
    const [deletedAttachmentIds, setDeletedAttachmentIds] = useState<number[]>(
        [],
    );
    const [expandedAttachmentId, setExpandedAttachmentId] = useState<
        number | null
    >(null);

    const {
        data,
        setData,
        post,
        processing,
        errors,
    } = useForm<EditCourseModuleForm>(buildInitialForm(course.id, module));

    const addAssignment = () => {
        setData('assignments', [
            ...data.assignments,
            { title: '', description: '', type: '' },
        ]);
    };

    const removeAssignment = (index: number) => {
        setData(
            'assignments',
            data.assignments.filter((_, i) => i !== index),
        );
    };

    const updateAssignment = (
        index: number,
        field: 'title' | 'description' | 'type',
        value: string,
    ) => {
        setData(
            'assignments',
            data.assignments.map((assignment, i) =>
                i === index ? { ...assignment, [field]: value } : assignment,
            ),
        );
    };

    const addAttachment = () => {
        setData('attachments', [...data.attachments, null]);
    };

    const removeAttachment = (index: number) => {
        setData(
            'attachments',
            data.attachments.filter((_, i) => i !== index),
        );
    };

    const updateAttachment = (index: number, file: File | null) => {
        setData(
            'attachments',
            data.attachments.map((f, i) => (i === index ? file : f)),
        );
    };

    const markExistingAttachmentForDelete = (attachmentId: number) => {
        setDeletedAttachmentIds([...deletedAttachmentIds, attachmentId]);
        setData('deleted_attachment_ids', [
            ...data.deleted_attachment_ids,
            attachmentId,
        ]);
    };

    const undoExistingAttachmentDelete = (attachmentId: number) => {
        setDeletedAttachmentIds(
            deletedAttachmentIds.filter((id) => id !== attachmentId),
        );
        setData(
            'deleted_attachment_ids',
            data.deleted_attachment_ids.filter((id) => id !== attachmentId),
        );
    };

    const updateExistingAttachmentName = (
        attachmentId: number,
        newName: string,
    ) => {
        const updated = data.updated_attachments[attachmentId] || {};
        setData('updated_attachments', {
            ...data.updated_attachments,
            [attachmentId]: {
                ...updated,
                name: newName,
            },
        });
    };

    const updateExistingAttachmentFile = (
        attachmentId: number,
        file: File | null,
    ) => {
        const updated = data.updated_attachments[attachmentId] || {};
        setData('updated_attachments', {
            ...data.updated_attachments,
            [attachmentId]: {
                ...updated,
                file: file,
            },
        });
    };

    const submit = (e: FormEvent) => {
        e.preventDefault();
        post(update.url(module.id), {
            forceFormData: true,
        });
    };

    return (
        <div className="space-y-6 p-6">
            <Card>
                <CardHeader>
                    <CardTitle>Edit modul</CardTitle>
                    <CardDescription>
                        Ubah konten, tugas, dan lampiran untuk modul ini.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={submit} className="space-y-4">
                        <ModuleFormFields
                            prefix="edit"
                            title={data.title}
                            video={data.video}
                            duration={data.duration}
                            description={data.description}
                            onTitleChange={(value) =>
                                setData('title', value)
                            }
                            onVideoChange={(value) =>
                                setData('video', value)
                            }
                            onDurationChange={(value) =>
                                setData('duration', value)
                            }
                            onDescriptionChange={(value) =>
                                setData('description', value)
                            }
                            errors={{
                                title: errors.title,
                                video: errors.video,
                                duration: errors.duration,
                                description: errors.description,
                            }}
                        />

                        <ModuleAssignments
                            prefix="edit"
                            assignments={data.assignments}
                            onAddAssignment={addAssignment}
                            onRemoveAssignment={removeAssignment}
                            onUpdateAssignment={updateAssignment}
                            errors={errors}
                        />

                        <div className="grid gap-2">
                            <Label htmlFor="edit-thumbnail">
                                Thumbnail baru
                            </Label>
                            <Input
                                id="edit-thumbnail"
                                type="file"
                                accept="image/*"
                                onChange={(e) =>
                                    setData(
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
                            prefix="edit"
                            attachmentFiles={data.attachments}
                            existingAttachments={module.attachments}
                            selectedModule={module}
                            updatedAttachments={
                                data.updated_attachments
                            }
                            deletedAttachmentIds={deletedAttachmentIds}
                            expandedAttachmentId={expandedAttachmentId}
                            onAddAttachment={addAttachment}
                            onRemoveAttachment={removeAttachment}
                            onUpdateAttachment={updateAttachment}
                            onMarkExistingAttachmentForDelete={
                                markExistingAttachmentForDelete
                            }
                            onUndoExistingAttachmentDelete={
                                undoExistingAttachmentDelete
                            }
                            onUpdateExistingAttachmentName={
                                updateExistingAttachmentName
                            }
                            onUpdateExistingAttachmentFile={
                                updateExistingAttachmentFile
                            }
                            onToggleExpandAttachment={
                                setExpandedAttachmentId
                            }
                            errors={{
                                attachment: errors.attachment,
                                attachments: errors.attachments,
                            }}
                        />

                        <div className="flex items-center gap-3">
                            <input
                                id="edit-is-preview"
                                type="checkbox"
                                checked={data.is_preview}
                                onChange={(e) =>
                                    setData(
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

                        <div className="flex flex-wrap justify-end gap-2 border-t pt-4">
                            <Button variant="outline" asChild>
                                <Link href={courseShow.url(course.id)}>
                                    Batal
                                </Link>
                            </Button>
                            <Button type="submit" disabled={processing}>
                                {processing
                                    ? 'Menyimpan...'
                                    : 'Simpan perubahan'}
                            </Button>
                        </div>
                    </form>
                        </CardContent>
                    </Card>
                </div>
    );
}

export default function EditModulePage() {
    const { module, course } = usePage<AdminModuleEditPageProps>().props;

    return (
        <AdminLayout>
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                    <div className="flex items-center gap-2">
                        <SidebarTrigger className="-ml-1" />
                        <Separator
                            orientation="vertical"
                            className="mr-2 h-4"
                        />
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem className="hidden md:block">
                                    <BreadcrumbLink asChild>
                                        <Link href={courseShow.url(course.id)}>
                                            {course.title}
                                        </Link>
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator className="hidden md:block" />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>
                                        Edit modul: {module.title}
                                    </BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </header>

                <ModuleEditForm
                    key={`${module.id}-${module.updated_at ?? '0'}`}
                    module={module}
                    course={course}
                />
            </SidebarInset>
        </AdminLayout>
    );
}
