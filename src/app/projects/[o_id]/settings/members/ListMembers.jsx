'use client';
import Table from '@/components/Table';
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import PageHeader from '@/components/PageHeader';
import AddMember from './_components/AddMember';
import RevokeMember from './_components/RevokeMember';
import SettingsContainer from '../_components/SettingsContainer';
import SettingsNavigation from '../_components/SettingsNavigation';
import AppBreadcrumbs from '@/components/AppBreadcrumbs';
import MainContainer from '@/components/layout/MainContainer';

export default function ListMembers({ params, org, members }) {
	function RightButtons() {
		return (
			<AddMember params={params} />
		)
	}

	const breadcrumbs = [
		{ text: 'Projects', href: '/projects' },
		{ text: `${org.name}`, href: `/projects/${params.o_id}/settings` },
		{ text: 'Settings', href: `/projects/${params.o_id}/settings` },
		{ text: 'Members' },
	];

	const MembersContent = () => (
		<div className="space-y-6">

			<Table>
				<TableHeader>
					<TableRow>
						<TableHead className="w-40">Name</TableHead>
						<TableHead className="w-40">Email</TableHead>
						<TableHead className="w-40">Access</TableHead>
						<TableHead className="w-40">Actions</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{members.map((m) => (
						<TableRow key={m.id}>
							<TableCell>{m?.user?.name}</TableCell>
							<TableCell>{m?.user?.email}</TableCell>
							<TableCell>
								<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
									{m.access || 'admin'}
								</span>
							</TableCell>
							<TableCell>
								<RevokeMember member={m} params={params} />
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);

	return (
		<>
			<AppBreadcrumbs breadcrumbs={breadcrumbs} />
			<MainContainer>
				<div className="max-w-5xl">
					<PageHeader header="Members" RightButtons={<RightButtons />} />
					<SettingsContainer
						columnOne={<SettingsNavigation params={params} />}
						columnTwo={<MembersContent />}
					/>
				</div>
			</MainContainer>
		</>
	)
}