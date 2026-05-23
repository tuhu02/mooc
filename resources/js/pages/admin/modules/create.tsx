import AdminLayout from '@/layouts/admin-layout';
import { useState, type FormEvent } from 'react';
import { Link, useForm, usePage } from '@inertiajs/react';
import type { CreateCourseModuleForm } from '@/types/course-modules';
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

type AdminModuleCreatePageProps = {
    course: {
        id: number;
        title: string;
        type: string;
    };
};

function ModuleCreateForm({
    course,
}: {
    course: AdminModuleCreatePageProps['course'];
}) {
    const { data, setData, post, processing, errors } =
        useForm<CreateCourseModuleForm>({
            course_id: course.id,
            title: '',
            description: '',
            video: '',
            duration: '',
            is_preview: false,
            available_at: null,
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

    const submit = (e: FormEvent) => {
        e.preventDefault();
        post('/admin/modules', {
            forceFormData: true,
        });
    };

    return (
        <div className="space-y-6 p-6">
            <Card>
                <CardHeader>
                    <CardTitle>Tambah modul baru</CardTitle>
                    <CardDescription>
                        Buat modul baru untuk course "{course.title}"
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={submit} className="space-y-4">
                        <ModuleFormFields
                            prefix="create"
                            title={data.title}
                            video={data.video}
                            duration={data.duration}
                            description={data.description}
                            available_at={data.available_at}
                            courseType={course.type}
                            onTitleChange={(value) => setData('title', value)}
                            onVideoChange={(value) => setData('video', value)}
                            onDurationChange={(value) =>
                                setData('duration', value)
                            }
                            onDescriptionChange={(value) =>
                                setData('description', value)
                            }
                            onAvailableAtChange={(value) =>
                                setData('available_at', value)
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
                            onAddAssignment={addAssignment}
                            onRemoveAssignment={removeAssignment}
                            onUpdateAssignment={updateAssignment}
                            errors={errors}
                        />

                        <div className="grid gap-2">
                            <Label htmlFor="create-thumbnail">Thumbnail</Label>
                            <Input
                                id="create-thumbnail"
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
                            prefix="create"
                            attachmentFiles={data.attachments}
                            onAddAttachment={addAttachment}
                            onRemoveAttachment={removeAttachment}
                            onUpdateAttachment={updateAttachment}
                            errors={{
                                attachment: errors.attachment,
                                attachments: errors.attachments,
                            }}
                        />

                        {course.type !== 'event' && (
                            <div className="flex items-center gap-3">
                                <input
                                    id="create-is-preview"
                                    type="checkbox"
                                    checked={data.is_preview}
                                    onChange={(e) =>
                                        setData('is_preview', e.target.checked)
                                    }
                                    className="h-4 w-4 rounded border-gray-300"
                                />
                                <Label htmlFor="create-is-preview">
                                    Jadikan modul ini sebagai preview
                                </Label>
                            </div>
                        )}

                        <div className="flex flex-wrap justify-end gap-2 border-t pt-4">
                            <Button variant="outline" asChild>
                                <Link href={courseShow.url(course.id)}>
                                    Batal
                                </Link>
                            </Button>
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Menyimpan...' : 'Simpan modul'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

export default function CreateModulePage() {
    const { course } = usePage<AdminModuleCreatePageProps>().props;

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
                                        Tambah modul
                                    </BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </header>
                <ModuleCreateForm course={course} />
            </SidebarInset>
        </AdminLayout>
    );
}
