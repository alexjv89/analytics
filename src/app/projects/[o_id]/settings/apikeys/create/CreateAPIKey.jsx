'use client'
import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { Typography } from '@/components/ui/typography';
import { AlertTriangle, Key, CheckCircle } from 'lucide-react';
import AlertBox from '@/components/AlertBox';
import PageHeader from '@/components/PageHeader';
import { createApiKey } from '../action';
import AppBreadcrumbs from '@/components/AppBreadcrumbs';
import MainContainer from '@/components/layout/MainContainer';
export default function CreateAPIKey({ org, params }) {
  const [loading, setLoading] = useState(false);
  const formRef = useRef(null);

  const [showAPIData, setShowAPIData] = useState({ api_key: { name: '', key: '', secret: ''}});
  const [showForm, setShowForm] = useState(true);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData(e.target);
      const response = await createApiKey({
        orgId: org.id, 
        expires_at: formData.get('expires_at'), 
        name: formData.get('name')
      });

      if (response) {
        setShowForm(false);
        setShowAPIData({api_key: response});
      }
    } catch (error) {
      console.error('Error creating API key:', error);
    } finally {
      setLoading(false);
    }
  }

  const breadcrumbs = [
    { text: `${org.name}`, href: `/projects/${params.o_id}/settings` },
    { text: 'Settings', href: `/projects/${params.o_id}/settings` },
    { text: 'API Keys', href: `/projects/${params.o_id}/settings/apikeys` },
    { text: 'Create' }
  ]

  const APIKeyDetails = () => {
    return (
      <div className="space-y-6">
        <AlertBox
          color="success"
          icon={<CheckCircle />}
          message="New API Key created successfully"
        />
        
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              API Key Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Name</TableCell>
                  <TableCell className="font-mono text-sm">{showAPIData?.api_key.name}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Key ID</TableCell>
                  <TableCell className="font-mono text-sm">{showAPIData?.api_key.key}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Secret</TableCell>
                  <TableCell className="font-mono text-sm">{showAPIData?.api_key.secret}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <AlertBox
          color="warning"
          icon={<AlertTriangle />}
          title="Please copy above details"
          message="The API secret will only be shown now. It cannot be retrieved again. Please make sure you note the API secret. If you lose the API secret, you will have to generate a new API key."
        />
        
        <Button asChild>
          <a href={`/projects/${params.o_id}/settings/apikeys`}>Proceed</a>
        </Button>
      </div>
    )
  }

  return (
    <>
      <AppBreadcrumbs breadcrumbs={breadcrumbs} />
      <MainContainer className='gap-0 space-y-0'>
        <PageHeader header="Create API Key" />
        <div className="max-w-4xl">
          <div className="max-w-2xl">
            {showForm && (
              <Card className='mt-0'>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Key className="h-5 w-5" />
                    New API Key
                  </CardTitle>
                  <CardDescription>
                    Create a new API key for programmatic access to your organization data.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} ref={formRef} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name" className='mb-0.5'>Key name *</Label>
                        <Input 
                          id="name"
                          name="name" 
                          placeholder="Enter key name" 
                          required 
                          autoFocus
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="expires_at" className='mb-0.5'>Expiry date (optional)</Label>
                        <Input 
                          id="expires_at"
                          name="expires_at" 
                          type="date" 
                          min={new Date().toISOString().split('T')[0]}
                          placeholder="Select expiry date"
                        />
                      </div>
                    </div>
                    
                    <Button type="submit" disabled={loading} className="w-full md:w-auto">
                      {loading ? 'Creating...' : 'Create API Key'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}
            {!showForm && <APIKeyDetails />}
          </div>
        </div>
      </MainContainer>
    </>
  )
}
