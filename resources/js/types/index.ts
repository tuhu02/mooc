export type * from './auth';
export type * from './navigation';
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
}

export type Member = {
    id: number,
    institution: string,
    gender: string,
    date_of_birth: string,
    user_id: number,
    user: {
        id: number;
        name: string;
        email: string;
        address: string;
    }
}

export type Admin = {
    id: number,
    user_id: number,
    user: {
        id: number;
        name: string;
        email: string;
    }
}

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

export type PageProps = {
    role?: Role;
    member?: Member;
    mentor?: Mentor;
};

export type Category = {
    id: number;
    name: string;
}

export type Course = {
    id: number;
    title: string;
    thumbnail: string;
    description: string;
    is_active: boolean;
    is_highlight: boolean;
    level: 'Beginner' | 'Intermediate' | 'Advanced' | null;
    mentor_id: number;
    mentor?: Mentor;
    categories?: Category[];
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


