import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
} from '@/components/ui/pagination';
import { Link } from '@inertiajs/react';
import { CursorPagination } from '@/types';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export function PaginationComponent({
    pagination,
}: {
    pagination: Pick<
        CursorPagination<unknown>,
        'next_page_url' | 'prev_page_url'
    >;
}) {
    return (
        <Pagination>
            <PaginationContent>
                <PaginationItem>
                    <PaginationLink
                        asChild
                        size="default"
                        aria-label="Go to previous page"
                        aria-disabled={!pagination.prev_page_url}
                        tabIndex={pagination.prev_page_url ? undefined : -1}
                        className={cn(
                            'gap-1 px-2.5 sm:pl-2.5',
                            !pagination.prev_page_url &&
                                'pointer-events-none opacity-50',
                        )}
                    >
                        {pagination.prev_page_url ? (
                            <Link
                                preserveScroll
                                href={pagination.prev_page_url}
                            >
                                <ChevronLeftIcon />
                                <span className="hidden sm:block">
                                    Previous
                                </span>
                            </Link>
                        ) : (
                            <span>
                                <ChevronLeftIcon />
                                <span className="hidden sm:block">
                                    Previous
                                </span>
                            </span>
                        )}
                    </PaginationLink>
                </PaginationItem>

                <PaginationItem>
                    <PaginationLink
                        asChild
                        size="default"
                        aria-label="Go to next page"
                        aria-disabled={!pagination.next_page_url}
                        tabIndex={pagination.next_page_url ? undefined : -1}
                        className={cn(
                            'gap-1 px-2.5 sm:pr-2.5',
                            !pagination.next_page_url &&
                                'pointer-events-none opacity-50',
                        )}
                    >
                        {pagination.next_page_url ? (
                            <Link
                                preserveScroll
                                href={pagination.next_page_url}
                            >
                                <span className="hidden sm:block">Next</span>
                                <ChevronRightIcon />
                            </Link>
                        ) : (
                            <span>
                                <span className="hidden sm:block">Next</span>
                                <ChevronRightIcon />
                            </span>
                        )}
                    </PaginationLink>
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
}
