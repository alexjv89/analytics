import "server-only";
import ListProjects from "./ListProjects";
import async from "async";
import loginRequired from "@/policies/loginRequired";
import { getDB } from "@/database";

export default async function ProjectsPage() {
  const user = await loginRequired();
  const db = getDB();
  
  const workflow = {
    getMembers:async ()=>{
      const member = await db.Members.findAll({where: {user: user.id}, raw: true});
      return member;
    },
    getProjects:["getMembers", async (results)=>{
      let ProjectsIds = results.getMembers.map((member)=>member.project);
      const projects = await db.Projects.findAll({where: {id: ProjectsIds},raw: true});
      return projects;
    }]
  }
  const results = await async.auto(workflow);
    
  return <ListProjects projects={results.getProjects} />;
}