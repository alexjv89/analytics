import 'server-only';
import Navbar from './Navbar';
import { redirect } from 'next/navigation'
import { auth, signOut } from '@/auth';
import AppLayout from '@/components/layout/AppLayout';

async function signOutFn() {
  'use server'
  await signOut()
  redirect('/login')
}

export default async function NavbarContainer({children}){
  const session = await auth();
  
  if (!session?.user) {
    return (
      <>
        <Navbar user={session?.user} signOut={signOutFn}/> 
        <main className="pt-10">
          {children}
        </main>
      </>
    );
  }

  return (
    <AppLayout user={session?.user} signOut={signOutFn}>
      {children}
    </AppLayout>
  );
}