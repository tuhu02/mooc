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
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { usePage, useForm, Link } from '@inertiajs/react';
import { Trash2, Pencil } from 'lucide-react';
import {
    index,
    create,
    edit,
    destroy as destroyRoute,
} from '@/routes/admin/roles';
import { toast } from 'sonner';
import { useEffect } from 'react';

type Role = {
    id: number;
    name: string;
};

export default function Page() {
    const { roles } = usePage<{ roles: Role[] }>().props;

    const { delete: destroy, processing } = useForm();

    const { flash } = usePage<{ flash?: { success?: string } }>().props;

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
    }, [flash]);
    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this role?')) {
            destroy(destroyRoute.url(id), {
                preserveScroll: true,
            });
        }
    };
    
    return (
        <AdminLayout>
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
                    <div className="flex items-center gap-2 px-4">
                        <SidebarTrigger className="-ml-1" />
                        <Separator
                            orientation="vertical"
                            className="mr-2 data-[orientation=vertical]:h-4"
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
                                    <BreadcrumbPage>All Roles</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </header>
                <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                    <div className="flex justify-between">
                        <h1 className="text-xl font-semibold">Manage Role</h1>
                        <Link href={create.url()}>
                            <Button className="w-auto">Tambah</Button>
                        </Link>
                    </div>
                    <Table>
                        <TableCaption>A list of Roles</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {roles.map((role, index) => (
                                <TableRow key={role.id}>
                                    <TableCell>{role.name}</TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            <Button
                                                asChild
                                                variant="outline"
                                                size="sm"
                                                disabled={processing}
                                            >
                                                <Link href={edit.url(role.id)}>
                                                    <Pencil className="mr-2 h-4 w-4" />
                                                    Edit
                                                </Link>
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                disabled={processing}
                                                onClick={() =>
                                                    handleDelete(role.id)
                                                }
                                            >
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                Delete
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <div className="min-h-screen flex-1 rounded-xl bg-muted/50 md:min-h-min" />
                </div>
            </SidebarInset>
        </AdminLayout>
    );
}
