import { usePage } from '@inertiajs/react';
import { useEcho } from '@laravel/echo-react';
import { toast } from 'sonner';

type EmailChangedPayload = {
    message?: string;
};

export default function RealtimeEmailChangedListener() {
    const {
        auth: { user },
    } = usePage<{ auth: { user: { id: number } } }>().props;

    useEcho(
        `user.${user.id}`,
        'EmailChanged',
        (payload: EmailChangedPayload) => {
            toast.info(
                payload.message ?? 'Email kamu telah diubah oleh admin.',
            );
        },
        [user.id],
    );

    return null;
}
