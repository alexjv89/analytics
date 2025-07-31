import { redirect } from 'next/navigation';

export default async function Page({ params }) {
  const { o_id } = await params;
  redirect(`/orgs/${o_id}/overview`);
}
