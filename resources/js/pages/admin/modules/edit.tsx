import AdminLayout from '@/layouts/admin-layout';
import React from 'react';
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
import { Field, FieldDescription, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useForm, usePage } from '@inertiajs/react';
import { Module, Course } from '@/types';
import MDEditor from '@uiw/react-md-editor';

export default function EditModulePage() {
    const { module, courses, filters } = usePage<{
        module: Module;
        courses: Course[];
        filters: {
            course_id?: string;
        };
    }>().props;

    const [previewThumbnail, setPreviewThumbnail] = React.useState<string>(
        module.thumbnail ? `/storage/${module.thumbnail}` : '',
    );

    const { data, setData, post, processing, errors } = useForm<{
        _method: 'PUT';
        course_id: string;
        title: string;
        thumbnail: File | null;
        video: File | null;
        description: string;
        duration: string;
        attachment: File | null;
    }>({
        _method: 'PUT',
        course_id: String(module.course_id),
        title: module.title,
        thumbnail: null as File | null,
        video: null as File | null,
        description: module.description ?? '',
        duration: module.duration ? String(module.duration) : '',
        attachment: null as File | null,
    });

    const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('thumbnail', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewThumbnail(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(
            `/admin/modules/${module.id}${filters.course_id ? `?course_id=${filters.course_id}` : ''}`,
        );
    };

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
                                    <BreadcrumbLink
                                        href={`/admin/modules${filters.course_id ? `?course_id=${filters.course_id}` : ''}`}
                                    >
                                        Modules
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator className="hidden md:block" />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>Edit Modul</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </header>

                <div className="flex flex-1 items-center justify-center p-4">
                    <form
                        onSubmit={submit}
                        className="w-full max-w-4xl space-y-6"
                    >
                        <h1 className="text-center text-2xl font-semibold">
                            Edit Module
                        </h1>

                        <Field className="grid gap-2">
                            <FieldLabel htmlFor="course_id">Kursus</FieldLabel>
                            <select
                                id="course_id"
                                value={data.course_id}
                                onChange={(e) =>
                                    setData('course_id', e.target.value)
                                }
                                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                            >
                                <option value="">Pilih kursus</option>
                                {courses.map((course) => (
                                    <option key={course.id} value={course.id}>
                                        {course.title}
                                    </option>
                                ))}
                            </select>
                            {errors.course_id && (
                                <p className="text-sm font-medium text-red-500">
                                    {errors.course_id}
                                </p>
                            )}
                        </Field>

                        <Field className="grid gap-2">
                            <FieldLabel htmlFor="title">Judul</FieldLabel>
                            <Input
                                id="title"
                                value={data.title}
                                onChange={(e) =>
                                    setData('title', e.target.value)
                                }
                                placeholder="Masukkan judul module"
                            />
                            {errors.title && (
                                <p className="text-sm font-medium text-red-500">
                                    {errors.title}
                                </p>
                            )}
                        </Field>

                        <Field className="grid gap-2">
                            <FieldLabel htmlFor="thumbnail">
                                Thumbnail
                            </FieldLabel>
                            {previewThumbnail && (
                                <img
                                    src={previewThumbnail}
                                    alt="Preview"
                                    className="h-32 w-full rounded object-cover"
                                />
                            )}
                            <Input
                                id="thumbnail"
                                type="file"
                                accept="image/*"
                                onChange={handleThumbnailChange}
                            />
                            {errors.thumbnail && (
                                <p className="text-sm font-medium text-red-500">
                                    {errors.thumbnail}
                                </p>
                            )}
                            <FieldDescription>
                                Unggah gambar dengan ukuran maksimal 4MB.
                            </FieldDescription>
                        </Field>

                        <Field className="grid gap-2">
                            <FieldLabel htmlFor="video">Video</FieldLabel>
                            {module.video && (
                                <a
                                    href={module.video}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-sm text-blue-600 underline"
                                >
                                    Video Vimeo saat ini
                                </a>
                            )}
                            <Input
                                id="video"
                                type="file"
                                accept="video/*"
                                onChange={(e) =>
                                    setData(
                                        'video',
                                        e.target.files?.[0] ?? null,
                                    )
                                }
                            />
                            {errors.video && (
                                <p className="text-sm font-medium text-red-500">
                                    {errors.video}
                                </p>
                            )}
                            <FieldDescription>
                                Upload video baru hanya jika ingin mengganti URL
                                Vimeo yang tersimpan.
                            </FieldDescription>
                        </Field>

                        <Field className="grid gap-2">
                            <FieldLabel htmlFor="description">
                                Deskripsi
                            </FieldLabel>
                            <MDEditor
                                id="description"
                                value={data.description}
                                onChange={(val) =>
                                    setData('description', val ?? '')
                                }
                                height={200}
                            />
                            {errors.description && (
                                <p className="text-sm font-medium text-red-500">
                                    {errors.description}
                                </p>
                            )}
                        </Field>

                        <Field className="grid gap-2">
                            <FieldLabel htmlFor="duration">
                                Durasi (menit)
                            </FieldLabel>
                            <Input
                                id="duration"
                                type="number"
                                value={data.duration}
                                onChange={(e) =>
                                    setData('duration', e.target.value)
                                }
                                placeholder="Durasi dalam menit"
                            />
                            {errors.duration && (
                                <p className="text-sm font-medium text-red-500">
                                    {errors.duration}
                                </p>
                            )}
                        </Field>

                        <Field className="grid gap-2">
                            <FieldLabel htmlFor="attachment">
                                Attachment
                            </FieldLabel>
                            {module.attachment && (
                                <a
                                    href={
                                        module.attachment.startsWith('http')
                                            ? module.attachment
                                            : `/storage/${module.attachment}`
                                    }
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-sm text-blue-600 underline"
                                >
                                    Attachment saat ini
                                </a>
                            )}
                            <Input
                                id="attachment"
                                type="file"
                                accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.zip,.rar"
                                onChange={(e) =>
                                    setData(
                                        'attachment',
                                        e.target.files?.[0] ?? null,
                                    )
                                }
                            />
                            {errors.attachment && (
                                <p className="text-sm font-medium text-red-500">
                                    {errors.attachment}
                                </p>
                            )}
                            <FieldDescription>
                                Upload file baru hanya jika ingin mengganti
                                attachment lama. Maksimal 10MB.
                            </FieldDescription>
                        </Field>

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={processing}
                        >
                            {processing ? 'Menyimpan...' : 'Perbarui Modul'}
                        </Button>
                    </form>
                </div>
            </SidebarInset>
        </AdminLayout>
    );
}
