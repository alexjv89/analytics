"use client";

import OrgCard from "./_components/OrgCard";
import CreateOrg from "./_components/CreateOrg";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, Plus } from "lucide-react";
import PageHeader from '@/components/PageHeader';
import MainContainer from '@/components/layout/MainContainer';
export default function ListOrgs({ orgs }) {
  const RightButtons = function () {
    return <><CreateOrg /></>
  }
  
  return (
    <MainContainer>
      <div className="max-w-full lg:max-w-[70vw] mx-auto">
        <div className="flex flex-col gap-8">
          <PageHeader header="Select Org" RightButtons={RightButtons} />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {orgs.map((org) => (
              <OrgCard
                key={org.id}
                org_id={org.id}
                name={org.name}
                createdAt={org.created_at}
              />
            ))}
          </div>
          
          {orgs.length === 0 && (
            <Card className="h-[70vh] bg-white">
              <CardContent className="flex flex-col items-center justify-center h-full gap-4">
                <Building2 className="h-24 w-24 text-gray-400" />
                <p className="text-sm text-muted-foreground">No organisations found.</p>
                <CreateOrg />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </MainContainer>
  );
}
