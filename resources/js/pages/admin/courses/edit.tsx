import AdminLayout from '@/layouts/AdminLayout';
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
import { Checkbox } from '@/components/ui/checkbox';
import { useForm, usePage } from '@inertiajs/react';
import { index, update } from '@/routes/admin/courses';
import { Category, Course, Mentor } from '@/types';

export default function EditCoursePage() {
    const { course, mentors, categories } = usePage<{
        course: Course;
        mentors: Mentor[];
        categories: Category[];
    }>().props;

    const [previewThumbnail, setPreviewThumbnail] = React.useState<string>(
        `/storage/${course.thumbnail}`,
    );

    const { data, setData, post, processing, errors } = useForm<{
        _method: 'PUT';
        title: string;
        mentor_id: string;
        thumbnail: File | null;
        description: string;
        is_active: 'active' | 'not_active';
        category_ids: number[];
    }>({
        _method: 'PUT',
        title: course.title,
        mentor_id: String(course.mentor_id),
        thumbnail: null as File | null,
        description: course.description,
        is_active: course.is_active,
        category_ids: course.categories?.map((category) => category.id) ?? [],
    });

    const toggleCategory = (id: number, checked: boolean) => {
        setData(
            'category_ids',
            checked
                ? [...data.category_ids, id]
                : data.category_ids.filter((item) => item !== id),
        );
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(update.url(course.id), {
            preserveScroll: true,
        });
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
                                    <BreadcrumbLink href={index.url()}>
                                        Courses
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator className="hidden md:block" />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>Edit Course</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </header>

                <div className="flex flex-1 items-center justify-center p-4">
                    <form
                        onSubmit={submit}
                        className="w-full max-w-xl space-y-6"
                    >
                        <h1 className="text-center text-2xl font-semibold">
                            Edit Course
                        </h1>

                        <Field className="grid gap-2">
                            <FieldLabel htmlFor="title">Title</FieldLabel>
                            <Input
                                id="title"
                                value={data.title}
                                onChange={(e) =>
                                    setData('title', e.target.value)
                                }
                                placeholder="Enter course title"
                            />
                            {errors.title && (
                                <p className="text-sm font-medium text-red-500">
                                    {errors.title}
                                </p>
                            )}
                        </Field>

                        <Field className="grid gap-2">
                            <FieldLabel htmlFor="mentor_id">Mentor</FieldLabel>
                            <select
                                id="mentor_id"
                                value={data.mentor_id}
                                onChange={(e) =>
                                    setData('mentor_id', e.target.value)
                                }
                                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                            >
                                <option value="">Select mentor</option>
                                {mentors.map((mentor) => (
                                    <option key={mentor.id} value={mentor.id}>
                                        {mentor.user.name}
                                    </option>
                                ))}
                            </select>
                            {errors.mentor_id && (
                                <p className="text-sm font-medium text-red-500">
                                    {errors.mentor_id}
                                </p>
                            )}
                        </Field>

                        <Field className="grid gap-2">
                            <FieldLabel htmlFor="thumbnail">
                                Thumbnail
                            </FieldLabel>
                            <img
                                src={previewThumbnail}
                                alt={course.title}
                                className="h-28 w-44 rounded object-cover"
                            />
                            <Input
                                id="thumbnail"
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files?.[0] ?? null;
                                    setData('thumbnail', file);
                                    if (file) {
                                        setPreviewThumbnail(
                                            URL.createObjectURL(file),
                                        );
                                    }
                                }}
                            />
                            {errors.thumbnail && (
                                <p className="text-sm font-medium text-red-500">
                                    {errors.thumbnail}
                                </p>
                            )}
                            <FieldDescription>
                                Leave it empty if you don't want to change the
                                thumbnail.
                            </FieldDescription>
                        </Field>

                        <Field className="grid gap-2">
                            <FieldLabel htmlFor="description">
                                Description
                            </FieldLabel>
                            <textarea
                                id="description"
                                value={data.description}
                                onChange={(e) =>
                                    setData('description', e.target.value)
                                }
                                className="min-h-28 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                                placeholder="Enter course description"
                            />
                            {errors.description && (
                                <p className="text-sm font-medium text-red-500">
                                    {errors.description}
                                </p>
                            )}
                        </Field>

                        <Field className="grid gap-2">
                            <FieldLabel>Status</FieldLabel>
                            <select
                                value={data.is_active}
                                onChange={(e) =>
                                    setData(
                                        'is_active',
                                        e.target.value as
                                            | 'active'
                                            | 'not_active',
                                    )
                                }
                                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                            >
                                <option value="active">Active</option>
                                <option value="not_active">Not Active</option>
                            </select>
                            {errors.is_active && (
                                <p className="text-sm font-medium text-red-500">
                                    {errors.is_active}
                                </p>
                            )}
                        </Field>

                        <Field className="grid gap-2">
                            <FieldLabel>Categories</FieldLabel>
                            <div className="grid gap-2 rounded-md border p-3">
                                {categories.map((category) => {
                                    const checked = data.category_ids.includes(
                                        category.id,
                                    );

                                    return (
                                        <label
                                            key={category.id}
                                            className="flex items-center gap-2"
                                        >
                                            <Checkbox
                                                checked={checked}
                                                onCheckedChange={(value) =>
                                                    toggleCategory(
                                                        category.id,
                                                        Boolean(value),
                                                    )
                                                }
                                            />
                                            <span>{category.name}</span>
                                        </label>
                                    );
                                })}
                            </div>
                            {errors.category_ids && (
                                <p className="text-sm font-medium text-red-500">
                                    {errors.category_ids}
                                </p>
                            )}
                        </Field>

                        <div className="flex gap-2">
                            <Button
                                type="submit"
                                className="flex-1"
                                disabled={processing}
                            >
                                {processing ? 'Saving...' : 'Update Course'}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                className="flex-1"
                                onClick={() => window.history.back()}
                            >
                                Cancel
                            </Button>
                        </div>
                    </form>
                </div>
            </SidebarInset>
        </AdminLayout>
    );
}
