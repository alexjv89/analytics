import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import Login from './Login'

export default async function LoginPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const session = await auth()
  
  // If user is already authenticated, redirect to main app
  if (session?.user) {
    redirect('/orgs')
  }

  return <Login searchParams={resolvedSearchParams} />
}