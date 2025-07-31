'use server'
import { revalidatePath } from 'next/cache'
import isMember from "@/policies/isMember";
import { getDB } from "@/database";
import async from "async";

export async function addMember({formData,params}){
	const {session,org}=await isMember({params});
	const db = getDB();
	let email = formData.get('email');
	var user = await db.Users.findOne({
		where:{
			email:email,
		},
		raw:true,
	})

	if(!user)
		return {status:'failed',message:'user does not exist.'}

	let m = {
		user:user.id,
		org:org.id
	}
	var membership = await db.Members.create(m)

	revalidatePath(`/orgs/${org.id}/settings/members`, 'page');
	return {status:'success',message:'Added user to the org'}
}


export async function revokeMember({formData, params}){
	const {session,org} = await isMember({params});
	const db = getDB();
	let membership_id = formData.get('membership');

	try {
		await db.Members.destroy({
			where: {
				id: membership_id,
				org: org.id
			}
		});

		revalidatePath(`/orgs/${org.id}/settings/members`, 'page');
		return {status:'success', message:'Member removed from the org'}
	} catch(error) {
		console.error("Error revoking member:", error);
		return {status:'failed', message: error.message}
	}
}