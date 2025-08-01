import 'server-only';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function loginRequired(){
	const session = await auth();
	const user = session?.user;
	if(!user)
		redirect('/login');
	return user;

}