'use client';
import { Typography } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";

export default function Logo({ offering = 'Cashflowy', href = '/', className = '' }) {
  return (
    <div className={cn("inline-block rounded-lg", className)}>
      <Link href={href} className="no-underline border-none">
        <div className="flex flex-row items-center">
          <Image
            src="/logo.svg"
            alt="Cashflowy"
            className="border-2 border-black p-1 rounded-lg"
            width={16}
            height={16}
          />
          {offering !== '' && (
            <Typography variant="h4" className="px-2">
              {offering}
            </Typography>
          )}
        </div>
      </Link>
    </div>
  )
}