import { Link } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import { login, register } from '@/routes';
import member from '@/routes/member';
import admin from '@/routes/admin';
import mentor from '@/routes/mentor';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { FormEvent, useState } from 'react';

type Props = {
    auth: { user: any };
    canRegister?: boolean;
};

export default function WelcomeNav({ auth, canRegister = true }: Props) {
    const [keyword, setKeyword] = useState('');

    const getDashboardHref = () => {
        if (!auth.user) return null;

        if (auth.user.type === 'admin') {
            return admin.dashboard().url;
        } else if (auth.user.type === 'mentor') {
            return mentor.dashboard().url;
        }
        return member.dashboard().url;
    };

    const dashboardHref = getDashboardHref();

    const handleSearch = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const search = keyword.trim();
        const url = member.courses.index.url({
            query: search ? { q: search } : {},
        });

        router.visit(url);
    };

    return (
        <motion.nav
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
                type: 'spring',
                stiffness: 120,
                damping: 20,
                delay: 0.1,
            }}
            className="fixed top-0 z-50 w-full border-b border-slate-200 bg-white/90 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/90"
        >
            <div className="mx-auto flex max-w-7xl items-center justify-between p-4 md:px-8">
                <div className="flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black font-bold text-white dark:bg-white dark:text-black">
                        IGS
                    </div>
                    <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                        MOOC
                    </span>
                </div>

                <div className="hidden items-center gap-6 lg:flex">
                    <Link
                        href="/"
                        className="text-sm font-semibold text-slate-700 transition hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
                    >
                        Home
                    </Link>

                    <Link
                        href="/courses"
                        className="text-sm font-semibold text-slate-700 transition hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
                    >
                        About
                    </Link>

                    <Link
                        href="/courses"
                        className="text-sm font-semibold text-slate-700 transition hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
                    >
                        Courses
                    </Link>

                    <Link
                        href="/courses"
                        className="text-sm font-semibold text-slate-700 transition hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
                    >
                        Faq
                    </Link>

                    <form
                        onSubmit={handleSearch}
                        className="relative w-56 transition-all duration-300 ease-out focus-within:w-80"
                    >
                        <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            value={keyword}
                            onChange={(event) => setKeyword(event.target.value)}
                            placeholder="Cari course, mentor, kategori..."
                            className="h-10 w-full rounded-full border border-slate-300 bg-white py-2 pr-4 pl-9 text-sm text-slate-800 transition-all duration-300 ease-out placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-200 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-slate-500 dark:focus:ring-slate-700"
                        />
                    </form>
                </div>

                <div className="flex items-center gap-4">
                    {auth.user ? (
                        <Link href={dashboardHref || '/'}>
                            <Button className="rounded-full bg-black px-6 text-white hover:bg-slate-800 dark:bg-white dark:text-black dark:hover:bg-slate-200">
                                Dashboard
                            </Button>
                        </Link>
                    ) : (
                        <>
                            <Link
                                href={login().url}
                                className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                            >
                                Login
                            </Link>
                            {canRegister && (
                                <Link href={register().url}>
                                    <Button className="rounded-full bg-black px-6 text-white hover:bg-slate-800 dark:bg-white dark:text-black dark:hover:bg-slate-200">
                                        Register
                                    </Button>
                                </Link>
                            )}
                        </>
                    )}
                </div>
            </div>
        </motion.nav>
    );
}
