'use client';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Typography } from '@/components/ui/typography';
import { usePathname, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function Pagination({ pageCount, currentPage: propCurrentPage }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = propCurrentPage || parseInt(searchParams.get('page') || '1');
  const createPageURL = (pageNumber) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  const isPreviousDisabled = currentPage === 1;
  const isNextDisabled = currentPage === pageCount;

  return (
    <div className="flex justify-between items-center h-10 mt-2">
      {isPreviousDisabled ? (
        <Button
          variant="outline"
          size="sm"
          disabled={true}
        >
          Previous
        </Button>
      ) : (
        <Button
          asChild
          variant="outline"
          size="sm"
        >
          <Link href={createPageURL(currentPage - 1)}>
            Previous
          </Link>
        </Button>
      )}
      
      <Typography variant="small" className="text-muted-foreground">
        Page {currentPage} of {pageCount}
      </Typography>
      
      {isNextDisabled ? (
        <Button
          variant="outline"
          size="sm"
          disabled={true}
        >
          Next
        </Button>
      ) : (
        <Button
          asChild
          variant="outline"
          size="sm"
        >
          <Link href={createPageURL(currentPage + 1)}>
            Next
          </Link>
        </Button>
      )}
    </div>
  );
};
