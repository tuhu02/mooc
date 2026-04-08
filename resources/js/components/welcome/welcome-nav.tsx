import { Link } from '@inertiajs/react';
import { login, register } from '@/routes';
import member from '@/routes/member';
import admin from '@/routes/admin';
import mentor from '@/routes/mentor';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

type Props = {
    auth: { user: any };
    canRegister?: boolean;
};

export default function WelcomeNav({ auth, canRegister = true }: Props) {
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
