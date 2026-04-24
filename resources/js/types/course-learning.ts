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
};

export type Module = {
    id: number;
    course_id?: number;
    sort_order?: number | null;
    title: string;
    is_preview?: boolean;
    thumbnail?: string | null;
    video?: string | null;
    description?: string | null;
    duration?: number | null;
    attachment?: string | null;
    created_at?: string;
    updated_at?: string;
    course?: Course;
    assignments?: Assignment[];
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
    navigation?: {
        previous?: {
            sort_order?: number | null;
            title: string;
        } | null;
        next?: {
            sort_order?: number | null;
            title: string;
        } | null;
    };
};
