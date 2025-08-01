'use client';

import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import AppSidebar from '@/components/navigation/AppSidebar';

export default function AppLayout({ children, user, signOut }) {
  return (
    <SidebarProvider>
      {user && <AppSidebar user={user} signOut={signOut} />}
      <SidebarInset>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}