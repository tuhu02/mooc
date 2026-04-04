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
import { useForm, usePage } from '@inertiajs/react';
import { index } from '@/routes/admin/mentors';
import { Mentor, PageProps } from '@/types';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

export default function EditMentorPage() {
    const { mentor } = usePage<PageProps & { mentor: Mentor }>().props;

    const [previewAvatar, setPreviewAvatar] = React.useState<string | null>(
        mentor.avatar ? `/storage/${mentor.avatar}` : null,
    );

    const { data, setData, post, processing, errors } = useForm<{
        _method: string;
        name: string;
        email: string;
        bio: string;
        avatar: File | null;
        address: string;
        password: string;
        password_confirmation: string;
    }>({
        _method: 'PUT',
        name: mentor.user.name,
        email: mentor.user.email,
        bio: mentor.bio,
        avatar: null,
        address: mentor.user.address ?? '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/admin/mentors/${mentor.id}`, {
            preserveScroll: true,
            onSuccess: (page) => console.log('Success:', page),
            onError: (errors) => console.log('Validation errors:', errors),
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
                                        Mentor
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator className="hidden md:block" />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>Edit Mentor</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </header>

                <div className="flex flex-1 items-center justify-center p-4">
                    <form
                        onSubmit={submit}
                        className="w-full max-w-md space-y-6"
                    >
                        <h1 className="text-center text-2xl font-semibold">
                            Edit Mentor
                        </h1>

                        <Field className="grid gap-2">
                            <FieldLabel htmlFor="name">Name</FieldLabel>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) =>
                                    setData('name', e.target.value)
                                }
                                placeholder="Enter Name"
                                className={
                                    errors.name
                                        ? 'border-red-500 focus-visible:ring-red-500'
                                        : ''
                                }
                            />

                            {errors.name && (
                                <p className="text-sm font-medium text-red-500">
                                    {errors.name}
                                </p>
                            )}
                        </Field>

                        <Field className="grid gap-2">
                            <FieldLabel htmlFor="bio">Bio</FieldLabel>
                            <textarea
                                id="bio"
                                value={data.bio}
                                onChange={(e) => setData('bio', e.target.value)}
                                placeholder="Enter bio"
                                rows={4}
                                className={`flex w-full rounded-md border px-3 py-2 text-sm ${
                                    errors.bio
                                        ? 'border-red-500 focus-visible:ring-red-500'
                                        : ''
                                }`}
                            />
                            {errors.bio && (
                                <p className="text-sm font-medium text-red-500">
                                    {errors.bio}
                                </p>
                            )}
                        </Field>

                        <Field className="grid items-center gap-2">
                            <FieldLabel htmlFor="avatar">Avatar</FieldLabel>
                            <div className="flex items-center gap-4">
                                <Avatar>
                                    <AvatarImage
                                        src={previewAvatar ?? undefined}
                                        alt="Avatar"
                                    />
                                    <AvatarFallback>
                                        {mentor.user.name[0]}
                                    </AvatarFallback>
                                </Avatar>
                                <Input
                                    id="avatar"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file =
                                            e.target.files?.[0] ?? null;
                                        setData('avatar', file);
                                        if (file) {
                                            setPreviewAvatar(
                                                URL.createObjectURL(file),
                                            );
                                        }
                                    }}
                                />
                            </div>
                            {errors.avatar && (
                                <p className="text-sm font-medium text-red-500">
                                    {errors.avatar}
                                </p>
                            )}
                        </Field>

                        <Field className="grid gap-2">
                            <FieldLabel htmlFor="email">Email</FieldLabel>
                            <Input
                                id="email"
                                type="email"
                                value={data.email}
                                onChange={(e) =>
                                    setData('email', e.target.value)
                                }
                                placeholder="Enter Email"
                                className={
                                    errors.email
                                        ? 'border-red-500 focus-visible:ring-red-500'
                                        : ''
                                }
                            />

                            {errors.email && (
                                <p className="text-sm font-medium text-red-500">
                                    {errors.email}
                                </p>
                            )}
                        </Field>

                        <Field className="grid gap-2">
                            <FieldLabel htmlFor="password">
                                New Password
                            </FieldLabel>
                            <Input
                                id="password"
                                type="password"
                                value={data.password}
                                onChange={(e) =>
                                    setData('password', e.target.value)
                                }
                                placeholder="Leave blank if unchanged"
                                className={
                                    errors.password
                                        ? 'border-red-500 focus-visible:ring-red-500'
                                        : ''
                                }
                            />

                            {errors.password && (
                                <p className="text-sm font-medium text-red-500">
                                    {errors.password}
                                </p>
                            )}

                            <FieldDescription>
                                Kosongkan jika tidak ingin mengganti password.
                            </FieldDescription>
                        </Field>

                        <Field className="grid gap-2">
                            <FieldLabel htmlFor="password_confirmation">
                                Password Confirmation
                            </FieldLabel>
                            <Input
                                id="password_confirmation"
                                type="password"
                                value={data.password_confirmation}
                                onChange={(e) =>
                                    setData(
                                        'password_confirmation',
                                        e.target.value,
                                    )
                                }
                                placeholder="Repeat new password"
                                className={
                                    errors.password_confirmation
                                        ? 'border-red-500 focus-visible:ring-red-500'
                                        : ''
                                }
                            />

                            {errors.password_confirmation && (
                                <p className="text-sm font-medium text-red-500">
                                    {errors.password_confirmation}
                                </p>
                            )}
                        </Field>

                        <div className="flex gap-2">
                            <Button
                                type="submit"
                                className="flex-1"
                                disabled={processing}
                            >
                                {processing ? 'Saving...' : 'Update Mentor'}
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
