export type Mentor = {
    id: number,
    institution: string,
    gender: string,
    date_of_birth: string,
    bio: string,
    user_id: number,
    user: {
        id: number;
        name: string;
        email: string;
        address: string;
    }
    avatar?: string | null;
}

export type Category = {
    id: number;
    name: string;
}

export type Submission = {
    id: number;
    assignment_id: number;
    submission_name?: string | null;
    file?: string | null;
    feedback?: string | null;
    status?: 'submitted' | 'reviewed' | 'revision_required';
    reviewed_at?: string | null;
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
    submission?: Submission | null;
};


export type CourseType = 'default' | 'live';

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
    type?: CourseType; // default: 'default', options: 'default' | 'live'
};

export type Module = {
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
    assignments?: Assignment[];
};


export type ModuleGroup = {
    id: number;
    title: string;
    modules: Module[];
};

export type CourseWithModules = Course & {
    module_groups?: ModuleGroup[];
    modules?: Module[];
};

export type Props = {
    course: CourseWithModules;
    initialModuleSortOrder?: number | null;
    currentModule?: Module | null;
    isEnrolled: boolean;
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
};
