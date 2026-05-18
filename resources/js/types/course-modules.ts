export type AssignmentForm = {
    id?: number;
    title: string;
    description: string;
    type: string;
};

export type CourseModuleAssignment = {
    id: number;
    title: string;
    description?: string | null;
    type?: string | null;
};

export type ModuleAttachmentType = {
    id: number;
    module_id?: number;
    file_path: string;
    file_name: string;
    file_type?: string | null;
    file_size?: number | null;
};

export type AttachmentInputFile = File | null;

export type CourseModule = {
    id: number;
    title: string;
    description?: string | null;
    video?: string | null;
    duration?: number | null;
    thumbnail?: string | null;
    available_at?: string | null;

    /**
     * Field lama untuk single attachment.
     * Boleh dibiarkan dulu kalau masih ada data lama.
     */
    attachment?: string | null;
    attachment_name?: string | null;

    is_preview: boolean;
    sort_order: number;

    /**
     * Untuk remount form setelah simpan dari Laravel timestamps.
     */
    updated_at?: string;

    assignments?: CourseModuleAssignment[];
    attachments?: ModuleAttachmentType[];
};

export type CourseWithModules = {
    id: number;
    title: string;
    slug: string;
    description?: string | null;
    type: 'default' | 'event';
    modules: CourseModule[];
};

export type CreateCourseModuleForm = {
    course_id: number;
    title: string;
    description: string;
    video: string;
    is_preview: boolean;
    duration: string;
    available_at: string | null;
    thumbnail: File | null;

    /**
     * Field lama single attachment.
     * Kalau nanti sudah full multiple attachment, ini bisa dihapus.
     */
    attachment: File | null;
    attachment_name: string;

    /**
     * Untuk tombol Tambah Attachment.
     * Null = slot input attachment sudah dibuat, tapi file belum dipilih.
     */
    attachments: AttachmentInputFile[];

    assignments: AssignmentForm[];
    from: 'course-show';
};

export type EditCourseModuleForm = {
    _method: 'PUT';
    course_id: number;
    title: string;
    description: string;
    video: string;
    duration: string;
    available_at: string | null;
    thumbnail: File | null;

    /**
     * Field lama single attachment.
     * Kalau nanti sudah full multiple attachment, ini bisa dihapus.
     */
    attachment: File | null;
    attachment_name: string;

    is_preview: boolean;

    /**
     * Untuk tambah attachment baru saat edit.
     */
    attachments: AttachmentInputFile[];

    /**
     * Untuk attachment lama yang ingin dihapus saat edit.
     */
    deleted_attachment_ids: number[];

    /**
     * Untuk update nama atau file dari existing attachment.
     * Format: { attachmentId: { name?: string, file?: File | null } }
     */
    updated_attachments: Record<
        number,
        {
            name?: string;
            file?: File | null;
        }
    >;

    assignments: AssignmentForm[];
    from: 'course-show';
};

export type CourseShowPageProps = {
    course: CourseWithModules;
};

export type AdminModuleEditPageProps = {
    module: CourseModule;
    course: {
        id: number;
        title: string;
        type: 'default' | 'event';
    };
};

export type ModuleAttachmentsProps = {
    prefix: 'create' | 'edit';

    attachmentFiles: AttachmentInputFile[];

    existingAttachments?: ModuleAttachmentType[];
    selectedModule?: CourseModule | null;
    updatedAttachments?: Record<
        number,
        {
            name?: string;
            file?: File | null;
        }
    >;
    deletedAttachmentIds?: number[];
    expandedAttachmentId?: number | null;

    onAddAttachment: () => void;
    onRemoveAttachment: (index: number) => void;
    onUpdateAttachment: (index: number, file: File | null) => void;

    onMarkExistingAttachmentForDelete?: (attachmentId: number) => void;
    onUndoExistingAttachmentDelete?: (attachmentId: number) => void;
    onUpdateExistingAttachmentName?: (
        attachmentId: number,
        newName: string,
    ) => void;
    onUpdateExistingAttachmentFile?: (
        attachmentId: number,
        file: File | null,
    ) => void;
    onToggleExpandAttachment?: (attachmentId: number | null) => void;

    errors: Record<string, string | undefined>;
};

export type ModuleNavigationItem = {
    title: string;
    sort_order?: number | null;
    is_preview?: boolean;
    is_locked?: boolean;
};

export type ModuleBottomNavigationProps = {
    courseSlug: string;
    currentTitle?: string;
    prevModule: { sort_order?: number | null; title: string; is_preview?: boolean; is_locked?: boolean; } | null;
    nextModule: { sort_order?: number | null; title: string; is_preview?: boolean; is_locked?: boolean; } | null;
    basePath?: string;
};