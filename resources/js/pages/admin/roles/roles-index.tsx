import { AppSidebar } from "@/components/admin/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
    Button,
} from "@/components/ui/button"
import { usePage, useForm, Link } from "@inertiajs/react"
import { Trash2, Pencil } from "lucide-react"
import { index, add, edit } from "@/routes/admin/roles"

type Role = {
  id: number
  name: string
}

export default function Page() {
  const { roles } = usePage<{ roles: Role[]}>().props

  const { delete: destroy, processing } = useForm();

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this role?")) {
      // Mengirimkan request DELETE ke server
      destroy(`/admin/roles/${id}`, {
        preserveScroll: true,
        onSuccess: () => {
          // Kamu bisa tambah toast success di sini
        }
      });
    }
  };
  return (
    <SidebarProvider>
      <AppSidebar />
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
            <Link href={add.url()}>
              <Button className="w-auto">Tambah</Button>
            </Link>
          </div>
            <Table>
                <TableCaption>A list of Roles</TableCaption>
                <TableHeader>
                    <TableRow>
                    <TableHead>*</TableHead>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Aksi</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {roles.map((role, index) => (
                      <TableRow key={role.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{role.id}</TableCell>
                        <TableCell>{role.name}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Link href={edit.url(role.id)}>
                              <Button 
                                variant="outline" 
                                size="sm"
                                disabled={processing}
                              >
                                <Pencil className="w-4 h-4 mr-2" />
                                Edit
                              </Button>
                            </Link>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              disabled={processing}
                              onClick={() => handleDelete(role.id)}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
            </Table>
          <div className="bg-muted/50 min-h-screen flex-1 rounded-xl md:min-h-min" />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}