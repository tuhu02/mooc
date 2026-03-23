export default function FooterSection() {
    return (
        <footer className="border-t border-slate-200 bg-slate-50 py-12 dark:border-slate-800 dark:bg-slate-950">
            <div className="mx-auto max-w-7xl px-4 text-center md:px-8">
                <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
                    <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-black text-xs font-bold text-white dark:bg-white dark:text-black">
                            IGS
                        </div>
                        <span className="font-bold tracking-tight text-slate-900 dark:text-white">
                            MOOC
                        </span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        © 2026 IGS MOOC. All rights reserved.
                    </p>
                    <div className="flex gap-6 text-sm font-medium text-slate-500 dark:text-slate-400">
                        <a
                            href="#"
                            className="transition hover:text-slate-900 dark:hover:text-white"
                        >
                            Privacy Policy
                        </a>
                        <a
                            href="#"
                            className="transition hover:text-slate-900 dark:hover:text-white"
                        >
                            Terms of Service
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
