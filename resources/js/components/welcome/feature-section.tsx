import { Lightbulb, Users, GraduationCap } from 'lucide-react';
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

const features = [
    {
        icon: <Lightbulb className="h-6 w-6 text-slate-900 dark:text-white" />,
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

export default function FeaturesSection() {
    return (
        <section className="bg-white py-24 dark:bg-slate-950">
            <div className="mx-auto max-w-7xl px-4 md:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.5 }}
                    className="mb-16 text-center"
                >
                    <h2 className="text-3xl font-bold text-slate-900 md:text-4xl dark:text-white">
                        Why Study at IGS MOOC?
                    </h2>
                    <p className="mt-4 text-slate-600 dark:text-slate-400">
                        We provide a comprehensive learning ecosystem built for
                        career growth and personal development.
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
                            className="rounded-2xl border border-slate-200 bg-slate-50 p-8 shadow-sm transition-colors duration-300 will-change-transform dark:border-slate-800 dark:bg-slate-900/50 dark:hover:border-slate-700"
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
    );
}
