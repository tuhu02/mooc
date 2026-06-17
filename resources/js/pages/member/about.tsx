import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/member-layout';
import type { BreadcrumbItem } from '@/types';
import { dashboard } from '@/routes/member';
import {
    Target,
    Eye,
    Heart,
    Users,
    BookOpen,
    Award,
    Sparkles,
    Rocket,
    Shield,
    Globe,
    Mail,
    MapPin,
    Phone,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'About Us', href: '#' },
];

const stats = [
    { label: 'Active Students', value: '12,500+', icon: Users, color: 'text-blue-500' },
    { label: 'Courses Available', value: '350+', icon: BookOpen, color: 'text-green-500' },
    { label: 'Expert Mentors', value: '85+', icon: Award, color: 'text-yellow-500' },
    { label: 'Countries Reached', value: '24', icon: Globe, color: 'text-purple-500' },
];

const values = [
    {
        icon: Target,
        title: 'Mission',
        description:
            'Memberdayakan setiap individu untuk berkembang melalui pembelajaran berkualitas yang dapat diakses kapan saja dan di mana saja.',
        color: 'bg-blue-500/10 text-blue-500',
    },
    {
        icon: Eye,
        title: 'Vision',
        description:
            'Menjadi platform pembelajaran online terdepan yang menghubungkan pelajar dengan mentor terbaik di seluruh dunia.',
        color: 'bg-purple-500/10 text-purple-500',
    },
    {
        icon: Heart,
        title: 'Values',
        description:
            'Kami percaya pada integritas, inovasi, dan inklusivitas dalam setiap langkah perjalanan pembelajaran.',
        color: 'bg-red-500/10 text-red-500',
    },
];

const features = [
    {
        icon: Sparkles,
        title: 'Pembelajaran Interaktif',
        description: 'Metode belajar modern dengan video, quiz, dan praktik langsung.',
    },
    {
        icon: Rocket,
        title: 'Mentor Berpengalaman',
        description: 'Belajar langsung dari praktisi industri yang ahli di bidangnya.',
    },
    {
        icon: Shield,
        title: 'Sertifikat Resmi',
        description: 'Dapatkan sertifikat yang diakui setelah menyelesaikan kursus.',
    },
    {
        icon: Globe,
        title: 'Akses Selamanya',
        description: 'Belajar dengan ritme sendiri, akses materi tanpa batas waktu.',
    },
];

const team = [
    { name: 'Ahmad Rizki', role: 'Founder & CEO', initials: 'AR' },
    { name: 'Siti Nurhaliza', role: 'Head of Education', initials: 'SN' },
    { name: 'Budi Santoso', role: 'CTO', initials: 'BS' },
    { name: 'Maya Putri', role: 'Head of Mentors', initials: 'MP' },
];

export default function AboutUs() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="About Us" />

            <div className="flex flex-col gap-8 p-4 md:p-6">
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-background border p-8 md:p-12">
                    <div className="relative z-10 max-w-3xl">
                        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary mb-4">
                            <Sparkles className="h-3 w-3" />
                            Tentang Kami
                        </div>
                        <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
                            Membangun Masa Depan Melalui{' '}
                            <span className="text-primary">Pendidikan Digital</span>
                        </h1>
                        <p className="text-muted-foreground text-base md:text-lg">
                            Kami adalah platform pembelajaran online yang berkomitmen
                            menghadirkan pengalaman belajar terbaik untuk semua orang,
                            kapan saja dan di mana saja.
                        </p>
                    </div>
                    <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
                    <div className="absolute -bottom-20 right-20 h-48 w-48 rounded-full bg-purple-500/10 blur-3xl" />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {stats.map((stat, i) => {
                        const Icon = stat.icon;
                        return (
                            <div
                                key={i}
                                className="rounded-xl border bg-card p-4 md:p-6 hover:shadow-md transition-shadow"
                            >
                                <div className={`inline-flex p-2 rounded-lg bg-muted mb-3 ${stat.color}`}>
                                    <Icon className="h-5 w-5" />
                                </div>
                                <p className="text-xs md:text-sm text-muted-foreground">
                                    {stat.label}
                                </p>
                                <p className="text-2xl md:text-3xl font-bold mt-1">
                                    {stat.value}
                                </p>
                            </div>
                        );
                    })}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {values.map((v, i) => {
                        const Icon = v.icon;
                        return (
                            <div
                                key={i}
                                className="rounded-xl border bg-card p-6 hover:shadow-md transition-shadow"
                            >
                                <div className={`inline-flex p-3 rounded-xl ${v.color} mb-4`}>
                                    <Icon className="h-6 w-6" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">{v.title}</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    {v.description}
                                </p>
                            </div>
                        );
                    })}
                </div>

                <div className="rounded-xl border bg-card p-6 md:p-8">
                    <h2 className="text-2xl font-bold mb-4">Cerita Kami</h2>
                    <div className="space-y-4 text-muted-foreground leading-relaxed">
                        <p>
                            Berawal dari sebuah ide sederhana di tahun 2020, kami melihat
                            betapa sulitnya akses pendidikan berkualitas bagi banyak orang.
                            Dari sini, kami berkomitmen untuk membangun platform yang
                            menghubungkan pelajar dengan mentor terbaik.
                        </p>
                        <p>
                            Hari ini, kami telah membantu ribuan pelajar di berbagai negara
                            untuk mengembangkan skill, mengejar karir impian, dan mencapai
                            potensi terbaik mereka. Perjalanan kami baru dimulai.
                        </p>
                    </div>
                </div>

                <div>
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold">Kenapa Memilih Kami?</h2>
                        <p className="text-muted-foreground mt-1">
                            Keunggulan yang membuat kami berbeda
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {features.map((f, i) => {
                            const Icon = f.icon;
                            return (
                                <div
                                    key={i}
                                    className="flex gap-4 rounded-xl border bg-card p-5 hover:shadow-md transition-shadow"
                                >
                                    <div className="shrink-0 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                        <Icon className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold mb-1">{f.title}</h3>
                                        <p className="text-sm text-muted-foreground">
                                            {f.description}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Team */}
                <div>
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold">Tim Kami</h2>
                        <p className="text-muted-foreground mt-1">
                            Orang-orang hebat di balik platform ini
                        </p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {team.map((m, i) => (
                            <div
                                key={i}
                                className="rounded-xl border bg-card p-5 text-center hover:shadow-md transition-shadow"
                            >
                                <div className="mx-auto mb-3 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-purple-500 text-white font-semibold text-lg">
                                    {m.initials}
                                </div>
                                <h3 className="font-semibold">{m.name}</h3>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {m.role}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="rounded-2xl border bg-gradient-to-br from-primary/10 to-purple-500/10 p-6 md:p-8">
                    <div className="flex flex-col md:flex-row gap-6 md:items-center md:justify-between">
                        <div>
                            <h2 className="text-2xl font-bold mb-2">
                                Punya Pertanyaan?
                            </h2>
                            <p className="text-muted-foreground">
                                Tim kami siap membantu kamu kapan saja
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 mt-4 text-sm">
                                <div className="flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-primary" />
                                    <span>hello@example.com</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Phone className="h-4 w-4 text-primary" />
                                    <span>+62 812 3456 7890</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-primary" />
                                    <span>Jakarta, Indonesia</span>
                                </div>
                            </div>
                        </div>
                        <Button size="lg">Hubungi Kami</Button>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
