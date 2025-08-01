import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MultiSelect } from '@/components/MultiSelect';
import { FilterContainer } from '@/components/Filters/FilterContainer';
import { FilterField } from '@/components/Filters/FilterField';
export default function TransactionsFilter({accounts=[],searchParams={},fields}){

  const pathname = usePathname();
  const router = useRouter();
  const [loading,setLoading]=useState({apply:false,reset:false});
  // console.log('searchParams',searchParams)

  if(!fields)
    fields=['sort_by','date','inflow','outflow','particulars','comments','accounts','type','group_by','entity','category','po']
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading({apply:true,reset:false});
    const form = event.currentTarget;
    const formData = new FormData(form);
    
    const currentSearchParams = new URLSearchParams();
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value) {
        currentSearchParams.append(key, value);
      }
    });

    const newSearchParams = new URLSearchParams();
    
    // Handle accounts multi-select specially
    const selectedAccounts = formData.getAll('accounts').filter(Boolean);
    if (selectedAccounts.length > 0) {
      newSearchParams.append('accounts', selectedAccounts.join(','));
    }
    
    // Handle other form fields
    formData.forEach((value, key) => {
      if (key !== 'accounts' && value !== "" && value !== "all") {
        newSearchParams.append(key, value.toString());
      }
    });

    const queryString = newSearchParams.toString();
    if(currentSearchParams.toString() === queryString) {
      setLoading({apply: false, reset: false});
      return;
    }
    await router.push(`${pathname}?${queryString}`);
  };
  const handleReset = async () => {
    setLoading({apply:false,reset:true});
    await router.push(pathname, undefined, { shallow: false });
    // setLoading({apply:false,reset:false});
  };
  useEffect(() => {
    setLoading({apply: false, reset: false});
  }, [pathname, searchParams]);

  // Highlighting styles for active fields
  const getHighlightClasses = (fieldName) => {
    return searchParams[fieldName] 
      ? "bg-primary/5 border-primary/30 focus:border-primary" 
      : "";
  };

  // Helper component for conditional field rendering
  const ConditionalFilterField = ({ field, label, size = 'full', children }) => {
    if (fields.indexOf(field) === -1) return null;
    
    return (
      <FilterField label={label} size={size}>
        {children}
      </FilterField>
    );
  };

  // Prepare accounts data for MultiSelect
  const accountOptions = accounts.map(account => ({
    value: account?.id?.toString(),
    label: account?.name
  }));
  return (
    <FilterContainer 
      onSubmit={handleSubmit} 
      onReset={handleReset}
      loading={loading}
    >
      
      <ConditionalFilterField field='date' label='Date From' size='half'>
        <Input 
          key={`date_from-${searchParams.date_from || 'empty'}`}
          name="date_from" 
          type="date" 
          size="sm"
          defaultValue={searchParams.date_from || ""} 
          className={getHighlightClasses("date_from")}
        />
      </ConditionalFilterField>

      <ConditionalFilterField field='date' label='Date To' size='half'>
        <Input 
          key={`date_to-${searchParams.date_to || 'empty'}`}
          name="date_to" 
          type="date" 
          size="sm"
          defaultValue={searchParams.date_to || ""} 
          className={getHighlightClasses("date_to")}
        />
      </ConditionalFilterField>
      
      <ConditionalFilterField field='amount' label='Amount from' size='third'>
        <Input 
          key={`amount_from-${searchParams.amount_from || 'empty'}`}
          name="amount_from" 
          type="number" 
          size="sm"
          defaultValue={searchParams.amount_from || ""} 
          className={getHighlightClasses("amount_from")}
        />
      </ConditionalFilterField>
      
      <ConditionalFilterField field='amount' label='Amount to' size='third'>
        <Input 
          key={`amount_to-${searchParams.amount_to || 'empty'}`}
          name="amount_to" 
          type="number" 
          size="sm"
          defaultValue={searchParams.amount_to || ""} 
          className={getHighlightClasses("amount_to")}
        />
      </ConditionalFilterField>
      
      <ConditionalFilterField field='amount' label='In / Out' size='third'>
        <Select name="flow_type" defaultValue={searchParams.flow_type || "all"}>
          <SelectTrigger size="sm" className={`w-full ${getHighlightClasses("flow_type")}`}>
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="inflow">Inflow</SelectItem>
            <SelectItem value="outflow">Outflow</SelectItem>
          </SelectContent>
        </Select>
      </ConditionalFilterField>
      
      <ConditionalFilterField field='particulars' label='Particulars'>
        <Input 
          key={`particulars-${searchParams.particulars || 'empty'}`}
          name="particulars" 
          placeholder="contains ..." 
          size="sm"
          defaultValue={searchParams.particulars || ""} 
          className={getHighlightClasses("particulars")}
        />
      </ConditionalFilterField>
      
      <ConditionalFilterField field='accounts' label='Accounts'>
        <MultiSelect
          name="accounts"
          defaultValue={searchParams.accounts || ""}
          options={accountOptions}
          placeholder="Select accounts..."
          size="sm"
          className={getHighlightClasses("accounts")}
        />
      </ConditionalFilterField>
      
      <ConditionalFilterField field='type' label='Type'>
        <Select name="type" defaultValue={searchParams.type || "all"}>
          <SelectTrigger size="sm" className={`w-full ${getHighlightClasses("type")}`}>
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="income">Income</SelectItem>
            <SelectItem value="expense">Expense</SelectItem>
            <SelectItem value="transfer">Transfer</SelectItem>
            <SelectItem value="asset">Asset</SelectItem>
            <SelectItem value="liability">Liability</SelectItem>
            <SelectItem value="unknown">Unknown</SelectItem>
          </SelectContent>
        </Select>
      </ConditionalFilterField>
      
      <ConditionalFilterField field='entity' label='Entity'>
        <Input 
          key={`entity-${searchParams.entity || 'empty'}`}
          name="entity" 
          placeholder="contains ..." 
          size="sm"
          defaultValue={searchParams.entity || ""} 
          className={getHighlightClasses("entity")}
        />
      </ConditionalFilterField>
      
      <ConditionalFilterField field='category' label='Category'>
        <Input 
          key={`category-${searchParams.category || 'empty'}`}
          name="category" 
          placeholder="contains ..." 
          size="sm"
          defaultValue={searchParams.category || ""} 
          className={getHighlightClasses("category")}
        />
      </ConditionalFilterField>
      
      <ConditionalFilterField field='comments' label='Comments'>
        <Input 
          key={`comments-${searchParams.comments || 'empty'}`}
          name="comments" 
          placeholder="contains ..." 
          size="sm"
          defaultValue={searchParams.comments || ""} 
          className={getHighlightClasses("comments")}
        />
      </ConditionalFilterField>
      
      <ConditionalFilterField field='sort_by' label='Sort By'>
        <Select name="sort_by" defaultValue={searchParams.sort_by || "DESC"}>
          <SelectTrigger size="sm" className={`w-full ${getHighlightClasses("sort_by")}`}>
            <SelectValue placeholder="Date DESC" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ASC">Date ASC</SelectItem>
            <SelectItem value="DESC">Date DESC</SelectItem>
          </SelectContent>
        </Select>
      </ConditionalFilterField>
      
      <ConditionalFilterField field='group_by' label='Group By'>
        <Select name="group_by" defaultValue={searchParams.group_by || "day"}>
          <SelectTrigger size="sm" className={`w-full ${getHighlightClasses("group_by")}`}>
            <SelectValue placeholder="Day" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="day">Day</SelectItem>
            <SelectItem value="week">Week</SelectItem>
            <SelectItem value="month">Month</SelectItem>
            <SelectItem value="year">Calendar Year</SelectItem>
          </SelectContent>
        </Select>
      </ConditionalFilterField>
      
    </FilterContainer>
  );
}