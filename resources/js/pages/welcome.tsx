import { Head, Link, usePage } from '@inertiajs/react';
import { dashboard, login, register } from '@/routes';
import {
    BookOpen,
    GraduationCap,
    Lightbulb,
    Users,
    ArrowRight,
    CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, type Variants } from 'framer-motion';

export default function Welcome({
    canRegister = true,
}: {
    canRegister?: boolean;
}) {
    const { auth } = usePage().props;

    const features = [
        {
            icon: (
                <Lightbulb className="h-6 w-6 text-slate-900 dark:text-white" />
            ),
            title: 'Flexible Learning',
            desc: 'Access high-quality materials anytime, anywhere, at your own pace.',
        },
        {
            icon: <Users className="h-6 w-6 text-slate-900 dark:text-white" />,
            title: 'Expert Mentors',
            desc: 'Get guided directly by industry professionals and creative experts.',
        },
        {
            icon: (
                <GraduationCap className="h-6 w-6 text-slate-900 dark:text-white" />
            ),
            title: 'Professional Certification',
            desc: 'Earn recognized certificates to boost your career and portfolio.',
        },
    ];

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants: Variants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: 'spring',
                stiffness: 100,
                damping: 15,
            },
        },
    };

    return (
        <div className="min-h-screen bg-white text-slate-900 selection:bg-slate-200 selection:text-slate-900 dark:bg-slate-950 dark:text-slate-100 dark:selection:bg-slate-800 dark:selection:text-slate-100">
            <Head title="Welcome to IGS MOOC" />

            <motion.nav
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                    type: 'spring',
                    stiffness: 120,
                    damping: 20,
                    delay: 0.1,
                }}
                className="fixed top-0 z-50 w-full border-b border-slate-200 bg-white/90 opacity-0 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/90"
                style={{ opacity: 1 }}
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
                            <Link href={dashboard().url}>
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
                                    Sign in
                                </Link>
                                {canRegister && (
                                    <Link href={register().url}>
                                        <Button className="rounded-full bg-slate-900 px-6 text-white transition-all hover:scale-105 hover:bg-black active:scale-95 dark:bg-white dark:text-black dark:hover:bg-slate-200">
                                            Join for Free
                                        </Button>
                                    </Link>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </motion.nav>

            <header className="relative overflow-hidden pt-32 pb-16 md:pt-48 md:pb-32">
                <div className="absolute top-0 left-1/2 -z-10 h-150 w-full -translate-x-1/2 opacity-50 [background:radial-gradient(50%_50%_at_50%_50%,#f3f4f6_0%,#ffffff_100%)] dark:[background:radial-gradient(50%_50%_at_50%_50%,#1e293b_0%,#020617_100%)]" />

                <div className="mx-auto max-w-7xl px-4 text-center md:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="opacity-0"
                        style={{ opacity: 1 }}
                    >
                        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-300 bg-slate-100/50 px-3 py-1 text-sm font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-300">
                            <span className="relative flex h-2 w-2">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-slate-400 opacity-75 dark:bg-slate-500"></span>
                                <span className="relative inline-flex h-2 w-2 rounded-full bg-slate-600 dark:bg-slate-400"></span>
                            </span>
                            New: Advanced Business & Digital Marketing courses
                            are now live!
                        </div>

                        <h1 className="mx-auto max-w-4xl text-5xl font-extrabold tracking-tight md:text-7xl dark:text-white">
                            Elevate Your{' '}
                            <span className="text-slate-700 dark:text-slate-400">
                                Future Skills
                            </span>{' '}
                            With Us
                        </h1>

                        <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600 md:text-xl dark:text-slate-400">
                            The ultimate interactive online learning platform.
                            From Design & Marketing to Technology and
                            Leadership, master the skills that matter today.
                        </p>

                        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                            <Link href={register().url}>
                                <Button
                                    size="lg"
                                    className="h-12 rounded-full bg-black px-8 text-base font-semibold text-white shadow-lg shadow-slate-300 transition-transform hover:scale-105 hover:bg-slate-800 active:scale-95 dark:bg-white dark:text-black dark:shadow-none dark:hover:bg-slate-200"
                                >
                                    Start Learning Now{' '}
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                            <Button
                                variant="outline"
                                size="lg"
                                className="h-12 rounded-full border-2 border-slate-900 px-8 text-base font-semibold text-slate-900 transition-all hover:scale-105 hover:bg-slate-100 active:scale-95 dark:border-white dark:text-white dark:hover:bg-slate-800"
                            >
                                Browse Catalog
                            </Button>
                        </div>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.3, margin: '-50px' }}
                        variants={containerVariants}
                        className="mt-20 grid grid-cols-2 gap-8 border-t border-slate-200 pt-12 md:grid-cols-4 dark:border-slate-800"
                    >
                        {[
                            { label: 'Active Learners', value: '10,000+' },
                            { label: 'Online Courses', value: '150+' },
                            { label: 'Expert Mentors', value: '45+' },
                            { label: 'Satisfaction Rate', value: '4.9/5' },
                        ].map((stat, i) => (
                            <motion.div
                                key={i}
                                variants={itemVariants}
                                className="opacity-0 will-change-transform"
                            >
                                <p className="text-3xl font-bold text-black dark:text-white">
                                    {stat.value}
                                </p>
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                    {stat.label}
                                </p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </header>

            <section className="bg-white py-24 dark:bg-slate-950">
                <div className="mx-auto max-w-7xl px-4 md:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ duration: 0.5 }}
                        className="mb-16 text-center opacity-0"
                        style={{ opacity: 1 }}
                    >
                        <h2 className="text-3xl font-bold text-slate-900 md:text-4xl dark:text-white">
                            Why Study at IGS MOOC?
                        </h2>
                        <p className="mt-4 text-slate-600 dark:text-slate-400">
                            We provide a comprehensive learning ecosystem built
                            for career growth and personal development.
                        </p>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2, margin: '-50px' }}
                        variants={containerVariants}
                        className="grid gap-8 md:grid-cols-3"
                    >
                        {features.map((feature, i) => (
                            <motion.div
                                key={i}
                                variants={itemVariants}
                                whileHover={{ y: -8 }}
                                className="rounded-2xl border border-slate-200 bg-slate-50 p-8 opacity-0 shadow-sm transition-colors duration-300 will-change-transform dark:border-slate-800 dark:bg-slate-900/50 dark:hover:border-slate-700"
                            >
                                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-200 dark:bg-slate-800">
                                    {feature.icon}
                                </div>
                                <h3 className="mb-3 text-xl font-bold text-slate-900 dark:text-white">
                                    {feature.title}
                                </h3>
                                <p className="leading-relaxed text-slate-600 dark:text-slate-400">
                                    {feature.desc}
                                </p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            <section className="border-y border-slate-200 bg-slate-100 py-24 dark:border-slate-800 dark:bg-slate-900/30">
                <div className="mx-auto max-w-7xl px-4 md:px-8">
                    <div className="mb-12 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, amount: 0.5 }}
                            transition={{ duration: 0.5 }}
                            className="opacity-0"
                            style={{ opacity: 1 }}
                        >
                            <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold tracking-wide text-slate-700 uppercase dark:bg-slate-800 dark:text-slate-300">
                                <BookOpen className="h-4 w-4" />
                                Learning Journey
                            </p>
                            <h2 className="text-3xl font-bold text-black md:text-4xl dark:text-white">
                                Guided & Structured Roadmaps
                            </h2>
                        </motion.div>
                        <motion.p
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, amount: 0.5 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="max-w-md text-sm leading-relaxed text-slate-600 opacity-0 md:text-base dark:text-slate-400"
                            style={{ opacity: 1 }}
                        >
                            Every student follows a step-by-step path, ensuring
                            measurable progress from fundamentals to job-ready
                            skills.
                        </motion.p>
                    </div>
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.3, margin: '-50px' }}
                        variants={containerVariants}
                        className="grid gap-6 md:grid-cols-3"
                    >
                        {[
                            {
                                title: 'Foundations First',
                                desc: 'Master core concepts, modern tools, and professional workflows systematically.',
                            },
                            {
                                title: 'Hands-on Projects',
                                desc: 'Build real-world projects and case studies that simulate industry demands.',
                            },
                            {
                                title: 'Career Portfolio',
                                desc: 'Craft your best work and receive expert feedback to launch your professional career.',
                            },
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                variants={itemVariants}
                                whileHover={{ scale: 1.03 }}
                                className="rounded-2xl border border-slate-300 bg-white p-6 opacity-0 shadow-sm transition-colors duration-300 will-change-transform dark:border-slate-700 dark:bg-slate-900"
                            >
                                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-black text-white dark:bg-white dark:text-black">
                                    <CheckCircle2 className="h-5 w-5" />
                                </div>
                                <h3 className="mb-2 text-xl font-bold text-slate-900 dark:text-white">
                                    {item.title}
                                </h3>
                                <p className="text-sm leading-relaxed text-slate-600 md:text-base dark:text-slate-400">
                                    {item.desc}
                                </p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            <section className="bg-black py-24 text-white dark:bg-white dark:text-black">
                <div className="mx-auto max-w-5xl px-4 text-center md:px-8">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true, amount: 0.5 }}
                        className="opacity-0"
                        style={{ opacity: 1 }}
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
                                <Link href={dashboard().url}>
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

            <footer className="border-t border-slate-200 bg-slate-50 py-12 dark:border-slate-800 dark:bg-slate-950">
                <div className="mx-auto max-w-7xl px-4 text-center md:px-8">
                    <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
                        <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-black text-xs font-bold text-white dark:bg-white dark:text-black">
                                IGS
                            </div>
                            <span className="font-bold tracking-tight text-slate-900 dark:text-white">
                                MOOC
                            </span>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            © 2026 IGS MOOC. All rights reserved.
                        </p>
                        <div className="flex gap-6 text-sm font-medium text-slate-500 dark:text-slate-400">
                            <a
                                href="#"
                                className="transition hover:text-slate-900 dark:hover:text-white"
                            >
                                Privacy Policy
                            </a>
                            <a
                                href="#"
                                className="transition hover:text-slate-900 dark:hover:text-white"
                            >
                                Terms of Service
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
