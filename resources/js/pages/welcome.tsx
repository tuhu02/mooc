import { Head, Link, usePage } from '@inertiajs/react';
import { GraduationCap, Lightbulb, Users } from 'lucide-react';
import { motion, type Variants } from 'framer-motion';
import WelcomeNav from '@/components/welcome/welcome-nav';
import HeroSection from '@/components/welcome/hero-section';
import FeaturesSection from '@/components/welcome/feature-section';
import RoadmapSection from '@/components/welcome/roadmap-section';
import FeaturedCourses from '@/components/welcome/featured-courses';
import CTASection from '@/components/welcome/cta-section';
import FooterSection from '@/components/welcome/footer-section';
import { Course } from '@/types';

export default function Welcome({
    canRegister = true,
    courses,
}: {
    canRegister?: boolean;
    courses: Course[];
}) {
    const { auth } = usePage().props;

    return (
        <div className="min-h-screen bg-white text-slate-900 selection:bg-slate-200 selection:text-slate-900 dark:bg-slate-950 dark:text-slate-100 dark:selection:bg-slate-800 dark:selection:text-slate-100">
            <Head title="Welcome to IGS MOOC" />

            <WelcomeNav auth={auth} canRegister={canRegister} />

            <HeroSection canRegister={canRegister} />

            <FeaturesSection />

            <RoadmapSection />

            <FeaturedCourses courses={courses} />

            <CTASection auth={auth} canRegister={canRegister} />

            <FooterSection />
        </div>
    );
}
