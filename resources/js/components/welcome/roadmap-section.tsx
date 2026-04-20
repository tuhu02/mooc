import { BookOpen, CheckCircle2 } from 'lucide-react';
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

const roadmaps = [
    {
        title: 'Mulai dari Fondasi',
        desc: 'Kuasai konsep inti, alat modern, dan alur kerja profesional secara sistematis.',
    },
    {
        title: 'Proyek Praktik Langsung',
        desc: 'Bangun proyek nyata dan studi kasus yang mencerminkan kebutuhan industri.',
    },
    {
        title: 'Portofolio Karier',
        desc: 'Susun karya terbaik Anda dan dapatkan umpan balik ahli untuk memulai karier profesional.',
    },
];

export default function RoadmapSection() {
    return (
        <section className="border-y border-slate-200 bg-slate-100 py-24 dark:border-slate-800 dark:bg-slate-900/30">
            <div className="mx-auto max-w-7xl px-4 md:px-8">
                <div className="mb-12 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ duration: 0.5 }}
                    >
                        <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold tracking-wide text-slate-700 uppercase dark:bg-slate-800 dark:text-slate-300">
                            <BookOpen className="h-4 w-4" />
                            Perjalanan Belajar
                        </p>
                        <h2 className="text-3xl font-bold text-black md:text-4xl dark:text-white">
                            Roadmap Terarah & Terstruktur
                        </h2>
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="max-w-md text-sm leading-relaxed text-slate-600 md:text-base dark:text-slate-400"
                    >
                        Setiap peserta mengikuti jalur langkah demi langkah,
                        memastikan progres terukur dari dasar hingga siap kerja.
                    </motion.p>
                </div>

                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3, margin: '-50px' }}
                    variants={containerVariants}
                    className="grid gap-6 md:grid-cols-3"
                >
                    {roadmaps.map((item, i) => (
                        <motion.div
                            key={i}
                            variants={itemVariants}
                            whileHover={{ scale: 1.03 }}
                            className="rounded-2xl border border-slate-300 bg-white p-6 shadow-sm transition-colors duration-300 will-change-transform dark:border-slate-700 dark:bg-slate-900"
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
    );
}
