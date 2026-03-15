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
    user_id: number,
    user: {
        id: number;
        name: string;
        email: string;
        institution: string;
        address: string;
        gender: string;
        date_of_birth: string;
    }
}

export type PageProps = {
    role?: Role;
    member?: Member;
};
