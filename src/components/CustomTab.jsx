'use client'
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

/** 
 * Our implementation of tabs. This is the tab format that we will be using across the app.
 */
export default function CustomTab({tabs=[], variant='plain', tabName='tab'}) {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState(() => {
    const tabParam = searchParams.get(tabName);
    if (tabParam) {
      const index = tabs.findIndex(tab => tab.slug === tabParam);
      return index !== -1 ? tabs[index].slug : (tabs[0]?.slug || '');
    }
    return tabs[0]?.slug || '';
  });

  useEffect(() => {
    const tabParam = searchParams.get(tabName);
    if (tabParam) {
      const tabExists = tabs.find(tab => tab.slug === tabParam);
      setActiveTab(tabExists ? tabParam : (tabs[0]?.slug || ''));
    }
  }, [searchParams, tabs, tabName]);

  const handleTabChange = (newValue) => {
    setActiveTab(newValue);
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set(tabName, newValue);
    window.history.pushState(null, '', `?${newSearchParams.toString()}`);
  };

  return (
    <Tabs 
      value={activeTab} 
      onValueChange={handleTabChange}
      className="w-full"
    >
      <div className="w-full border-b border-border bg-white">
        <TabsList 
          className={cn(
            "h-auto bg-transparent p-0 justify-start rounded-none border-0",
            "overflow-x-auto flex-nowrap min-w-fit w-fit",
            "[-webkit-scrollbar]:hidden [scrollbar-width:none] [-ms-overflow-style:none]"
          )}
        >
          {tabs.map((tab) => (
            <TabsTrigger 
              key={tab.slug}
              value={tab.slug}
              className={cn(
                "relative rounded-none border-0 bg-transparent px-4 py-3",
                "text-sm font-medium text-muted-foreground transition-all",
                "hover:text-foreground focus-visible:outline-none focus-visible:ring-2",
                "focus-visible:ring-ring focus-visible:ring-offset-2",
                "disabled:pointer-events-none disabled:opacity-50",
                "data-[state=active]:text-foreground data-[state=active]:bg-transparent",
                "data-[state=active]:shadow-none",
                "sm:text-xs sm:px-3 sm:py-2",
                "flex items-center gap-2 whitespace-nowrap min-h-[40px]",
                "after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5",
                "after:bg-transparent after:transition-colors",
                "data-[state=active]:after:bg-primary"
              )}
            >
              {tab.name}
              {tab.stats && (
                <Badge size='sm' variant='outline' className="ml-1">
                  {tab.stats}
                </Badge>
              )}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
      
      {tabs.map((tab) => (
        <TabsContent 
          key={tab.slug}
          value={tab.slug}
          className={cn(
            "mt-0 bg-white",
          )}
        >
          {tab.body}
        </TabsContent>
      ))}
    </Tabs>
  )
}
