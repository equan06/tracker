function mod(n, m) {
    return ((n % m) + m) % m;
}

// TODO: need to find a date library, as currently we don't store times in UTC and right now JS dates are a headache

const locale = "en-ca";
/**
 * Get start/end of week, given date in mm-DD-yyyy
 * @param {*} dateStr 
 * @returns 
 */
export function getStartEndOfWk(dateStr) {
    // TODO: replace datestr - with / for local time parsing
    let date = new Date(dateStr); // assume yyyy-MM-dd format (or most other date formats that are interpreted correctly)
    let currDayOfWk = mod(date.getDay() - 1, 7); 
    let start = date.getDate() - currDayOfWk; // get the start day of the wk
    let startDate = new Date(date.getFullYear(), date.getMonth(), start).toLocaleDateString(locale);
    let endDate = new Date(date.setDate(start + 6)).toLocaleDateString(locale);
    return [startDate, endDate];
}   


export function getStartEndOfMth(month, year) {
    let startDate, endDate;
    if (month === -1) {
        startDate = new Date(year, 0, 1).toLocaleDateString(locale);
        endDate = new Date(year + 1, 0, 0).toLocaleDateString(locale);
    }
    else {
        startDate = new Date(year, month, 1).toLocaleDateString(locale);
        endDate = new Date(year, month + 1, 0).toLocaleDateString(locale);
    }
    console.log(month, year, startDate, endDate);
    return [startDate, endDate];
}

export function getStartEndOfYr(dateStr) {

}

// Currently this does not work (can be off by 1 day due to timezone)
export function addWeeksToDate(date, numberOfWeeks) {
    date.setDate(date.getDate() + numberOfWeeks * 7);
    return date;
}
  