import AdminLayout from '@/layouts/AdminLayout';
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
import { useForm } from '@inertiajs/react';
import { index } from '@/routes/admin/roles';


export default function Page() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/roles');
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
                                        Role
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator className="hidden md:block" />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>Add Role</BreadcrumbPage>
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
                            Add Role
                        </h1>


                        <Field className="grid gap-2">
                            <FieldLabel htmlFor="name">Name</FieldLabel>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) =>
                                    setData('name', e.target.value)
                                }
                                placeholder="Enter role name"
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

                            <FieldDescription>
                                Choose a unique role name.
                            </FieldDescription>
                        </Field>

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={processing}
                        >
                            {processing ? 'Saving...' : 'Save Role'}
                        </Button>
                    </form>
                </div>
            </SidebarInset>
        </AdminLayout>
    );
}
