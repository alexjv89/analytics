import isMember from "@/policies/isMember";
import { getDB } from "@/database";
import async from "async";
import ListMembers from './ListMembers';


export async function generateMetadata({ params,searchParams}) {
	const resolvedParams = await params;
	const resolvedSearchParams = await searchParams;
	return { title: `Members | org setting`}
}

export default async function Page({params,searchParams}){
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const {session,org}=await isMember({params: resolvedParams});
  const db = getDB();
  
  // Get members with their associated users in a single query
  
  let workflow={
    getMembers:async function(){
      const members = await db.Members.findAll({
        where: {
          org: org.id
        },
        // include: {
        //   user: true
        // },
        order: [['createdAt', 'DESC']],
        raw:true,
      });
      return members;
    },
    getUsers:['getMembers',async function(results){
      const user_ids = results.getMembers.map((m)=>m.user);
      const users = await db.Users.findAll({
        where:{
          id:user_ids
        },
        raw:true,
      })
      results.getMembers.forEach((m)=>{
        users.forEach((u)=>{
          if(m.user==u.id)
            m.user=u;
        })
      })
      console.log(users);
      return users;
    }]
  }
  const results = await async.auto(workflow);
  return(<ListMembers params={resolvedParams} org={org} searchParams={resolvedSearchParams} members={results.getMembers}/>)
}