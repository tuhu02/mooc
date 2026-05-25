import { useEffect, useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { memberAssignmentStatusPresentation } from '@/lib/member-assignment-status';
import type { MemberSubmissionStatus } from '@/lib/member-assignment-status';

type Submission = {
    id: number;
    submission_name?: string | null;
    file?: string | null;
    feedback?: string | null;
    status?: MemberSubmissionStatus | null;
};

type Props = {
    assignmentId: number;
    submission?: Submission | null;
    onSuccess?: () => void;
};

export default function AssignmentSubmissionForm({
    assignmentId,
    submission,
    onSuccess,
}: Props) {
    const [successMessage, setSuccessMessage] = useState(false);
    const {
        data,
        setData,
        post,
        processing,
        errors,
        reset,
        setError,
        clearErrors,
    } = useForm({
        file: null as File | null,
    });

    const maxBytes = 10 * 1024 * 1024;

    // Auto close modal after success message is shown
    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => {
                onSuccess?.();
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, [successMessage, onSuccess]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0] ?? null;
        if (selected && selected.size > maxBytes) {
            e.target.value = '';
            setData('file', null);
            setError('file', 'Ukuran file melebihi 10MB.');
            return;
        }
        clearErrors('file');
        setData('file', selected);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/member/assignments/${assignmentId}/submissions`, {
            forceFormData: true,
            onSuccess: () => {
                reset();
                setSuccessMessage(true);
            },
        });
    };

    const statusPresentation = submission
        ? memberAssignmentStatusPresentation(submission)
        : null;

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {successMessage && (
                <div className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm">
                    <p className="font-medium text-green-800">
                        ✓ Tugas berhasil dikumpulkan!
                    </p>
                </div>
            )}

            {submission && statusPresentation ? (
                <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm">
                    <p className="font-medium text-slate-800">
                        Status: {statusPresentation.label}
                    </p>
                    {submission.feedback?.trim() ? (
                        <p className="mt-1 whitespace-pre-wrap text-slate-600">
                            {submission.feedback}
                        </p>
                    ) : null}
                </div>
            ) : null}

            <div>
                <label className="block text-sm font-medium text-slate-700">
                    {submission ? 'Ganti File' : 'File'}{' '}
                    <span className="text-red-500">*</span>
                </label>
                <Input
                    type="file"
                    name="file"
                    onChange={handleFileChange}
                    className="mt-1"
                />
                {errors.file && (
                    <p className="mt-1 text-sm text-red-500">{errors.file}</p>
                )}
                <p className="mt-1 text-xs text-slate-500">
                    Max 10MB. Upload file baru untuk mengganti file yang sudah
                    dikumpulkan.
                </p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
                <Button
                    type="submit"
                    disabled={processing || !data.file || successMessage}
                >
                    {successMessage
                        ? 'Menutup modal...'
                        : processing
                          ? 'Mengirim...'
                          : submission
                            ? 'Update File'
                            : 'Kirim Assignment'}
                </Button>
            </div>
        </form>
    );
}
