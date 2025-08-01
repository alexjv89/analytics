export function getDayString(date){
  if(typeof date =='string')
    date = new Date(date);
  const dateString = date.toISOString().split('T')[0];
  return dateString;
}

export function getWeekString(date){
  if(typeof date =='string')
    date = new Date(date);
  // Format as "YYYY-Www" (ISO week format)
  const year = date.getFullYear();
  const week = Math.ceil((date - new Date(year, 0, 1) + 1) / (7 * 24 * 60 * 60 * 1000));
  const weekString = `${year}-W${week.toString().padStart(2, '0')}`;
  return weekString;
}


export function getMonthString(date){
  if(typeof date =='string')
    date = new Date(date);
  // Format as "YYYY-MM"
  const monthString = date.toISOString().slice(0, 7);
  return monthString;
}

export function getYearString(date){
  if(typeof date =='string')
    date = new Date(date);
  // Format as "YYYY"
  const yearString = date.getFullYear().toString();
  return yearString;
}


export function getFinancialYearString(date){
  if(typeof date =='string')
    date = new Date(date);

}
export function getDateString(date,as='day'){
  if(as=='day')
    return getDayString(date);
  if(as=='week')
    return getWeekString(date);
  if(as=='month')
    return getMonthString(date);
  if(as=='year')
    return getYearString(date);
}

// this is same as the above function. Just better variable naming to be more intuitive
export function getPeriodString(date,group_by='day'){
  if(group_by=='day')
    return getDayString(date);
  if(group_by=='week')
    return getWeekString(date);
  if(group_by=='month')
    return getMonthString(date);
  if(group_by=='year')
    return getYearString(date);
}

const formatDate={
  getDayString,
  getWeekString,
  getMonthString,
  getYearString,
  getFinancialYearString,
  getDateString,
  getPeriodString,
}
export default formatDate;