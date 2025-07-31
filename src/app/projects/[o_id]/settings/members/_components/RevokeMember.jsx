'use client'
import * as React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

import {revokeMember} from '../action';



export default function RevokeMember({params,member}) {

  const [open, setOpen] = React.useState(false); // used to open or close the modal
  const [loading, setLoading] = React.useState(false); // use to show loading state for submit button
  const [error,setError] = React.useState(null); // used to show error state
  let onSubmit = async function(e){
    // console.log(e);
    e.preventDefault(); // Prevent default form submission
    setError(null);
    setLoading(true);
    const formData = new FormData(e.target);
    formData.set('membership',member.id);
    // console.log(Object.fromEntries(formData));
    try {
      const result = await revokeMember({formData,params});
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
        onClick={() => setOpen(true)}
        className="text-red-600 border-red-600 hover:bg-red-50"
        size="sm"
      >
        Revoke
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle size={20} className="text-red-500" />
              Please confirm
            </DialogTitle>
            <DialogDescription>
              Revoke access for <strong>{member.user.email}</strong>?
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={onSubmit}>
            <div className="space-y-4">
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
                  variant="destructive" 
                  disabled={loading}
                >
                  {loading ? 'Revoking...' : 'Yes, revoke access'}
                </Button>
              </DialogFooter>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
}
