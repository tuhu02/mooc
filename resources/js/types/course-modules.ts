export type CourseModuleAssignment = {
    id: number;
    title: string;
    description?: string | null;
    type?: string | null;
};

export type CourseModule = {
    id: number;
    title: string;
    description?: string | null;
    video?: string | null;
    duration?: number | null;
    thumbnail?: string | null;
    attachment?: string | null;
    is_preview: boolean;
    sort_order: number;
    assignments?: CourseModuleAssignment[];
};

export type CourseWithModules = {
    id: number;
    title: string;
    description?: string;
    modules: CourseModule[];
};

export type CreateCourseModuleForm = {
    course_id: number;
    title: string;
    description: string;
    video: string;
    is_preview: boolean;
    duration: string;
    thumbnail: File | null;
    attachment: File | null;
    assignment_title: string;
    assignment_instruction: string;
    assignment_type: string;
    from: 'course-show';
};

export type EditCourseModuleForm = {
    _method: 'PUT';
    course_id: number;
    title: string;
    description: string;
    video: string;
    duration: string;
    thumbnail: File | null;
    attachment: File | null;
    is_preview: boolean;
    assignment_title: string;
    assignment_instruction: string;
    assignment_type: string;
    from: 'course-show';
};

export type CourseShowPageProps = {
    course: CourseWithModules;
};
