import { useState } from 'react';

function getVideoEmbedUrl(videoUrl: string) {
    try {
        const url = new URL(videoUrl);

        if (url.hostname.includes('youtube.com')) {
            const videoId = url.searchParams.get('v');
            if (videoId) return `https://www.youtube.com/embed/${videoId}`;
        }

        if (url.hostname === 'youtu.be') {
            const videoId = url.pathname.replace('/', '');
            if (videoId) return `https://www.youtube.com/embed/${videoId}`;
        }

        if (url.hostname.includes('vimeo.com')) {
            const videoId = url.pathname.split('/').filter(Boolean).pop();
            if (videoId) return `https://player.vimeo.com/video/${videoId}`;
        }

        return videoUrl;
    } catch {
        return videoUrl;
    }
}

type Props = {
    videoUrl: string;
    thumbnail?: string | null;
    title: string;
};

export default function VideoPlayer({ videoUrl, thumbnail, title }: Props) {
    const [playing, setPlaying] = useState(false);

    if (!thumbnail || playing) {
        return (
            <iframe
                src={
                    playing
                        ? getVideoEmbedUrl(videoUrl) + '?autoplay=1'
                        : getVideoEmbedUrl(videoUrl)
                }
                title={title}
                className="aspect-video w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                loading="lazy"
            />
        );
    }

    return (
        <div
            className="relative aspect-video w-full cursor-pointer"
            onClick={() => setPlaying(true)}
        >
            <img
                src={`/storage/${thumbnail}`}
                alt={title}
                className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 transition hover:bg-black/40">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 shadow-lg transition hover:scale-105 hover:bg-white">
                    <svg
                        className="ml-1 h-7 w-7 text-slate-800"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path d="M8 5v14l11-7z" />
                    </svg>
                </div>
            </div>
        </div>
    );
}
