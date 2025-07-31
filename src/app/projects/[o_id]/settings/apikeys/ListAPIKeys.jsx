'use client'
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, Plus } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import Table from '@/components/Table';
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import SettingsContainer from '../_components/SettingsContainer';
import SettingsNavigation from '../_components/SettingsNavigation';
import AppBreadcrumbs from '@/components/AppBreadcrumbs';
import MainContainer from '@/components/layout/MainContainer';
import { deleteApiKey } from './action';
import Link from 'next/link';


export default function APIKeys({ api_keys, org, params }) {
  const [alertMessage, setAlertMessage] = useState(null);
  const router = useRouter();

  const DeleteButton = ({ apiKey }) => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
      setLoading(true);
      const response = await deleteApiKey({ id: apiKey.id, orgId: org.id });
      if (response) {
        setOpen(false);
        setLoading(false);
        setAlertMessage({ type: 'success', message: 'API Key deleted successfully' });
        router.refresh();
      }
    }
    return (
      <>
        <Button variant="outline" size="sm" onClick={() => setOpen(true)} className="text-red-600 border-red-600 hover:bg-red-50">
          Delete
        </Button>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertTriangle size={20} className="text-red-500" />
                Confirm Action
              </DialogTitle>
              <DialogDescription>
                Do you want to delete the API key <strong>{apiKey.name}</strong>?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" disabled={loading} onClick={handleDelete}>
                {loading ? 'Deleting...' : 'Delete'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  const RightButtons = () => {
    return (
      <div className="flex gap-2">
        <Button variant="outline" size='sm' disabled>Documentation</Button>
        <Button asChild size='sm'>
          <Link href={`/orgs/${params.o_id}/settings/apikeys/create`}>
            <Plus size={16} className="mr-2" />
            Create new API Key
          </Link>
        </Button>
      </div>
    )
  }

  const NoAPIKeysMessage = () => {
    return (
      <Alert className="mb-4">
        <AlertTitle>You have not created any API keys yet</AlertTitle>
        <AlertDescription>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>API keys can be used for integrating this app with other applications</li>
            <li>Click &quot;Create new API Key&quot; button above to create a new API key</li>
            <li>Click &quot;Documentation&quot; button to read the API documentation</li>
          </ul>
        </AlertDescription>
      </Alert>
    )
  }


  const breadcrumbs = [
    { text: 'Orgs', href: '/orgs' },
    { text: `${org.name}`, href: `/orgs/${params.o_id}/settings` },
    { text: 'Settings', href: `/orgs/${params.o_id}/settings` },
    { text: 'API Keys' },
  ];

  const APIKeysContent = () => (
    <div className="space-y-6">
      {alertMessage && (
        <Alert className={alertMessage.type === 'success' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
          <AlertDescription>{alertMessage.message}</AlertDescription>
        </Alert>
      )}



            {!api_keys.length && <NoAPIKeysMessage />}
            {api_keys.length > 0 && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Created At</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Key</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {api_keys.map((api_key) => (
                    <TableRow key={api_key.id}>
                      <TableCell>{new Date(api_key.createdAt).toDateString()}</TableCell>
                      <TableCell>{api_key.name}</TableCell>
                      <TableCell className="font-mono text-sm">{api_key.key}</TableCell>
                      <TableCell><DeleteButton apiKey={api_key} /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        
  );

  return (
    <>
      <AppBreadcrumbs breadcrumbs={breadcrumbs} />
      <MainContainer>
        <div className="max-w-5xl">
          <PageHeader header='API Keys'RightButtons={RightButtons} />
          <SettingsContainer
            columnOne={<SettingsNavigation params={params} />}
            columnTwo={<APIKeysContent />}
          />
        </div>
      </MainContainer>
    </>
  );
}
