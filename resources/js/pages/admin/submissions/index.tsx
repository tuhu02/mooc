import * as React from 'react';
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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { FileText } from 'lucide-react';
import { PaginationComponent } from '@/components/admin';
import type { CursorPagination } from '@/types';

type SubmissionStatus = 'submitted' | 'reviewed' | 'revision_required';

type Submission = {
    id: number;
    file: string;
    feedback?: string | null;
    status: SubmissionStatus;
    reviewed_at?: string | null;
    created_at: string;
    member?: {
        user?: {
            name: string;
            email: string;
        };
    };
    assignment?: {
        title: string;
        description?: string | null;
        module?: {
            title: string;
            course?: {
                title: string;
            };
        };
    };
};

type PageProps = {
    submissions: CursorPagination<Submission>;
    filters: {
        status?: string | null;
    };
};

const statusLabels: Record<SubmissionStatus, string> = {
    submitted: 'Belum Dikoreksi',
    reviewed: 'Sudah Dikoreksi',
    revision_required: 'Perlu Revisi',
};

const statusClasses: Record<SubmissionStatus, string> = {
    submitted: 'bg-amber-100 text-amber-700',
    reviewed: 'bg-emerald-100 text-emerald-700',
    revision_required: 'bg-rose-100 text-rose-700',
};

