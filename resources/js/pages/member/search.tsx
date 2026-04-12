import { BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/member-layout';
import { Head } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardAction,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '',
    },
];

export default function search() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Course" />
            <div className="flex flex-1 flex-col gap-6 p-4 md:p-8">
                <div className="flex">
                    <Card className="relative mx-auto w-full max-w-sm pt-0">
                        <div className="absolute inset-0 z-30 aspect-video bg-black/35" />
                        <img
                            src="https://avatar.vercel.sh/shadcn1"
                            alt="Event cover"
                            className="relative z-20 aspect-video w-full object-cover brightness-60 grayscale dark:brightness-40"
                        />
                        <CardHeader>
                            <CardAction>
                                <Badge variant="secondary">Featured</Badge>
                            </CardAction>
                            <CardTitle>Design systems meetup</CardTitle>
                            <CardDescription>
                                A practical talk on component APIs,
                                accessibility, and shipping faster.
                            </CardDescription>
                        </CardHeader>
                        <CardFooter>
                            <Button className="w-full">View Event</Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
