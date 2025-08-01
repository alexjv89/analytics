"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { formatDate } from "@/utils/helpers";
import Link from "next/link";


export default function OrgCard({ name, org_id, createdAt }){
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Card className="no-underline transition-all duration-100 ease-in-out hover:shadow-lg hover:bg-accent hover:-translate-y-0.5 cursor-pointer">
            <Link href={`/projects/${org_id}/transactions`} className="no-underline text-inherit">
              <CardContent className="">
                <h3 className="text-lg font-semibold leading-none truncate text-inherit">
                  {name}
                </h3>
                <p className="text-xs text-muted-foreground mt-2">
                  Created on {formatDate(createdAt, "date")}
                </p>
              </CardContent>
            </Link>
          </Card>
        </TooltipTrigger>
        <TooltipContent>
          <p>{name}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
