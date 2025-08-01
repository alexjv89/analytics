import "server-only";
import { redirect } from 'next/navigation';
import loginRequired from '@/policies/loginRequired';

export default async function Home() {
  // Require authentication before redirecting
  await loginRequired();
  redirect('/projects');
}