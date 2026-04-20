import { BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, type Variants } from 'framer-motion';
import { Course } from '@/types';

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
    courses: Course[];
};

export default function FeaturedCourses({ courses }: Props) {
    return (
        <section className="bg-white py-24 dark:bg-slate-950">
            <div className="mx-auto max-w-7xl px-4 md:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: 0.5 }}
                    className="mb-12 text-center"
                >
                    <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-slate-300 bg-slate-100 px-3 py-1 text-xs font-semibold tracking-wide text-slate-700 uppercase dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-300">
                        <BookOpen className="h-4 w-4" />
                        Kursus Unggulan
                    </p>
                    <h2 className="text-3xl font-bold text-slate-900 md:text-4xl dark:text-white">
                        Jelajahi Jalur Belajar Populer
                    </h2>
                    <p className="mx-auto mt-4 max-w-2xl text-slate-600 dark:text-slate-400">
                        Program terkurasi untuk membangun skill praktis dan
                        hasil yang siap masuk portofolio.
                    </p>
                </motion.div>

                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2, margin: '-50px' }}
                    variants={containerVariants}
                    className="grid gap-6 md:grid-cols-3"
                >
                    {courses.map((course) => {
                        const thumbnailUrl = course.thumbnail?.startsWith(
                            'http',
                        )
                            ? course.thumbnail
                            : `/storage/${course.thumbnail}`;

                        return (
                            <motion.article
                                key={course.id}
                                variants={itemVariants}
                                whileHover={{ y: -6 }}
                                className="rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm transition-colors duration-300 will-change-transform dark:border-slate-800 dark:bg-slate-900/50"
                            >
                                <img
                                    src={thumbnailUrl}
                                    alt={course.title}
                                    className="mb-4 h-44 w-full rounded-xl object-cover"
                                    loading="lazy"
                                />
                                <div className="mb-4 flex flex-wrap gap-2">
                                    {course.categories &&
                                    course.categories.length > 0 ? (
                                        <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold tracking-wide text-slate-700 uppercase dark:bg-slate-800 dark:text-slate-300">
                                            {course.categories[0].name}
                                        </span>
                                    ) : (
                                        <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-700">
                                            Tanpa Kategori
                                        </span>
                                    )}
                                </div>
                                <h3 className="mb-4 text-xl leading-snug font-bold text-slate-900 dark:text-white">
                                    {course.title}
                                </h3>
                                <p className="line-clamp-2">
                                    {course.description}
                                </p>

                                <Button
                                    variant="outline"
                                    className="mt-6 w-full border-slate-300 bg-transparent text-slate-900 hover:bg-slate-100 dark:border-slate-700 dark:text-white dark:hover:bg-slate-800"
                                >
                                    Lihat Kursus
                                </Button>
                            </motion.article>
                        );
                    })}
                </motion.div>
            </div>
        </section>
    );
}
