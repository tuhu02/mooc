// ============================================================
// navigation.ts (merged)
// ============================================================
import type { InertiaLinkProps } from '@inertiajs/react';
import type { LucideIcon } from 'lucide-react';

export type BreadcrumbItem = {
    title: string;
    href: string;
};

export type NavItem = {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    isActive?: boolean;
};

export type * from './auth';

export type * from './ui';


export type Role = {
    id: number;
    name: string;
};

export type User = {
    id: number;
    name: string;
    email: string;
    institution: string;
    address: string;
    gender: string;
    date_of_birth: string;
    avatar_url?: string | null;
};

export type Member = {
    id: number;
    institution: string;
    gender: string;
    date_of_birth: string;
    user_id: number;
    user: {
        id: number;
        name: string;
        email: string;
        address: string;
    };
};

export type Admin = {
    id: number;
    user_id: number;
    user: {
        id: number;
        name: string;
        email: string;
    };
};

export type Mentor = {
    id: number;
    institution: string;
    gender: string;
    date_of_birth: string;
    bio: string;
    user_id: number;
    user: {
        id: number;
        name: string;
        email: string;
        address: string;
    };
    avatar?: string | null;
};

export type PageProps = {
    role?: Role;
    member?: Member;
    mentor?: Mentor;
};

export type Category = {
    id: number;
    name: string;
};

export type Course = {
    id: number;
    title: string;
    slug: string;
    thumbnail: string;
    description: string;
    is_active: boolean;
    is_highlight: boolean;
    level: 'Beginner' | 'Intermediate' | 'Advanced' | null;
    mentor_id: number;
    modules_count?: number;
    members_count?: number;
    mentor?: Mentor;
    categories?: Category[];
    type: 'default' | 'event';
    progress?: {
        completed: number;
        total: number;
        percentage: number;
    } | null;
};

export type Module = {
    id: number;
    course_id: number;
    sort_order?: number | null;
    title: string;
    thumbnail?: string | null;
    video?: string | null;
    description?: string | null;
    duration?: number | null;
    attachment?: string | null;
    created_at?: string;
    updated_at?: string;
    course?: Course;
    assignments?: Assignment[];
    available_at?: string | null;
};

export type Assignment = {
    id: number;
    module_id: number;
    title: string;
    description?: string | null;
    due_date?: string | null;
    created_at?: string;
    updated_at?: string;
    module?: Module;
};

export type AssignmentSubmission = {
    id: number;
    assignment_id: number;
    member_id: number;
    submission_name?: string | null;
    description?: string | null;
    file?: string | null;
    file_type?: string | null;
    submitted_at?: string | null;
    created_at?: string;
    updated_at?: string;
    assignment?: Assignment;
};

export type PreviewAssignment = {
    id: number;
    title: string;
    description?: string | null;
    submission?: unknown;
};

export type PreviewModule = Omit<Module, 'assignments'> & {
    is_preview: boolean;
    video?: string | null;
    thumbnail?: string | null;
    description?: string | null;
    attachment?: string | null;
    assignments?: PreviewAssignment[];
};

export type CourseDetail = Course & {
    modules?: PreviewModule[];
};

export type CourseDetailProps = {
    course: CourseDetail;
    isEnrolled?: boolean;
};

export type EventModule = Omit<Module, 'assignments'> & {
    available_at?: string | null;
    video?: string | null;
    thumbnail?: string | null;
    description?: string | null;
    attachment?: string | null;
    assignments?: PreviewAssignment[];
};

export type EventDetail = Course & {
    modules?: EventModule[];
};

export type EventDetailProps = {
    course: EventDetail;
    isEnrolled?: boolean;
};

export type LaravelPaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

