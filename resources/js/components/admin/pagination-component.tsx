import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
} from '@/components/ui/pagination';
import { Link } from '@inertiajs/react';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LaravelPaginationLink } from '@/types';

export function PaginationComponent({
    links,
}: {
    links: LaravelPaginationLink[];
}) {
    const previousLink = links[0];
    const nextLink = links[links.length - 1];
    const pageLinks = links.slice(1, -1);

    return (
        <Pagination>
            <PaginationContent>
                <PaginationItem>
                    <PaginationLink
                        asChild
                        size="default"
                        aria-label="Go to previous page"
                        aria-disabled={!previousLink?.url}
                        tabIndex={previousLink?.url ? undefined : -1}
                        className={cn(
                            'gap-1 px-2.5 sm:pl-2.5',
                            !previousLink?.url &&
                                'pointer-events-none opacity-50',
                        )}
                    >
                        {previousLink?.url ? (
                            <Link href={previousLink.url}>
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
                {pageLinks.map((link, i) => (
                    <PaginationItem key={i}>
                        <PaginationLink
                            asChild
                            isActive={link.active}
                            aria-disabled={!link.url}
                            tabIndex={link.url ? undefined : -1}
                            className={cn(
                                !link.url && 'pointer-events-none opacity-50',
                            )}
                        >
                            {link.url ? (
                                <Link
                                    href={link.url}
                                    dangerouslySetInnerHTML={{
                                        __html: link.label,
                                    }}
                                />
                            ) : (
                                <span
                                    dangerouslySetInnerHTML={{
                                        __html: link.label,
                                    }}
                                />
                            )}
                        </PaginationLink>
                    </PaginationItem>
                ))}
                <PaginationItem>
                    <PaginationLink
                        asChild
                        size="default"
                        aria-label="Go to next page"
                        aria-disabled={!nextLink?.url}
                        tabIndex={nextLink?.url ? undefined : -1}
                        className={cn(
                            'gap-1 px-2.5 sm:pr-2.5',
                            !nextLink?.url && 'pointer-events-none opacity-50',
                        )}
                    >
                        {nextLink?.url ? (
                            <Link href={nextLink.url}>
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
