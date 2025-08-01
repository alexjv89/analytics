// this container implements overflow correctly. 
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

export default function StatsBarContainer({items=[],children}){
  
  function nF(num,options){
    const number = new Intl.NumberFormat('en-IN');
    if(parseFloat(num)){
      if(typeof num =='number')
        num = num?.toFixed(0)
      return number.format(num);
    }else{
      return num;
    }
  }
  
  const Metric = function({label,value,color}){
    if(!color){
      color = value>0?'success':'warning';
      if(value==0)
        color='neutral'
    }
    
    const colorClasses = {
      success: 'text-foreground',
      warning: 'text-amber-600', 
      neutral: 'text-muted-foreground',
      danger: 'text-destructive',
    };
    
    return <div>
      <div className="text-xs text-muted-foreground truncate max-w-[100px]">{label}:</div>
      <div className={cn("text-lg font-semibold", colorClasses[color])}>
        {nF(value)}
      </div>
    </div>
  }
  return (
    <Card className="bg-white pt-4 pb-3">
      <CardContent className="">
        <div className="flex gap-4 overflow-x-auto  scrollbar-hide">
          {items.map((item,i)=>{
            if(item.type=='metric')
              return <Metric key={i} label={item.label} value={item.value} color={item.color}/>
            if(item.type=='divider')
              return <div key={i} className="flex items-center h-10"><Separator orientation="vertical" /></div>
          })}
          {children}
        </div>
      </CardContent>
    </Card>
  );
}