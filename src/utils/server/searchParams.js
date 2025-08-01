import "server-only";
import moment from "moment";
import { redirect } from "next/navigation";
function calculateDate(input) {
  if (input == "today") return moment().format("YYYY-MM-DD");
  else if (input == "month_end")
    return moment().endOf("month").format("YYYY-MM-DD");
  else if (input == "year_end")
    return moment().endOf("year").format("YYYY-MM-DD");
  else {
    let temp = input.split("_"); // last_12_months;
    if (temp[0] == "last") {
      if (temp[2] == "months")
        return moment()
          .subtract(temp[1] - 1, "months")
          .startOf("month")
          .format("YYYY-MM-DD");
    }
  }
}

export async function setDefaultSearchParams({
  defaultSearchParams,
  searchParams,
  params,
}) {
  let need_to_set_defaults = false;
  Object.keys(defaultSearchParams).forEach(function (key) {
    if (!searchParams[key])
      // ||searchParams[key]==''
      need_to_set_defaults = true;
  });
  if (need_to_set_defaults) {
    const newSearchParams = new URLSearchParams(searchParams);
    // newSearchParams.set('date_from', startDate);
    // newSearchParams.set('date_to', endDate);

    Object.keys(defaultSearchParams).forEach(function (key) {
      if (key == "date_from" || key == "date_to")
        newSearchParams.set(key, calculateDate(defaultSearchParams[key]));
      else if (key == "group_by")
        newSearchParams.set(key, defaultSearchParams[key]);
    });
    return redirect(`?${newSearchParams.toString()}`);
  }
}