export type LaravelPagination<T> = {
    data: T[];
    links: LaravelPaginationLink[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
};

export type CursorPagination<T> = {
    data: T[];
    path: string;
    per_page: number;
    next_page_url: string | null;
    prev_page_url: string | null;
};

export type TableData = {
    id: number;
    header: string;
    type: string;
    status: string;
    target: string;
    limit: string;
    reviewer: string;
};


export type ModuleAssignmentForm = {
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

export type ModuleAttachmentItem = {
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
    attachment?: string | null;
    attachment_name?: string | null;
    is_preview: boolean;
    sort_order: number;
    updated_at?: string;
    assignments?: CourseModuleAssignment[];
    attachments?: ModuleAttachmentItem[];
};

export type AdminCourseWithModules = {
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
    attachment: File | null;
    attachment_name: string;
    attachments: AttachmentInputFile[];
    assignments: ModuleAssignmentForm[];
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
    attachment: File | null;
    attachment_name: string;
    is_preview: boolean;
    attachments: AttachmentInputFile[];
    deleted_attachment_ids: number[];
    updated_attachments: Record<number, { name?: string; file?: File | null }>;
    assignments: ModuleAssignmentForm[];
    from: 'course-show';
};

export type CourseShowPageProps = {
    course: AdminCourseWithModules;
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
    existingAttachments?: ModuleAttachmentItem[];
    selectedModule?: CourseModule | null;
    updatedAttachments?: Record<number, { name?: string; file?: File | null }>;
    deletedAttachmentIds?: number[];
    expandedAttachmentId?: number | null;
    onAddAttachment: () => void;
    onRemoveAttachment: (index: number) => void;
    onUpdateAttachment: (index: number, file: File | null) => void;
    onMarkExistingAttachmentForDelete?: (attachmentId: number) => void;
    onUndoExistingAttachmentDelete?: (attachmentId: number) => void;
    onUpdateExistingAttachmentName?: (attachmentId: number, newName: string) => void;
    onUpdateExistingAttachmentFile?: (attachmentId: number, file: File | null) => void;
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
    prevModule: { sort_order?: number | null; title: string; is_preview?: boolean; is_locked?: boolean } | null;
    nextModule: { sort_order?: number | null; title: string; is_preview?: boolean; is_locked?: boolean } | null;
    basePath?: string;
    sidebarOpen?: boolean;
};

export type CourseLearningSubmission = {
    id: number;
    assignment_id: number;
    submission_name?: string | null;
    file?: string | null;
    feedback?: string | null;
    status?: 'submitted' | 'reviewed' | 'revision_required';
    reviewed_at?: string | null;
};

export type CourseLearningAssignment = {
    id: number;
    module_id: number;
    title: string;
    description?: string | null;
    due_date?: string | null;
    created_at?: string;
    updated_at?: string;
    module?: CourseLearningModule;
    submission?: CourseLearningSubmission | null;
};

export type CourseLearningModule = {
    id: number;
    course_id?: number;
    sort_order?: number | null;
    title: string;
    is_preview?: boolean;
    is_locked?: boolean;
    thumbnail?: string | null;
    video?: string | null;
    description?: string | null;
    duration?: number | null;
    available_at?: string | null;
    attachment?: string | null;
    attachment_name?: string | null;
    attachments?: Array<{
        id: number;
        file_path: string;
        file_name: string;
        file_type?: string | null;
        file_size?: number | null;
    }>;
    created_at?: string;
    updated_at?: string;
    course?: Course;
    assignments?: CourseLearningAssignment[];
};

export type CourseLearningModuleGroup = {
    id: number;
    title: string;
    modules: CourseLearningModule[];
};

export type CourseLearningCourseWithModules = Course & {
    module_groups?: CourseLearningModuleGroup[];
    modules?: CourseLearningModule[];
};

export type LearningProgress = {
    completed: number;
    total: number;
    percentage: number;
};

export type CourseLearningPageProps = {
    course: CourseLearningCourseWithModules;
    initialModuleSortOrder?: number | null;
    currentModule?: CourseLearningModule | null;
    isEnrolled: boolean;
    emptyState?: string | null;
    navigation?: {
        previous?: {
            sort_order?: number | null;
            title: string;
            is_preview?: boolean;
            is_locked?: boolean;
        } | null;
        next?: {
            sort_order?: number | null;
            title: string;
            is_preview?: boolean;
            is_locked?: boolean;
        } | null;
    };
    progress: LearningProgress;
    completedModuleIds: number[];
};


export type CourseProps = {
    courses: CursorPagination<Course>;
    categories: Category[];
};