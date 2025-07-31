import isMember from "@/policies/isMember";
import ListAPIKeys from "./ListAPIKeys";
import { getDB } from "@/database";
import async from "async";

export async function generateMetadata({ params,searchParams}) {
	const resolvedParams = await params;
	const resolvedSearchParams = await searchParams;
	return { title: `Api keys | org setting`}
}

export default async function Page({params, searchParams}) {
	const resolvedParams = await params;
	const resolvedSearchParams = await searchParams;
	const {session,org}=await isMember({params: resolvedParams});
	const db = getDB();

	const workflow = {
		getApiKeys: async () => {
		    return await db.Api_keys.findAll({
		        where: {
		            org: org.id?.toString()
				},
				raw: true
			})
		}
	}

	const results = await async.auto(workflow);
	return <ListAPIKeys api_keys={results.getApiKeys} org={org} params={resolvedParams} />
}