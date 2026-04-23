import { useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Download, Eye, FileText, UploadCloud } from 'lucide-react';

type Submission = {
    id: number;
    submission_name?: string | null;
    file?: string | null;
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
    const { data, setData, post, processing, errors, reset } = useForm({
        file: null as File | null,
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setData('file', e.target.files?.[0] || null);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/member/assignments/${assignmentId}/submissions`, {
            forceFormData: true,
            onSuccess: () => {
                reset();
                onSuccess?.();
            },
        } as any);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-slate-700">
                    {submission ? 'Ganti File' : 'File'}{' '}
                    <span className="text-red-500">*</span>
                </label>
                <Input
                    type="file"
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
                <Button type="submit" disabled={processing || !data.file}>
                    {processing
                        ? 'Mengirim...'
                        : submission
                          ? 'Update File'
                          : 'Kirim Assignment'}
                </Button>
            </div>
        </form>
    );
}
