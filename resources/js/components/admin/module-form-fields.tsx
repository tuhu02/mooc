import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import MDEditor from '@uiw/react-md-editor';

interface ModuleFormFieldsProps {
    prefix: 'create' | 'edit';
    title: string;
    video: string;
    duration: string;
    description: string;
    available_at: string | null;
    courseType: string;
    onTitleChange: (value: string) => void;
    onVideoChange: (value: string) => void;
    onDurationChange: (value: string) => void;
    onDescriptionChange: (value: string) => void;
    onAvailableAtChange: (value: string | null) => void;
    errors: {
        title?: string;
        video?: string;
        duration?: string;
        description?: string;
        available_at?: string;
    };
}

export function ModuleFormFields({
    prefix,
    title,
    video,
    duration,
    description,
    available_at,
    courseType,
    onTitleChange,
    onVideoChange,
    onDurationChange,
    onDescriptionChange,
    onAvailableAtChange,
    errors,
}: ModuleFormFieldsProps) {
    const idPrefix = `${prefix}-`;

    return (
        <>
            <div className="grid gap-2">
                <Label htmlFor={`${idPrefix}title`}>Judul</Label>
                <Input
                    id={`${idPrefix}title`}
                    value={title}
                    onChange={(e) => onTitleChange(e.target.value)}
                    placeholder="Masukkan judul modul"
                />
                {errors.title && (
                    <p className="text-sm font-medium text-red-500">
                        {errors.title}
                    </p>
                )}
            </div>

            <div className="grid gap-2">
                <Label htmlFor={`${idPrefix}video`}>Link Video</Label>
                <Input
                    id={`${idPrefix}video`}
                    type="url"
                    value={video}
                    onChange={(e) => onVideoChange(e.target.value)}
                    placeholder="https://..."
                />
                {errors.video && (
                    <p className="text-sm font-medium text-red-500">
                        {errors.video}
                    </p>
                )}
            </div>

            <div className="grid gap-2">
                <Label htmlFor={`${idPrefix}duration`}>Durasi (menit)</Label>
                <Input
                    id={`${idPrefix}duration`}
                    type="number"
                    min={0}
                    value={duration}
                    onChange={(e) => onDurationChange(e.target.value)}
                    placeholder="Contoh: 30"
                />
                {errors.duration && (
                    <p className="text-sm font-medium text-red-500">
                        {errors.duration}
                    </p>
                )}
            </div>

            <div className="grid gap-2" data-color-mode="light">
                <Label htmlFor={`${idPrefix}description`}>Deskripsi</Label>
                <MDEditor
                    value={description}
                    onChange={(value) => onDescriptionChange(value ?? '')}
                    preview="edit"
                    visibleDragbar={false}
                    textareaProps={{
                        id: `${idPrefix}description`,
                        placeholder: 'Tulis deskripsi dengan markdown...',
                    }}
                    height={280}
                />
                {errors.description && (
                    <p className="text-sm font-medium text-red-500">
                        {errors.description}
                    </p>
                )}
            </div>

            {courseType === 'event' && (
                <div className="grid gap-2">
                    <Label htmlFor={`${idPrefix}available-at`}>
                        Jadwal Tayang (untuk Event)
                    </Label>
                    <Input
                        id={`${idPrefix}available-at`}
                        type="datetime-local"
                        value={available_at ? available_at.slice(0, 16) : ''}
                        onChange={(e) =>
                            onAvailableAtChange(
                                e.target.value ? `${e.target.value}:00` : null,
                            )
                        }
                        placeholder="Pilih tanggal dan waktu tayang"
                    />
                    <p className="text-xs text-slate-500">
                        Modul hanya bisa dibuka setelah waktu yang ditentukan.
                        Biarkan kosong untuk langsung tersedia.
                    </p>
                    {errors.available_at && (
                        <p className="text-sm font-medium text-red-500">
                            {errors.available_at}
                        </p>
                    )}
                </div>
            )}
        </>
    );
}
