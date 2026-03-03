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

import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useForm, usePage } from "@inertiajs/react"
import { index } from "@/routes/admin/roles"

// 1. Definisikan interface untuk tipe data Props dari Inertia
interface PageProps {
  flash: {
    success?: string;
    error?: string;
  };
  [key: string]: any; // Untuk props lain seperti 'auth', dll.
}

export default function Page() {
  // 2. Gunakan interface tadi saat memanggil usePage
  const { props } = usePage<PageProps>();
  const { flash } = props;

  const { data, setData, post, processing, errors, reset } = useForm({
    name: "",
  })

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    // Pastikan path diawali dengan '/' agar menjadi absolut
    post('/admin/roles/roles-store', { 
      onSuccess: () => reset(),
    })
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 px-4 border-b">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
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

        {/* 3. Menambahkan items-center & justify-center agar form di tengah */}
        <div className="flex flex-1 items-center justify-center p-4">
          <form onSubmit={submit} className="w-full max-w-md space-y-6">
            <h1 className="font-semibold text-2xl text-center">Add Role</h1>
            
            {/* 4. Gunakan Optional Chaining (?.) untuk menampilkan pesan sukses */}
            {flash?.success && (
              <div className="p-3 text-sm font-medium text-green-600 bg-green-50 border border-green-200 rounded-lg">
                {flash.success}
              </div>
            )}

            <Field className="grid gap-2">
              <FieldLabel htmlFor="name">Name</FieldLabel>
              <Input
                id="name"
                value={data.name}
                onChange={(e) => setData("name", e.target.value)}
                placeholder="Enter role name"
                // 5. Beri warna merah pada border jika ada error validasi
                className={errors.name ? "border-red-500 focus-visible:ring-red-500" : ""}
              />
              
              {errors.name && (
                <p className="text-sm text-red-500 font-medium">{errors.name}</p>
              )}

              <FieldDescription>
                Choose a unique role name.
              </FieldDescription>
            </Field>

            <Button type="submit" className="w-full" disabled={processing}>
              {processing ? "Saving..." : "Save Role"}
            </Button>
          </form>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}