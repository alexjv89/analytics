import formatDate from "./formatDate";
export default function generateDates(searchParams){
  const dates = [];
  let currentDate = new Date(searchParams.date_from);
  const endDateObj = new Date(searchParams.date_to);
  
  while (currentDate <= endDateObj) {
    if(searchParams.group_by=='day'){
      const dateString = formatDate.getDayString(currentDate);
      dates.push(dateString);
      currentDate.setDate(currentDate.getDate() + 1);
    }
    else if(searchParams.group_by=='week'){
      const dateString = formatDate.getWeekString(currentDate);
      if (!dates.includes(dateString)) {
        dates.push(dateString);
      }
      currentDate.setDate(currentDate.getDate() + 7);
    }
    else if(searchParams.group_by=='month'){
      const dateString = formatDate.getMonthString(currentDate);
      dates.push(dateString);
      currentDate.setMonth(currentDate.getMonth() + 1);
    }
    else if(searchParams.group_by=='year'){
      const dateString = formatDate.getYearString(currentDate);
      dates.push(dateString);
      currentDate.setFullYear(currentDate.getFullYear() + 1);
    }
  }
  return dates;
}