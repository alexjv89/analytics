import isMember from "@/policies/isMember";
import CreateAPIKey from "./CreateAPIKey";

export const generateMetadata = async ({ params }) => {
    const resolvedParams = await params;
    return { title: "api key | org setting" }
}
export default async function Page({ params }) {
    const resolvedParams = await params;
    const {session,org}=await isMember({params: resolvedParams});
    return <CreateAPIKey org={org} params={resolvedParams} />
}
