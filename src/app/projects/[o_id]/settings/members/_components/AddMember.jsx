'use client'
import * as React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Plus, AlertTriangle } from 'lucide-react';

import { addMember } from '../action';



export default function AddMemberButton({ params }) {

  const [open, setOpen] = React.useState(false); // used to open or close the modal
  const [loading, setLoading] = React.useState(false); // use to show loading state for submit button
  const [error, setError] = React.useState(null); // used to show error state
  let onSubmit = async function (e) {
    // console.log(e);
    e.preventDefault(); // Prevent default form submission
    setError(null);
    setLoading(true);
    const formData = new FormData(e.target);
    formData.set('org', params.o_id);
    // console.log(Object.fromEntries(formData));
    try {
      const result = await addMember({ formData, params });
      // console.log(result);
      setOpen(false); // Close the modal only if submission is successful
    } catch (error) {
      setError(error);
      console.error(error);
    } finally {
      setLoading(false);
    }
  }
  return (
    <React.Fragment>
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          // alert('yo');
          setOpen(true)
        }}
      >
        <Plus size={16} className="mr-2" />
        Add Member
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              Add new member
            </DialogTitle>
            <DialogDescription>
              Invite new member to this organisation
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={onSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className='mb-0.5'>Email</Label>
                <Input 
                  id="email"
                  name="email" 
                  type="email" 
                  autoFocus 
                  required 
                  placeholder="user@example.com"
                />
              </div>
              {error && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription className="text-red-800">
                    {error.message}
                  </AlertDescription>
                </Alert>
              )}
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={loading}
                >
                  {loading ? 'Adding...' : 'Add Member'}
                </Button>
              </DialogFooter>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
}
