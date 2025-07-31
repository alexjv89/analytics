'use client';
import PageHeader from '@/components/PageHeader';
import Table from '@/components/Table';
import { TableBody, TableCell, TableRow } from '@/components/ui/table';
import SettingsContainer from './_components/SettingsContainer';
import SettingsNavigation from './_components/SettingsNavigation';
import AppBreadcrumbs from '@/components/AppBreadcrumbs';
import MainContainer from '@/components/layout/MainContainer';
import ShowJSON from '@/components/switchless/ShowJSON';

export default function General({ params, org }) {
    const breadcrumbs = [
        {text: 'Orgs', href: '/orgs'},
        {text: `${org.name}`, href: `/orgs/${params.o_id}/settings`}, 
        {text: 'Settings', href: `/orgs/${params.o_id}/settings`},
        {text: 'General'}, 
    ];

    const organizationData = [
        { label: 'Organization Name', value: org.name },
        { label: 'Created Date', value: new Date(org.created_at).toISOString().split('T')[0] },
        { label: 'Organization ID', value: org.id },
    ];

    const GeneralContent = () => (
                <Table type="sideHeader" variant="plain">
                    <TableBody>
                        {organizationData.map((item, index) => (
                            <TableRow key={index}>
                                <TableCell className="font-medium bg-gray-50 w-48">
                                    {item.label}
                                </TableCell>
                                <TableCell>{item.value}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
    );

    return (
        <>
            <AppBreadcrumbs breadcrumbs={breadcrumbs} />
            <MainContainer>
                <div className="max-w-5xl">
                    <PageHeader header="General" />
                    <SettingsContainer
                        columnOne={<SettingsNavigation params={params} />}
                        columnTwo={<GeneralContent />}
                    />
                </div>

            </MainContainer>
        </>
    );
}