import General from './General';
import isMember from "@/policies/isMember";

export async function generateMetadata() {
    return { title: `General Settings | org setting` }
}

export default async function SettingsPage({ params }) {
    const resolvedParams = await params;
    const { org } = await isMember({ params: resolvedParams });
    
    if (!org) {
        return <div>Organization not found</div>;
    }

    return <General params={resolvedParams} org={org} />;
}