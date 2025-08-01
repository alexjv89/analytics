"use client";

import * as React from "react";
import { ChevronsUpDown } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useParams, useRouter } from "next/navigation";
import { getOrg, getProjects } from '@/components/Navbar/Sidebar/action';
import { Skeleton } from "@/components/ui/skeleton";

// Cache projects list at module level to persist across re-renders
let cachedProjects = null;
let projectsPromise = null;

export function OrgSwitcher() {
  const { isMobile } = useSidebar();
  const params = useParams();
  const router = useRouter();
  const { o_id } = params;
  const [org, setOrg] = React.useState(null);
  const [listProjects, setListProjects] = React.useState(cachedProjects || []);
  const [loading, setLoading] = React.useState(!cachedProjects);

  // Fetch current org only when o_id changes
  React.useEffect(() => {
    if (!params?.o_id) {
      setOrg(null);
      return;
    }

    const fetchOrg = async () => {
      try {
        const data = await getOrg({ params });
        setOrg(data.org);
      } catch (error) {
        console.error('Failed to fetch org:', error);
      }
    };
    
    fetchOrg();
  }, [params?.o_id]);

  // Fetch projects list only once and cache it
  React.useEffect(() => {
    // If we already have cached projects, don't fetch again
    if (cachedProjects) {
      setListProjects(cachedProjects);
      setLoading(false);
      return;
    }

    // If there's already a pending request, wait for it
    if (projectsPromise) {
      projectsPromise
        .then((data) => {
          setListProjects(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Failed to fetch projects:', error);
          setLoading(false);
        });
      return;
    }

    // Start a new request and cache the promise
    projectsPromise = getProjects()
      .then((data) => {
        const projects = data || [];
        cachedProjects = projects; // Cache the result
        setListProjects(projects);
        setLoading(false);
        return projects;
      })
      .catch((error) => {
        console.error('Failed to fetch projects:', error);
        setLoading(false);
        projectsPromise = null; // Reset promise on error
        throw error;
      });
  }, []); // Empty dependency array is correct here since we only want to fetch once

  const handleOrgChange = React.useCallback((orgId) => {
    const selectedOrg = listProjects.find((o) => o.id === orgId);
    if (selectedOrg) {
      setOrg(selectedOrg);
      router.push(`/projects/${orgId}/overview`);
    }
  }, [listProjects, router]);

  // Loading state
  if (loading && params?.o_id) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg">
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              <span className="text-sm font-semibold">...</span>
            </div>
            <Skeleton className="h-8 flex-1" />
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  // Only show if we have projects and are in an org context
  if (!listProjects.length || !params?.o_id) {
    return null;
  }

  // Find current org from the list
  const activeOrg = org || listProjects.find(o => o.id == o_id) || listProjects[0];

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <span className="text-sm font-semibold">
                  {activeOrg?.name?.charAt(0) || 'O'}
                </span>
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {activeOrg?.name || 'Select Project'}
                </span>
                <span className="truncate text-xs">
                  {listProjects.length} organization{listProjects.length !== 1 ? 's' : ''}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Projects
            </DropdownMenuLabel>
            {listProjects.map((orgItem) => (
              <DropdownMenuItem
                key={orgItem.id}
                onClick={() => handleOrgChange(orgItem.id)}
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-sm border">
                  <span className="text-xs font-semibold">
                    {orgItem.name?.charAt(0) || 'O'}
                  </span>
                </div>
                <span className="truncate">{orgItem.name}</span>
                {orgItem.id == o_id && (
                  <DropdownMenuShortcut>✓</DropdownMenuShortcut>
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

export default OrgSwitcher;