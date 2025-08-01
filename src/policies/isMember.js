import 'server-only';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { getDB } from '@/database';

export default async function isMember({params}){
  // Get real authentication session
  const session = await auth();
  const db = getDB();
  
  if (!session?.user) {
    redirect('/login');
  }
  
  // Find membership for the authenticated user in the requested project
  let membership = await db.Members.findOne({
    where:{
      user: session.user.id,
      project: params?.o_id,
    },
    raw: true,
  });
  
  // If no membership found, user doesn't have access to this project
  if (!membership) {
    throw new Error('Unauthorized - Not a member of this project');
  }
  
  // Get project details
  let project = await db.Projects.findOne({
    where:{
      id: params.o_id
    },
    raw: true,
  });
  
  // If project doesn't exist
  if (!project) {
    throw new Error('Organization not found');
  }

  return {session, project, membership};
}