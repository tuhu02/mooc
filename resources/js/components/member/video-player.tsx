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
    title: string;
};

export default function VideoPlayer({ videoUrl, title }: Props) {
    return (
        <iframe
            src={getVideoEmbedUrl(videoUrl)}
            title={title}
            className="aspect-video w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            loading="lazy"
        />
    );
}
