import "server-only";
import { redirect } from 'next/navigation';
import loginRequired from '@/policies/loginRequired';

// Force dynamic rendering to prevent static generation during build
export const dynamic = 'force-dynamic';

export default async function Home() {
  // Require authentication before redirecting
  await loginRequired();
  redirect('/projects');
}