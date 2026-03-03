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

// 1. Definisikan interface untuk Role
interface Role {
  id: number
  name: string
}

// 2. Definisikan interface untuk PageProps
interface PageProps {
  role: Role
  flash: {
    success?: string
    error?: string
  }
  [key: string]: any
}

export default function EditRolePage() {
  // 3. Gunakan interface PageProps
  const { role, flash } = usePage<PageProps>().props

  const { data, setData, put, processing, errors } = useForm({
    name: role.name,
  })

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    // Gunakan PUT method untuk update
    put(`/admin/roles/${role.id}`, {
      preserveScroll: true,
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
                  <BreadcrumbPage>Edit Role</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="flex flex-1 items-center justify-center p-4">
          <form onSubmit={submit} className="w-full max-w-md space-y-6">
            <h1 className="font-semibold text-2xl text-center">Edit Role</h1>

            {/* Flash message sukses */}
            {flash?.success && (
              <div className="p-3 text-sm font-medium text-green-600 bg-green-50 border border-green-200 rounded-lg">
                {flash.success}
              </div>
            )}

            {/* Flash message error */}
            {flash?.error && (
              <div className="p-3 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg">
                {flash.error}
              </div>
            )}

            <Field className="grid gap-2">
              <FieldLabel htmlFor="name">Name</FieldLabel>
              <Input
                id="name"
                value={data.name}
                onChange={(e) => setData("name", e.target.value)}
                placeholder="Enter role name"
                className={errors.name ? "border-red-500 focus-visible:ring-red-500" : ""}
              />

              {errors.name && (
                <p className="text-sm text-red-500 font-medium">{errors.name}</p>
              )}

              <FieldDescription>
                Choose a unique role name.
              </FieldDescription>
            </Field>

            <div className="flex gap-2">
              <Button
                type="submit"
                className="flex-1"
                disabled={processing}
              >
                {processing ? "Saving..." : "Update Role"}
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
    </SidebarProvider>
  )
}
