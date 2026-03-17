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

export type Mentor = {
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

export type PageProps = {
    role?: Role;
    member?: Member;
    mentor?: Mentor;
};
