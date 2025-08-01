'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Typography } from '@/components/ui/typography';
import { hideOnboarding } from '@/components/Navbar/Sidebar/action';
import OnboardingStepper from './OnboardingStepper';

export default function OnboardingCard({ counts, params }) {
  const router = useRouter();
  const [show, setShow] = useState(true);
  
  let steps = ['create_account', 'upload_statement', 'categorize', 'done', 'close'];
  let step = '';
  
  if (counts.accounts == 0)
    step = 'create_account';
  else if (counts.statements == 0)
    step = 'upload_statement';
  else if (counts.transaction_types < 3)
    step = 'categorize';
  else
    step = 'done';
  
  let progress = 0;
  if (step == 'create_account')
    progress = 5;
  else if (step == 'upload_statement')
    progress = 33;
  else if (step == 'categorize')
    progress = 66;
  else if (step == 'done')
    progress = 100;

  async function onClickCloseOnboarding() {
    console.log('close onboarding called');
    setShow(false); // optimistic update
    let response = await hideOnboarding({ params });
    if (response?.status == 'success')
      console.log('Feature flag updated', response.message);
    else 
      console.log('something went wrong:', response.message);
  }

  if (!show)
    return null;

  return (
    <Card className="bg-green-50 border-green-200 shadow-none mx-0">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <Typography level="title-sm" className="py-1">
            Getting started...
          </Typography>
          {step == 'done' && (
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-1"
              onClick={onClickCloseOnboarding}
            >
              <X size={16} />
            </Button>
          )}
        </div>
        <Typography level="body-xs" className="-mt-2">
          Let&apos;s get you rolling
        </Typography>
      </CardHeader>
      <CardContent className="pt-0">
        <Progress value={progress} className="mb-4" />
        <OnboardingStepper step={step} params={params} />
      </CardContent>
    </Card>
  );
}