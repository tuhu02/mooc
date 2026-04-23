export function Field({
    className = '',
    ...props
}: React.ComponentProps<'div'>) {
    return <div className={`space-y-2 ${className}`} {...props} />;
}

export function FieldLabel({
    className = '',
    ...props
}: React.ComponentProps<'label'>) {
    return (
        <label
            className={`text-sm font-semibold text-slate-900 ${className}`}
            {...props}
        />
    );
}

export function FieldDescription({
    className = '',
    ...props
}: React.ComponentProps<'p'>) {
    return <p className={`text-xs text-slate-500 ${className}`} {...props} />;
}