export default function SubmissionIndex() {
    const { submissions, filters } = usePage<PageProps>().props;

    const [selectedSubmission, setSelectedSubmission] =
        React.useState<Submission | null>(null);

    const { data, setData, put, processing, errors, reset } = useForm<{
        feedback: string;
        status: SubmissionStatus;
    }>({
        feedback: '',
        status: 'submitted',
    });

    const changeStatus = (status: string) => {
        router.get(
            '/admin/submissions',
            status ? { status } : {},
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    const openReviewModal = (submission: Submission) => {
        setSelectedSubmission(submission);

        setData({
            feedback: submission.feedback ?? '',
            status: submission.status,
        });
    };

    const closeReviewModal = () => {
        setSelectedSubmission(null);
        reset();
    };

    const submitReview = (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedSubmission) {
            return;
        }

        put(`/admin/submissions/${selectedSubmission.id}/review`, {
            preserveScroll: true,
            onSuccess: () => {
                closeReviewModal();
            },
        });
    };

    return (
        <AdminLayout>
            <Head title="Koreksi Tugas" />

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
                                    <BreadcrumbLink href="/admin/submissions">
                                        Koreksi Tugas
                                    </BreadcrumbLink>
                                </BreadcrumbItem>

                                <BreadcrumbSeparator className="hidden md:block" />

                                <BreadcrumbItem>
                                    <BreadcrumbPage>
                                        Semua Submission
                                    </BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </header>

                <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <h1 className="text-xl font-semibold">
                                Koreksi Tugas
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                Daftar pekerjaan member yang sudah dikumpulkan.
                            </p>
                        </div>

                        <select
                            value={filters.status ?? ''}
                            onChange={(e) => changeStatus(e.target.value)}
                            className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm sm:w-48"
                        >
                            <option value="">Semua Status</option>
                            <option value="submitted">Belum Dikoreksi</option>
                            <option value="reviewed">Sudah Dikoreksi</option>
                            <option value="revision_required">
                                Perlu Revisi
                            </option>
                        </select>
                    </div>

                    <div className="rounded-xl border bg-background">
                        <Table>
                            <TableCaption>
                                Daftar submission tugas member.
                            </TableCaption>

                            <TableHeader>
                                <TableRow>
                                    <TableHead>Member</TableHead>
                                    <TableHead>Course</TableHead>
                                    <TableHead>Module</TableHead>
                                    <TableHead>Assignment</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">
                                        Aksi
                                    </TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {submissions.data.length > 0 ? (
                                    submissions.data.map((submission) => (
                                        <TableRow key={submission.id}>
                                            <TableCell>
                                                <div className="font-medium">
                                                    {submission.member?.user
                                                        ?.name ?? '-'}
                                                </div>

                                                <div className="text-xs text-muted-foreground">
                                                    {submission.member?.user
                                                        ?.email ?? '-'}
                                                </div>
                                            </TableCell>

                                            <TableCell>
                                                {submission.assignment?.module
                                                    ?.course?.title ?? '-'}
                                            </TableCell>

                                            <TableCell>
                                                {submission.assignment?.module
                                                    ?.title ?? '-'}
                                            </TableCell>

                                            <TableCell>
                                                {submission.assignment?.title ??
                                                    '-'}
                                            </TableCell>

                                            <TableCell>
                                                <span
                                                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                                                        statusClasses[
                                                            submission.status
                                                        ]
                                                    }`}
                                                >
                                                    {
                                                        statusLabels[
                                                            submission.status
                                                        ]
                                                    }
                                                </span>
                                            </TableCell>

                                            <TableCell className="text-right">
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() =>
                                                        openReviewModal(
                                                            submission,
                                                        )
                                                    }
                                                >
                                                    Koreksi
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell
                                            colSpan={6}
                                            className="h-24 text-center text-muted-foreground"
                                        >
                                            Belum ada submission.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    <PaginationComponent pagination={submissions} />

                    <div className="min-h-screen flex-1 rounded-xl bg-muted/50 md:min-h-min" />
                </div>
            </SidebarInset>

            <Dialog
                open={selectedSubmission !== null}
                onOpenChange={(open) => {
                    if (!open) {
                        closeReviewModal();
                    }
                }}
            >
                <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>Koreksi Submission</DialogTitle>
                        <DialogDescription>
                            Periksa file jawaban member, lalu berikan feedback
                            dan status koreksi.
                        </DialogDescription>
                    </DialogHeader>

                    {selectedSubmission && (
                        <div className="space-y-6">
                            <div className="grid gap-4 rounded-xl border bg-muted/30 p-4 text-sm md:grid-cols-2">
                                <div>
                                    <p className="text-xs font-semibold uppercase text-muted-foreground">
                                        Member
                                    </p>
                                    <p className="font-medium">
                                        {selectedSubmission.member?.user
                                            ?.name ?? '-'}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {selectedSubmission.member?.user
                                            ?.email ?? '-'}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs font-semibold uppercase text-muted-foreground">
                                        Assignment
                                    </p>
                                    <p className="font-medium">
                                        {selectedSubmission.assignment?.title ??
                                            '-'}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs font-semibold uppercase text-muted-foreground">
                                        Course
                                    </p>
                                    <p className="font-medium">
                                        {selectedSubmission.assignment?.module
                                            ?.course?.title ?? '-'}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs font-semibold uppercase text-muted-foreground">
                                        Module
                                    </p>
                                    <p className="font-medium">
                                        {selectedSubmission.assignment?.module
                                            ?.title ?? '-'}
                                    </p>
                                </div>
                            </div>

                            <div className="rounded-xl border bg-background p-4">
                                <h3 className="font-semibold">
                                    File Jawaban Member
                                </h3>

                                <p className="mt-1 text-sm text-muted-foreground">
                                    Buka file submission untuk melihat pekerjaan
                                    member.
                                </p>

                                <Button asChild className="mt-4">
                                    <a
                                        href={`/storage/${selectedSubmission.file}`}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        <FileText className="mr-2 h-4 w-4" />
                                        Buka File Submission
                                    </a>
                                </Button>
                            </div>

                            <form onSubmit={submitReview} className="space-y-4">
                                <div>
                                    <label
                                        htmlFor="status"
                                        className="text-sm font-medium"
                                    >
                                        Status
                                    </label>

                                    <select
                                        id="status"
                                        value={data.status}
                                        onChange={(e) =>
                                            setData(
                                                'status',
                                                e.target
                                                    .value as SubmissionStatus,
                                            )
                                        }
                                        className="mt-1 h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    >
                                        <option value="submitted">
                                            Belum Dikoreksi
                                        </option>
                                        <option value="reviewed">
                                            Sudah Dikoreksi
                                        </option>
                                        <option value="revision_required">
                                            Perlu Revisi
                                        </option>
                                    </select>

                                    {errors.status && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.status}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label
                                        htmlFor="feedback"
                                        className="text-sm font-medium"
                                    >
                                        Feedback
                                    </label>

                                    <textarea
                                        id="feedback"
                                        rows={8}
                                        value={data.feedback}
                                        onChange={(e) =>
                                            setData('feedback', e.target.value)
                                        }
                                        className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                        placeholder="Tulis koreksi atau catatan untuk member..."
                                    />

                                    {errors.feedback && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.feedback}
                                        </p>
                                    )}
                                </div>

                                <DialogFooter>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={closeReviewModal}
                                    >
                                        Batal
                                    </Button>

                                    <Button type="submit" disabled={processing}>
                                        Simpan Koreksi
                                    </Button>
                                </DialogFooter>
                            </form>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
}