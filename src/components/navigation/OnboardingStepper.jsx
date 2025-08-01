'use client';

import { useRouter } from "next/navigation";
import { capitalize } from 'lodash';
import { Check } from 'lucide-react';

import { Typography } from '@/components/ui/typography';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function OnboardingStepper({ step, params }) {
  const router = useRouter();
  
  const onClick = () => {
    if (!params?.o_id) return;
    
    if (step == 'create_account')
      router.push(`/projects/${params.w_id}/accounts`);
    else if (step == 'upload_statement')
      router.push(`/projects/${params.w_id}/statements`);
    else if (step == 'categorize')
      router.push(`/projects/${params.w_id}/transactions`);
  };

  const getStepConfig = (stepName) => {
    const isActive = step === stepName;
    const isDone = ['create_account', 'upload_statement', 'categorize'].indexOf(stepName) < 
                   ['create_account', 'upload_statement', 'categorize'].indexOf(step) ||
                   step === 'done';
    
    return {
      state: isDone ? 'done' : (isActive ? 'active' : 'pending'),
      isActive,
      isDone,
      isClickable: isActive,
      onClick: isActive ? onClick : undefined
    };
  };

  const steps = [
    {
      id: 'create_account',
      number: 1,
      title: 'Create Account',
      description: 'Create your bank and credit card accounts.',
      config: getStepConfig('create_account')
    },
    {
      id: 'upload_statement', 
      number: 2,
      title: 'Upload statement',
      description: 'Upload your bank or credit card statements',
      config: getStepConfig('upload_statement')
    },
    {
      id: 'categorize',
      number: 3,
      title: 'Categorize transactions',
      description: 'as "Income", "Expense", "Transfer", "Asset", "Loan", or "Unknown"',
      config: getStepConfig('categorize')
    }
  ];

  const StepIndicator = ({ stepConfig, number }) => {
    if (stepConfig.isDone) {
      return (
        <Badge variant="default" className="size-6 rounded-full bg-primary text-primary-foreground p-0 flex items-center justify-center">
          <Check size={14} />
        </Badge>
      );
    }
    
    return (
      <Badge 
        variant={stepConfig.isActive ? "default" : "outline"} 
        className={cn(
          "size-6 rounded-full p-0 flex items-center justify-center",
          stepConfig.isActive ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground"
        )}
      >
        {number}
      </Badge>
    );
  };

  return (
    <div className="space-y-4">
      {steps.map((stepItem, index) => (
        <div key={stepItem.id} className="flex gap-3">
          <div className="flex flex-col items-center">
            <StepIndicator stepConfig={stepItem.config} number={stepItem.number} />
            {index < steps.length - 1 && (
              <div className="w-px h-6 bg-border mt-2" />
            )}
          </div>
          
          <div className="flex-1 pb-2">
            <div
              className={cn(
                "cursor-pointer",
                stepItem.config.isClickable && "hover:text-primary"
              )}
              onClick={stepItem.config.onClick}
            >
              <Typography level="title-md" className="font-medium">
                {stepItem.title}
              </Typography>
              {stepItem.config.isActive ? (
                <Typography level="body-sm" className="text-muted-foreground mt-1">
                  {stepItem.description}
                </Typography>
              ) : (
                <Typography level="body-xs" className="text-muted-foreground mt-1">
                  {stepItem.config.isDone ? 'Done' : capitalize(stepItem.config.state)}
                </Typography>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}