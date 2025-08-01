import { Label } from '@/components/ui/label';

// Reusable FilterField component
export const FilterField = ({ label, children, size = 'full' }) => {
  let widthClass;
  if (size === 'half') {
    // Half width on desktop, full width on mobile
    widthClass = 'w-full md:w-[calc(50%-0.5rem)]';
  } else if (size === 'third') {
    // Full width on mobile, half on tablet, third on desktop
    widthClass = 'w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.75rem)]';
  } else {
    widthClass = 'w-full';
  }
  
  return (
    <div className={`space-y-[2px] ${widthClass}`}>
      <Label className="text-sm font-medium">{label}</Label>
      {children}
    </div>
  );
};