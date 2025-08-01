"use server";
import { auth } from '@/auth';
import isMember from '@/policies/isMember';
import { getDB } from "@/database";
import async from 'async';

async function _getOnboardingCounts(o_id){
  const db = getDB();
  var where = {
    org: o_id
  }
  var workflow = {
    getAccountsCount: async () => {
      return await db.Accounts.count({
        where: where
      });
    },
    getStatementCount: async () => {
      return await db.Statements.count({
        where: where
      });
    },
    getTransactionTypesCount: async () => {
      return await db.Transactions.count({
        distinct: true,
        col: 'type',
        where: where
      });
    }
  }
  let results = await async.auto(workflow);
  let count = {
    accounts: results.getAccountsCount,
    statements: results.getStatementCount,
    transaction_types: results.getTransactionTypesCount
  }
  return count;
}

export async function getOnboardingCounts({params}){
  const {session,org}=await isMember({params});
  let counts = await _getOnboardingCounts(org.id);
  return counts;
}

export async function getOrg({params}){
  const session = await auth();
  const db = getDB();
  
  if (!session?.user) {
    // Return null values instead of throwing error when not authenticated
    return {membership: null, org: null, count: null};
  }
  
  let membership = await db.Members.findOne({
    where:{
      user:session?.user?.id,
      org:params?.o_id,
    },
    raw:true,
  })
  
  let org;
  let count = null;
  
  if(membership){
    org = await db.Projects.findOne({
      attributes: ['id', 'name', 'description', 'feature_flags'],
      where: {
        id: params?.o_id
      },
      raw: true,
    })
    count = await _getOnboardingCounts(params.w_id)
  }
  
  return {membership,org,count};
}

export async function getProjects(){
  const session = await auth();
  const db = getDB();
  
  if (!session?.user) {
    // Return empty array instead of throwing error when not authenticated
    return [];
  }
  
  const workflow = {
    getMembers:async ()=>{
      const member = await db.Members.findAll({where: {user: session?.user?.id}});
      return member;
    },
    getProjects:["getMembers", async (results)=>{
      let ProjectsIds = results.getMembers.map((member)=>member.org);
      const orgs = await db.Projects.findAll({where: {id: ProjectsIds},raw: true});
      return orgs;
    }]
  }
  const results = await async.auto(workflow);
  return results.getProjects;
}

export async function hideOnboarding({params}){
  const {session,org}=await isMember({params});
  const db = getDB();
  let updated_feature_flags = {...org.feature_flags,...{show_onboarding:false}};
  try{

    await db.Projects.update(
      { feature_flags:updated_feature_flags },
      { where: { id: org.id } }
    );
    return {status:'success',message:'flag updated'};
  }catch(e){
    return {status:'success',message:e.message}
  }
}