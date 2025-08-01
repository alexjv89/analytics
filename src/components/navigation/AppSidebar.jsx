'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import { 
  Settings, 
  Building2, 
  CircleDollarSign, 
  FileText, 
  Filter, 
  BarChart3,
  ChevronRight
} from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  useSidebar,
} from '@/components/ui/sidebar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import OrgSwitcher from '@/components/navigation/OrgSwitcher';
import { NavUser } from '@/components/navigation/NavUser';
import OnboardingCard from '@/components/navigation/OnboardingCard';
import { getOrg, getOnboardingCounts } from '@/components/Navbar/Sidebar/action';

// Navigation items configuration
const getNavigationItems = (orgId) => [
  {
    title: "Transactions",
    url: `/projects/${orgId}/transactions`,
    icon: CircleDollarSign,
    slug: "transactions"
  },
  {
    title: "Accounts", 
    url: `/projects/${orgId}/accounts`,
    icon: Building2,
    slug: "accounts"
  },
  {
    title: "Statements",
    url: `/projects/${orgId}/statements`, 
    icon: FileText,
    slug: "statements"
  },
  {
    title: "Automation Rules",
    url: `/projects/${orgId}/rules`,
    icon: Filter,
    slug: "rules"
  },
  {
    title: "Reports",
    url: `/projects/${orgId}/reports`,
    icon: BarChart3,
    slug: "reports",
    items: [
      {
        title: "Cashflow",
        url: `/projects/${orgId}/reports/cashflow`,
      },
      {
        title: "Cashflow2", 
        url: `/projects/${orgId}/reports/cashflow2`,
      },
      {
        title: "Balance",
        url: `/projects/${orgId}/reports/balance`,
      },
      {
        title: "Overview",
        url: `/projects/${orgId}/reports/overview`,
      },
      {
        title: "Income",
        items: [
          {
            title: "by Category",
            url: `/projects/${orgId}/reports/income/by_category`,
          },
          {
            title: "by Entity", 
            url: `/projects/${orgId}/reports/income/by_entity`,
          }
        ]
      },
      {
        title: "Expense",
        items: [
          {
            title: "by Category",
            url: `/projects/${orgId}/reports/expense/by_category`,
          },
          {
            title: "by Entity",
            url: `/projects/${orgId}/reports/expense/by_entity`, 
          }
        ]
      },
      {
        title: "Asset",
        items: [
          {
            title: "by Category",
            url: `/projects/${orgId}/reports/asset/by_category`,
          },
          {
            title: "by Entity",
            url: `/projects/${orgId}/reports/asset/by_entity`,
          }
        ]
      },
      {
        title: "Liability", 
        items: [
          {
            title: "by Category",
            url: `/projects/${orgId}/reports/liability/by_category`,
          },
          {
            title: "by Entity",
            url: `/projects/${orgId}/reports/liability/by_entity`,
          }
        ]
      },
      {
        title: "Transfer",
        items: [
          {
            title: "by Category",
            url: `/projects/${orgId}/reports/transfer/by_category`,
          }
        ]
      },
      {
        title: "Unknown",
        items: [
          {
            title: "by Entity",
            url: `/projects/${orgId}/reports/unknown/by_entity`,
          }
        ]
      }
    ]
  },
  {
    title: "Settings",
    url: `/projects/${orgId}/settings`,
    icon: Settings,
    slug: "settings"
  }
];

function NavItem({ item, pathname }) {
  const sectionPath = pathname.split('/').splice(0, 4).join('/');
  const isSectionActive = sectionPath === item.url;

  if (item.items) {
    const isReportsExpanded = pathname.includes('/reports/');
    
    return (
      <Collapsible defaultOpen={isReportsExpanded} className="group/collapsible">
        <SidebarMenuItem>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton 
              tooltip={item.title}
              isActive={isSectionActive}
              className="w-full"
            >
              {item.icon && <item.icon size={16} />}
              <span>{item.title}</span>
              <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenuSub>
              {item.items.map((subItem) => (
                <NavSubItem key={subItem.title} item={subItem} pathname={pathname} />
              ))}
            </SidebarMenuSub>
          </CollapsibleContent>
        </SidebarMenuItem>
      </Collapsible>
    );
  }

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild tooltip={item.title} isActive={isSectionActive}>
        <Link href={item.url}>
          {item.icon && <item.icon size={16} />}
          <span>{item.title}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

function NavSubItem({ item, pathname }) {
  if (item.items) {
    const isExpanded = pathname.includes(`/reports/${item.title.toLowerCase()}`);
    
    return (
      <Collapsible defaultOpen={isExpanded} className="group/collapsible">
        <SidebarMenuSubItem>
          <CollapsibleTrigger asChild>
            <SidebarMenuSubButton className="w-full">
              <span>{item.title}</span>
              <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
            </SidebarMenuSubButton>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenuSub>
              {item.items.map((nestedItem) => (
                <SidebarMenuSubItem key={nestedItem.title}>
                  <SidebarMenuSubButton asChild isActive={pathname === nestedItem.url}>
                    <Link href={nestedItem.url}>
                      <span>{nestedItem.title}</span>
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              ))}
            </SidebarMenuSub>
          </CollapsibleContent>
        </SidebarMenuSubItem>
      </Collapsible>
    );
  }

  return (
    <SidebarMenuSubItem>
      <SidebarMenuSubButton asChild isActive={pathname === item.url}>
        <Link href={item.url}>
          <span>{item.title}</span>
        </Link>
      </SidebarMenuSubButton>
    </SidebarMenuSubItem>
  );
}

export default function AppSidebar({ user, signOut, ...props }) {
  const params = useParams();
  const pathname = usePathname();
  const { state } = useSidebar();
  const [org, setOrg] = useState({});
  const [counts, setCounts] = useState({ accounts: 0, transaction_types: 0, statements: 0 });

  const isCollapsed = state === "collapsed";

  // Fetch org data and feature flags
  useEffect(() => {
    const fetchOrg = async () => {
      if (params?.o_id) {
        try {
          const data = await getOrg({ params });
          setOrg(data.org || {});
        } catch (err) {
          console.error('Error fetching org:', err);
        }
      }
    };

    fetchOrg();
  }, [params?.o_id]);

  // Fetch onboarding counts when org shows onboarding
  useEffect(() => {
    const fetchCounts = async () => {
      if (org?.feature_flags?.show_onboarding) {
        try {
          const data = await getOnboardingCounts({ params });
          setCounts(data);
        } catch (err) {
          console.error('Error fetching onboarding counts:', err);
        }
      }
    };
    fetchCounts();
  }, [pathname, org?.feature_flags?.show_onboarding]);

  const navigationItems = params?.o_id ? getNavigationItems(params.w_id) : [];

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <OrgSwitcher />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <NavItem 
                  key={item.slug || item.title} 
                  item={item} 
                  pathname={pathname}
                />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="space-y-2">
        {/* Show onboarding card if org has feature flag enabled and sidebar is not collapsed */}
        {org?.id && 
         org.feature_flags?.show_onboarding && 
         !isCollapsed && 
         <OnboardingCard counts={counts} params={params} />
        }
        <NavUser user={user} signOut={signOut} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}