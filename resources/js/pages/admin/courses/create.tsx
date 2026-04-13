import AdminLayout from '@/layouts/admin-layout';
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
import { index, store } from '@/routes/admin/courses';
import { Category, Mentor } from '@/types';

export default function Page() {
    const { mentors, categories } = usePage<{
        mentors: Mentor[];
        categories: Category[];
    }>().props;

    const { data, setData, post, processing, errors } = useForm<{
        title: string;
        mentor_id: string;
        level: string;
        thumbnail: File | null;
        description: string;
        is_active: number;
        is_highlight: number;
        category_ids: number[];
    }>({
        title: '',
        mentor_id: '',
        level: '',
        thumbnail: null as File | null,
        description: '',
        is_active: 0,
        is_highlight: 0,
        category_ids: [] as number[],
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
        post(store.url());
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
                                        Kursus
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator className="hidden md:block" />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>
                                        Tambah Kursus
                                    </BreadcrumbPage>
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
                            Tambah Kursus
                        </h1>

                        <Field className="grid gap-2">
                            <FieldLabel htmlFor="title">Judul</FieldLabel>
                            <Input
                                id="title"
                                value={data.title}
                                onChange={(e) =>
                                    setData('title', e.target.value)
                                }
                                placeholder="Masukkan judul kursus"
                            />
                            {errors.title && (
                                <p className="text-sm font-medium text-red-500">
                                    {errors.title}
                                </p>
                            )}
                        </Field>

                        <Field className="grid gap-2">
                            <FieldLabel htmlFor="mentor_id">
                                Pengajar
                            </FieldLabel>
                            <select
                                id="mentor_id"
                                value={data.mentor_id}
                                onChange={(e) =>
                                    setData('mentor_id', e.target.value)
                                }
                                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                            >
                                <option value="">Pilih pengajar</option>
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
                            <FieldLabel htmlFor="level">Tingkat</FieldLabel>
                            <select
                                id="level"
                                value={data.level}
                                onChange={(e) =>
                                    setData('level', e.target.value)
                                }
                                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                            >
                                <option value="">Pilih tingkat</option>
                                <option value="Beginner">Pemula</option>
                                <option value="Intermediate">Menengah</option>
                                <option value="Advanced">Lanjutan</option>
                            </select>
                            {errors.level && (
                                <p className="text-sm font-medium text-red-500">
                                    {errors.level}
                                </p>
                            )}
                        </Field>

                        <Field className="grid gap-2">
                            <FieldLabel htmlFor="thumbnail">
                                Gambar Sampul
                            </FieldLabel>
                            <Input
                                id="thumbnail"
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
                            <FieldDescription>
                                Unggah gambar dengan ukuran maksimal 4MB.
                            </FieldDescription>
                        </Field>

                        <Field className="grid gap-2">
                            <FieldLabel htmlFor="description">
                                Deskripsi
                            </FieldLabel>
                            <textarea
                                id="description"
                                value={data.description}
                                onChange={(e) =>
                                    setData('description', e.target.value)
                                }
                                className="min-h-28 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                                placeholder="Masukkan deskripsi kursus"
                            />
                            {errors.description && (
                                <p className="text-sm font-medium text-red-500">
                                    {errors.description}
                                </p>
                            )}
                        </Field>

                        <Field className="grid gap-2">
                            <FieldLabel>Sorotan</FieldLabel>
                            <select
                                value={data.is_highlight}
                                onChange={(e) =>
                                    setData(
                                        'is_highlight',
                                        parseInt(e.target.value),
                                    )
                                }
                                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                            >
                                <option value={1}>Ya (Sorotan)</option>
                                <option value={0}>Tidak</option>
                            </select>
                            {errors.is_highlight && (
                                <p className="text-sm font-medium text-red-500">
                                    {errors.is_highlight}
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
                                        parseInt(e.target.value),
                                    )
                                }
                                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                            >
                                <option value={1}>Aktif</option>
                                <option value={0}>Tidak aktif</option>
                            </select>
                            {errors.is_active && (
                                <p className="text-sm font-medium text-red-500">
                                    {errors.is_active}
                                </p>
                            )}
                        </Field>

                        <Field className="grid gap-2">
                            <FieldLabel>Kategori</FieldLabel>
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

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={processing}
                        >
                            {processing ? 'Menyimpan...' : 'Simpan Kursus'}
                        </Button>
                    </form>
                </div>
            </SidebarInset>
        </AdminLayout>
    );
}
