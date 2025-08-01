import { redirect } from 'next/navigation';

export default async function Page({ params }) {
  const { o_id } = await params;
  redirect(`/projects/${o_id}/overview`);
}
