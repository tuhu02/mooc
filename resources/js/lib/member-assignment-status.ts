export type MemberSubmissionStatus =
    | 'submitted'
    | 'reviewed'
    | 'revision_required';

export function memberAssignmentStatusPresentation(
    submission:
        | { status?: MemberSubmissionStatus | null }
        | null
        | undefined,
): { label: string; pillClassName: string } {
    if (!submission) {
        return {
            label: 'Belum dikumpulkan',
            pillClassName: 'bg-amber-100 text-amber-700',
        };
    }

    const status = submission.status ?? 'submitted';

    switch (status) {
        case 'reviewed':
            return {
                label: 'Sudah dikoreksi',
                pillClassName: 'bg-emerald-100 text-emerald-700',
            };
        case 'revision_required':
            return {
                label: 'Perlu revisi',
                pillClassName: 'bg-orange-100 text-orange-800',
            };
        case 'submitted':
        default:
            return {
                label: 'Sedang dikoreksi',
                pillClassName: 'bg-sky-100 text-sky-800',
            };
    }
}
