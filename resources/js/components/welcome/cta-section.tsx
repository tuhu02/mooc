import { Link } from '@inertiajs/react';
import { login, register } from '@/routes';
import member from '@/routes/member';
import admin from '@/routes/admin';
import mentor from '@/routes/mentor';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

type Props = {
    auth: { user: any };
    canRegister?: boolean;
};

export default function CTASection({ auth, canRegister = true }: Props) {
    const getDashboardHref = () => {
        if (!auth.user) return '/';

        if (auth.user.type === 'admin') {
            return admin.dashboard().url;
        }

        if (auth.user.type === 'mentor') {
            return mentor.dashboard().url;
        }

        return member.dashboard().url;
    };

    return (
        <section className="bg-black py-24 text-white dark:bg-white dark:text-black">
            <div className="mx-auto max-w-5xl px-4 text-center md:px-8">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{
                        duration: 0.5,
                        type: 'spring',
                        stiffness: 80,
                    }}
                >
                    <p className="mb-4 text-sm font-semibold tracking-[0.2em] text-slate-300 uppercase dark:text-slate-600">
                        Get Started
                    </p>
                    <h2 className="mx-auto max-w-3xl text-3xl leading-tight font-bold md:text-5xl">
                        Build Your Digital Expertise Today
                    </h2>
                    <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-300 md:text-lg dark:text-slate-600">
                        Join thousands of learners and start your learning
                        journey in minutes.
                    </p>

                    <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                        {auth.user ? (
                            <Link href={getDashboardHref()}>
                                <Button
                                    size="lg"
                                    className="h-12 rounded-full bg-white px-8 text-base font-semibold text-black transition-transform hover:scale-105 hover:bg-slate-200 active:scale-95 dark:bg-black dark:text-white dark:hover:bg-slate-800"
                                >
                                    Open Dashboard
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                        ) : (
                            <>
                                {canRegister && (
                                    <Link href={register().url}>
                                        <Button
                                            size="lg"
                                            className="h-12 rounded-full bg-white px-8 text-base font-semibold text-black transition-transform hover:scale-105 hover:bg-slate-200 active:scale-95 dark:bg-black dark:text-white dark:hover:bg-slate-800"
                                        >
                                            Sign Up for Free
                                            <ArrowRight className="ml-2 h-5 w-5" />
                                        </Button>
                                    </Link>
                                )}
                                <Link href={login().url}>
                                    <Button
                                        variant="outline"
                                        size="lg"
                                        className="h-12 rounded-full border-white bg-transparent px-8 text-base font-semibold text-white transition-all hover:bg-white hover:text-black dark:border-black dark:text-black dark:hover:bg-black dark:hover:text-white"
                                    >
                                        I Already Have an Account
                                    </Button>
                                </Link>
                            </>
                        )}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
