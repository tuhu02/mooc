import { Link } from '@inertiajs/react';
import { register } from '@/routes';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, type Variants } from 'framer-motion';

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

type Props = {
    canRegister?: boolean;
};

export default function HeroSection({ canRegister = true }: Props) {
    return (
        <header className="relative overflow-hidden pt-32 pb-16 md:pt-48 md:pb-32">
            <div className="absolute top-0 left-1/2 -z-10 h-150 w-full -translate-x-1/2 opacity-50 [background:radial-gradient(50%_50%_at_50%_50%,#f3f4f6_0%,#ffffff_100%)] dark:[background:radial-gradient(50%_50%_at_50%_50%,#1e293b_0%,#020617_100%)]" />

            <div className="mx-auto max-w-7xl px-4 text-center md:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                >
                    <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-300 bg-slate-100/50 px-3 py-1 text-sm font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-300">
                        <span className="relative flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-slate-400 opacity-75 dark:bg-slate-500"></span>
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-slate-600 dark:bg-slate-400"></span>
                        </span>
                        Baru: Kelas Bisnis Lanjutan & Digital Marketing sudah
                        tersedia!
                    </div>

                    <h1 className="mx-auto max-w-4xl text-5xl font-extrabold tracking-tight md:text-7xl dark:text-white">
                        Tingkatkan{' '}
                        <span className="text-slate-700 dark:text-slate-400">
                            Skill Masa Depan
                        </span>{' '}
                        Bersama Kami
                    </h1>

                    <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600 md:text-xl dark:text-slate-400">
                        Platform belajar online interaktif untuk pengembangan
                        karier. Dari Desain & Marketing hingga Teknologi dan
                        Kepemimpinan, kuasai keterampilan yang relevan saat ini.
                    </p>

                    <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                        {canRegister && (
                            <Link href={register().url}>
                                <Button
                                    size="lg"
                                    className="h-12 rounded-full bg-black px-8 text-base font-semibold text-white shadow-lg shadow-slate-300 transition-transform hover:scale-105 hover:bg-slate-800 active:scale-95 dark:bg-white dark:text-black dark:shadow-none dark:hover:bg-slate-200"
                                >
                                    Mulai Belajar Sekarang
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                        )}
                        <Button
                            variant="outline"
                            size="lg"
                            className="h-12 rounded-full border-2 border-slate-900 px-8 text-base font-semibold text-slate-900 transition-all hover:scale-105 hover:bg-slate-100 active:scale-95 dark:border-white dark:text-white dark:hover:bg-slate-800"
                        >
                            Jelajahi Katalog
                        </Button>
                    </div>
                </motion.div>

                {/* Stats */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3, margin: '-50px' }}
                    variants={containerVariants}
                    className="mt-20 grid grid-cols-2 gap-8 border-t border-slate-200 pt-12 md:grid-cols-4 dark:border-slate-800"
                >
                    {[
                        { label: 'Peserta Aktif', value: '10.000+' },
                        { label: 'Kursus Online', value: '150+' },
                        { label: 'Mentor Ahli', value: '45+' },
                        { label: 'Tingkat Kepuasan', value: '4,9/5' },
                    ].map((stat, i) => (
                        <motion.div
                            key={i}
                            variants={itemVariants}
                            className="will-change-transform"
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
    );
}
