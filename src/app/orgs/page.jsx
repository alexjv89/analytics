import "server-only";
import ListOrgs from "./ListOrgs";
import async from "async";
import loginRequired from "@/policies/loginRequired";
import { getDB } from "@/database";

export default async function OrgsPage() {
  const user = await loginRequired();
  const db = getDB();
  
  const workflow = {
    getMembers:async ()=>{
      const member = await db.Members.findAll({where: {user: user.id}, raw: true});
      return member;
    },
    getOrgs:["getMembers", async (results)=>{
      let OrgsIds = results.getMembers.map((member)=>member.org);
      const orgs = await db.Orgs.findAll({where: {id: OrgsIds},raw: true});
      return orgs;
    }]
  }
  const results = await async.auto(workflow);
    
  return <ListOrgs orgs={results.getOrgs} />;
}